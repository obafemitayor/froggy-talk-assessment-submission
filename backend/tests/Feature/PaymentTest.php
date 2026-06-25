<?php

namespace Tests\Feature;

use App\Jobs\ProcessPaymentJob;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_payment_initiation_returns_accepted_and_queues_processing_job(): void
    {
        Queue::fake();

        $customer = User::factory()->create([
            'wallet_balance_cents' => 10000,
        ]);

        $token = $this->login($customer);

        $response = $this->postJson('/api/payments', [
            'amount' => 25.00,
            'currency' => 'USD',
        ], $this->authHeaders($token));

        $response->assertStatus(202);
        $this->assertSame('', $response->getContent());

        $this->assertDatabaseHas('payments', [
            'customer_id' => $customer->id,
            'amount_cents' => 2500,
            'currency' => 'USD',
            'status' => 'pending',
        ]);

        Queue::assertPushed(ProcessPaymentJob::class);
    }

    public function test_unauthenticated_user_cannot_access_payment_endpoint(): void
    {
        $this->postJson('/api/payments', [
            'amount' => 25.00,
            'currency' => 'USD',
        ])->assertUnauthorized();
    }

    private function login(User $customer): string
    {
        return $this->postJson('/api/auth/login', [
            'email' => $customer->email,
            'password' => 'password',
        ])->json('data.access_token');
    }

    /**
     * @return array<string, string>
     */
    private function authHeaders(string $token): array
    {
        return [
            'Authorization' => "Bearer {$token}",
        ];
    }
}
