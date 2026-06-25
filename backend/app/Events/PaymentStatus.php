<?php

namespace App\Events;

use App\Enums\PaymentStatus as PaymentStatusEnum;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentStatus implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $paymentId,
        public readonly int $customerId,
        public readonly PaymentStatusEnum $status,
        public readonly string $timestamp,
        public readonly int $balanceCents,
        public readonly string $currency,
        public readonly int $amountCents,
        public readonly ?string $message = null,
    ) {}

    public function broadcastOn(): Channel
    {
        return new PrivateChannel("customers.{$this->customerId}");
    }

    public function broadcastAs(): string
    {
        return 'payment.status.changed';
    }

    public function broadcastWith(): array
    {
        return [
            'payment_id' => $this->paymentId,
            'customer_id' => $this->customerId,
            'status' => $this->status->value,
            'timestamp' => $this->timestamp,
            'balance_cents' => $this->balanceCents,
            'currency' => $this->currency,
            'amount_cents' => $this->amountCents,
            'message' => $this->message,
        ];
    }
}
