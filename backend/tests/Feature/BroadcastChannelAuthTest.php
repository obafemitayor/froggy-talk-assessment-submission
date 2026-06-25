<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BroadcastChannelAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_authenticate_private_channel(): void
    {
        $customer = User::factory()->create();

        $this->postJson('/broadcasting/auth', [
            'socket_id' => '1234.5678',
            'channel_name' => "private-customers.{$customer->id}",
        ])->assertUnauthorized();
    }

    public function test_customer_can_authenticate_their_private_channel(): void
    {
        $customer = User::factory()->create();

        $token = $this->login($customer);

        $this->postJson('/broadcasting/auth', [
            'socket_id' => '1234.5678',
            'channel_name' => "private-customers.{$customer->id}",
        ], $this->authHeaders($token))->assertOk();
    }

    public function test_customer_cannot_authenticate_another_customers_channel(): void
    {
        $customer = User::factory()->create();
        $otherCustomer = User::factory()->create();

        $token = $this->login($customer);

        $this->postJson('/broadcasting/auth', [
            'socket_id' => '1234.5678',
            'channel_name' => "private-customers.{$otherCustomer->id}",
        ], $this->authHeaders($token))->assertForbidden();
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
