import { useEffect, useState } from 'react';
import { createReverbClient } from '../services/realtimeService';

type Customer = {
    id: number;
};

type Options = {
    token: string | null;
    customer: Customer | null;
    setBalance: (value: { amountCents: number; currency: string; updatedAt: string | null }) => void;
    setStatus: (value: string) => void;
};

export function usePaymentChannel({ token, customer, setBalance, setStatus }: Options) {
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token || !customer) {
            return undefined;
        }

        const echo = createReverbClient(token);
        echo.private(`customers.${customer.id}`)
            .error((subscriptionError: unknown) => {
                setError(subscriptionError instanceof Error ? subscriptionError.message : 'Unable to connect to Reverb.');
            })
            .listen('.payment.status.changed', (event: Record<string, unknown>) => {
                const status = String(event.status ?? 'unknown');
                const timestamp = String(event.timestamp ?? new Date().toISOString());
                const balanceCents = Number(event.balance_cents ?? event.balanceCents ?? 0);
                const currency = String(event.currency ?? 'USD');
                const message = String(event.message ?? '');

                if (Number.isFinite(balanceCents)) {
                    setBalance({
                        amountCents: balanceCents,
                        currency,
                        updatedAt: timestamp,
                    });
                }

                if (message === 'insufficient_balance') {
                    setStatus('Insufficient balance');
                    return;
                }

                setStatus(status === 'successful' ? 'Successful' : status === 'failed' ? 'Failed' : 'Updated');
            });

        return () => {
            echo.disconnect();
        };
    }, [token, customer, setBalance, setStatus]);

    return {
        error,
        setError,
    };
}
