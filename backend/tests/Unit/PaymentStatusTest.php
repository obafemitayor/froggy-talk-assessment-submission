<?php

namespace Tests\Unit;

use App\Enums\PaymentStatus;
use App\Events\PaymentStatus as PaymentStatusEvent;
use Tests\TestCase;

class PaymentStatusTest extends TestCase
{
    public function test_event_exposes_expected_payload(): void
    {
        $event = new PaymentStatusEvent(
            paymentId: 15,
            customerId: 8,
            status: PaymentStatus::Successful,
            timestamp: '2026-06-24T18:45:00+00:00',
            balanceCents: 4200,
            currency: 'USD',
            amountCents: 1500,
            message: null,
        );

        $this->assertSame('payment.status.changed', $event->broadcastAs());
        $this->assertSame([
            'payment_id' => 15,
            'customer_id' => 8,
            'status' => 'successful',
            'timestamp' => '2026-06-24T18:45:00+00:00',
            'balance_cents' => 4200,
            'currency' => 'USD',
            'amount_cents' => 1500,
            'message' => null,
        ], $event->broadcastWith());
    }
}
