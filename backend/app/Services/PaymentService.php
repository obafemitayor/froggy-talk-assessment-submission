<?php

namespace App\Services;

use App\Enums\PaymentStatus as PaymentStatusEnum;
use App\Events\PaymentStatus;
use App\Jobs\ProcessPaymentJob;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function __construct(
        private readonly CurrencyService $currencyService,
    ) {}

    public function initiate(User $customer, string $amount, string $currency): void
    {
        DB::transaction(function () use ($customer, $amount, $currency): void {
            $payment = $this->createPayment($customer, $amount, $currency);
            ProcessPaymentJob::dispatch($payment->id);
        });
    }

    private function createPayment(User $customer, string $amount, string $currency): Payment
    {
        return $customer->payments()->create([
            'amount_cents' => $this->currencyService->toCents($amount, $currency),
            'currency' => strtoupper($currency),
            'status' => PaymentStatusEnum::Pending,
            'processed_at' => null,
        ]);
    }

    public function updatePaymentStatus(Payment $payment, PaymentStatusEnum $status): void
    {
        $payment->forceFill([
            'status' => $status,
            'processed_at' => Carbon::now(),
        ])->save();
    }

    public function broadcastStatusChange(array $payload): void
    {
        PaymentStatus::dispatch(
            paymentId: $payload['paymentId'],
            customerId: $payload['customerId'],
            status: $payload['status'],
            timestamp: $payload['timestamp'],
            balanceCents: $payload['balanceCents'],
            currency: $payload['currency'],
            amountCents: $payload['amountCents'],
            message: $payload['message'],
        );
    }
}
