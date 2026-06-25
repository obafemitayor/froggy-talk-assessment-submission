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
use Tests\TestCase;

class ProcessPaymentJobTest extends TestCase
{
    use RefreshDatabase;

    public function test_job_processes_successful_payment_and_broadcasts_balance(): void
    {
        Event::fake([PaymentStatusEvent::class]);

        $customer = User::factory()->create([
            'wallet_balance_cents' => 10000,
        ]);

        $payment = Payment::factory()->create([
            'customer_id' => $customer->id,
            'amount_cents' => 2500,
            'currency' => 'USD',
            'status' => PaymentStatus::Pending,
        ]);

        $job = new class($payment->id) extends ProcessPaymentJob
        {
            protected function resolveStatus(): PaymentStatus
            {
                return PaymentStatus::Successful;
            }
        };

        $job->handle(app(PaymentService::class));

        $this->assertDatabaseHas('users', [
            'id' => $customer->id,
            'wallet_balance_cents' => 7500,
        ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => PaymentStatus::Successful->value,
        ]);

        Event::assertDispatched(PaymentStatusEvent::class, function (PaymentStatusEvent $event) use ($customer): bool {
            return $event->customerId === $customer->id
                && $event->status === PaymentStatus::Successful
                && $event->balanceCents === 7500;
        });
    }

    public function test_job_processes_failed_payment_and_broadcasts_balance(): void
    {
        Event::fake([PaymentStatusEvent::class]);

        $customer = User::factory()->create([
            'wallet_balance_cents' => 10000,
        ]);

        $payment = Payment::factory()->create([
            'customer_id' => $customer->id,
            'amount_cents' => 2500,
            'currency' => 'USD',
            'status' => PaymentStatus::Pending,
        ]);

        $job = new class($payment->id) extends ProcessPaymentJob
        {
            protected function resolveStatus(): PaymentStatus
            {
                return PaymentStatus::Failed;
            }
        };

        $job->handle(app(PaymentService::class));

        $this->assertDatabaseHas('users', [
            'id' => $customer->id,
            'wallet_balance_cents' => 10000,
        ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => PaymentStatus::Failed->value,
        ]);

        Event::assertDispatched(PaymentStatusEvent::class, function (PaymentStatusEvent $event) use ($customer): bool {
            return $event->customerId === $customer->id
                && $event->status === PaymentStatus::Failed
                && $event->balanceCents === 10000;
        });
    }

    public function test_job_fails_when_balance_is_insufficient_and_broadcasts_message(): void
    {
        Event::fake([PaymentStatusEvent::class]);

        $customer = User::factory()->create([
            'wallet_balance_cents' => 1000,
        ]);

        $payment = Payment::factory()->create([
            'customer_id' => $customer->id,
            'amount_cents' => 2500,
            'currency' => 'USD',
            'status' => PaymentStatus::Pending,
        ]);

        $job = new class($payment->id) extends ProcessPaymentJob
        {
            protected function resolveStatus(): PaymentStatus
            {
                return PaymentStatus::Successful;
            }
        };

        $job->handle(app(PaymentService::class));

        $this->assertDatabaseHas('users', [
            'id' => $customer->id,
            'wallet_balance_cents' => 1000,
        ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => PaymentStatus::Failed->value,
        ]);

        Event::assertDispatched(PaymentStatusEvent::class, function (PaymentStatusEvent $event) use ($customer): bool {
            return $event->customerId === $customer->id
                && $event->status === PaymentStatus::Failed
                && $event->balanceCents === 1000
                && $event->message === 'insufficient_balance';
        });
    }
}
