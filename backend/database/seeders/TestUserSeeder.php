<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Seed a predictable user for local testing.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test Customer',
                'password' => Hash::make('password'),
                'wallet_balance_cents' => 10000,
                'email_verified_at' => now(),
            ],
        );
    }
}
