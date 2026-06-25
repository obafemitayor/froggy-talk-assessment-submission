<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BalanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_balance_endpoint_returns_current_balance(): void
    {
        $customer = User::factory()->create([
            'wallet_balance_cents' => 12345,
        ]);

        $token = $this->login($customer);

        $this->withHeaders($this->authHeaders($token))
            ->getJson('/api/balance')
            ->assertOk()
            ->assertJsonPath('data.customer_id', $customer->id)
            ->assertJsonPath('data.balance_cents', 12345)
            ->assertJsonPath('data.balance', '123.45');
    }

    public function test_unauthenticated_user_cannot_access_balance_endpoint(): void
    {
        $this->getJson('/api/balance')->assertUnauthorized();
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
