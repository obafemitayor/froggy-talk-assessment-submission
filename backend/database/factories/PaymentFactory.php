<?php

namespace Database\Factories;

use App\Enums\PaymentStatus;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'customer_id' => User::factory(),
            'amount_cents' => fake()->numberBetween(100, 50000),
            'currency' => 'USD',
            'status' => PaymentStatus::Pending,
            'processed_at' => null,
        ];
    }
}
