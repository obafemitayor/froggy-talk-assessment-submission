<?php

namespace App\Services;

use InvalidArgumentException;

class CurrencyService
{
    public function toCents(string $amount, string $currency = 'USD'): int
    {
        $normalizedCurrency = strtoupper($currency);

        if ($normalizedCurrency !== 'USD') {
            throw new InvalidArgumentException('Unsupported currency.');
        }

        $normalizedAmount = trim($amount);
        [$major, $minor] = array_pad(explode('.', $normalizedAmount, 2), 2, '0');

        return ((int) $major * 100) + (int) str_pad(substr($minor, 0, 2), 2, '0');
    }
}
