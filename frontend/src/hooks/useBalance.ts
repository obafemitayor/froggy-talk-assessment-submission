import { useCallback, useEffect, useState } from 'react';
import { fetchBalance, type BalanceData } from '../services/balanceService';

export type BalanceState = {
    amountCents: number;
    currency: string;
    updatedAt: string | null;
};

export function useBalance(token: string | null) {
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState<BalanceState>({ amountCents: 0, currency: 'USD', updatedAt: null });
    const [error, setError] = useState('');

    const refresh = useCallback(
        async (activeToken: string | null = token) => {
            if (!activeToken) {
                setLoading(false);
                return null;
            }

            setLoading(true);

            try {
                const data: BalanceData = await fetchBalance(activeToken);
                setBalance({
                    amountCents: data.balance_cents,
                    currency: data.currency,
                    updatedAt: data.updated_at,
                });
                return data;
            } catch (exception) {
                setError(exception instanceof Error ? exception.message : 'Unable to fetch balance.');
                throw exception;
            } finally {
                setLoading(false);
            }
        },
        [token],
    );

    useEffect(() => {
        if (token) {
            refresh(token).catch(() => {});
        } else {
            setLoading(false);
        }
    }, [token, refresh]);

    return {
        balance,
        loading,
        error,
        setError,
        setBalance,
        refresh,
    };
}
