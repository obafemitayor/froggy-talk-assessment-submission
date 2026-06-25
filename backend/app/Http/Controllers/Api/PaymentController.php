<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InitiatePaymentRequest;
use App\Services\PaymentService;
use Symfony\Component\HttpFoundation\Response;

class PaymentController extends Controller
{
    public function initiatePayment(
        InitiatePaymentRequest $request,
        PaymentService $paymentService,
    ): Response {
        $validated = $request->validated();

        $paymentService->initiate(
            customer: $request->user(),
            amount: (string) $validated['amount'],
            currency: (string) $validated['currency'],
        );

        return response()->noContent(202);
    }
}
