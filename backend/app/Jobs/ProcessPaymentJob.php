<?php

namespace App\Jobs;

use App\Enums\PaymentStatus as PaymentStatusEnum;
use App\Models\Payment;
use App\Models\User;
use App\Services\PaymentService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class ProcessPaymentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly int $paymentId,
    ) {}

    public function handle(
        PaymentService $paymentService,
    ): void {
        $payload = DB::transaction(function () use ($paymentService): ?array {
            return $this->processPayment($paymentService);
        });

        if ($payload === null) {
            return;
        }

        $paymentService->broadcastStatusChange($payload);
    }

    private function processPayment(PaymentService $paymentService): ?array
    {
        $payment = $this->getPayment();
        if ($payment->status !== PaymentStatusEnum::Pending) {
            return null;
        }

        $balanceCents = (int) $payment->customer_balance_cents;
        if ($balanceCents < $payment->amount_cents) {
            $paymentService->updatePaymentStatus($payment, PaymentStatusEnum::Failed);
            return $this->buildPayload(
                payment: $payment,
                balanceCents: $balanceCents,
                message: 'insufficient_balance',
                status: PaymentStatusEnum::Failed,
            );
        }

        $status = $this->resolveStatus();
        if ($status === PaymentStatusEnum::Successful) {
            $this->decreaseBalance($payment);
            $balanceCents -= $payment->amount_cents;
        }

        $paymentService->updatePaymentStatus($payment, $status);
        return $this->buildPayload(
            payment: $payment,
            balanceCents: $balanceCents,
            message: null,
            status: $payment->status,
        );
    }

    protected function resolveStatus(): PaymentStatusEnum
    {
        return random_int(1, 100) <= 70
            ? PaymentStatusEnum::Successful
            : PaymentStatusEnum::Failed;
    }

    private function getPayment(): Payment
    {
        return Payment::query()
            ->select([
                'payments.*',
                'users.wallet_balance_cents as customer_balance_cents',
            ])
            ->join('users', 'users.id', '=', 'payments.customer_id')
            ->where('payments.id', $this->paymentId)
            ->lockForUpdate()
            ->firstOrFail();
    }

    private function decreaseBalance(Payment $payment): void
    {
        User::query()
            ->whereKey($payment->customer_id)
            ->decrement('wallet_balance_cents', $payment->amount_cents);
    }

    private function buildPayload(Payment $payment, int $balanceCents, ?string $message, PaymentStatusEnum $status): array
    {
        return [
            'paymentId' => $payment->id,
            'customerId' => $payment->customer_id,
            'status' => $status,
            'timestamp' => $payment->processed_at->toIso8601String(),
            'balanceCents' => $balanceCents,
            'currency' => $payment->currency,
            'amountCents' => $payment->amount_cents,
            'message' => $message,
        ];
    }
}
