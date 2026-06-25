<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BalanceController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $customer = $request->user();

        return response()->json([
            'data' => [
                'customer_id' => $customer->id,
                'balance_cents' => $customer->wallet_balance_cents,
                'balance' => number_format($customer->wallet_balance_cents / 100, 2, '.', ''),
                'currency' => 'USD',
            ],
        ]);
    }
}
