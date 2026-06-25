<?php

namespace Tests\Unit;

use App\Services\CurrencyService;
use InvalidArgumentException;
use Tests\TestCase;

class CurrencyServiceTest extends TestCase
{
    public function test_converts_usd_amount_to_cents(): void
    {
        $service = new CurrencyService();

        $this->assertSame(2500, $service->toCents('25.00'));
        $this->assertSame(2599, $service->toCents('25.99'));
        $this->assertSame(2500, $service->toCents('25'));
    }

    public function test_rejects_unsupported_currency(): void
    {
        $this->expectException(InvalidArgumentException::class);

        (new CurrencyService())->toCents('25.00', 'EUR');
    }
}
