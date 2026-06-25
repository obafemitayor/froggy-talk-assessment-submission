<?php

namespace Tests\Unit;

use App\Enums\PaymentStatus;
use App\Events\PaymentStatus as PaymentStatusEvent;
use App\Jobs\ProcessPaymentJob;
use App\Models\Payment;
use App\Models\User;
use App\Services\PaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class PaymentServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_initiate_creates_pending_payment_and_queues_job(): void
    {
        Queue::fake();

        $customer = User::factory()->create();

        app(PaymentService::class)->initiate($customer, '25.00', 'USD');

        $this->assertDatabaseHas('payments', [
            'customer_id' => $customer->id,
            'amount_cents' => 2500,
            'currency' => 'USD',
            'status' => PaymentStatus::Pending->value,
        ]);

        Queue::assertPushed(ProcessPaymentJob::class);
    }

    public function test_update_status_successful_updates_payment_only(): void
    {
        $customer = User::factory()->create([
            'wallet_balance_cents' => 10000,
        ]);

        $payment = Payment::factory()->create([
            'customer_id' => $customer->id,
            'amount_cents' => 2500,
            'currency' => 'USD',
            'status' => PaymentStatus::Pending,
        ]);

        app(PaymentService::class)->updatePaymentStatus($payment, PaymentStatus::Successful);

        $this->assertDatabaseHas('users', [
            'id' => $customer->id,
            'wallet_balance_cents' => 10000,
        ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => PaymentStatus::Successful->value,
        ]);
    }

    public function test_update_status_failed_updates_payment_only(): void
    {
        $customer = User::factory()->create([
            'wallet_balance_cents' => 10000,
        ]);

        $payment = Payment::factory()->create([
            'customer_id' => $customer->id,
            'amount_cents' => 2500,
            'currency' => 'USD',
            'status' => PaymentStatus::Pending,
        ]);

        app(PaymentService::class)->updatePaymentStatus($payment, PaymentStatus::Failed);

        $this->assertDatabaseHas('users', [
            'id' => $customer->id,
            'wallet_balance_cents' => 10000,
        ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => PaymentStatus::Failed->value,
        ]);
    }

    public function test_broadcast_status_change_dispatches_event(): void
    {
        Event::fake([PaymentStatusEvent::class]);

        $customer = User::factory()->create(['wallet_balance_cents' => 1000]);

        $payment = Payment::factory()->create([
            'customer_id' => $customer->id,
            'amount_cents' => 2500,
            'currency' => 'USD',
            'status' => PaymentStatus::Successful,
            'processed_at' => now(),
        ]);

        app(PaymentService::class)->broadcastStatusChange([
            'paymentId' => $payment->id,
            'customerId' => $customer->id,
            'status' => PaymentStatus::Successful,
            'timestamp' => $payment->processed_at->toIso8601String(),
            'balanceCents' => 1000,
            'currency' => 'USD',
            'amountCents' => 2500,
            'message' => 'insufficient_balance',
        ]);

        Event::assertDispatched(PaymentStatusEvent::class, function (PaymentStatusEvent $event) use ($customer): bool {
            return $event->customerId === $customer->id
                && $event->status === PaymentStatus::Successful
                && $event->balanceCents === 1000
                && $event->message === 'insufficient_balance';
        });
    }
}
