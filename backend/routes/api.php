<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BalanceController;
use App\Http\Controllers\Api\PaymentController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function (): void {
    Route::get('/balance', [BalanceController::class, 'show']);
    Route::post('/payments', [PaymentController::class, 'initiatePayment']);
});
