import { request } from './apiClient';

export type BalanceData = {
    balance_cents: number;
    currency: string;
    updated_at: string | null;
};

type ApiEnvelope = {
    data: BalanceData;
};

export async function fetchBalance(token: string): Promise<BalanceData> {
    const response = await request('/api/balance', { token });

    if (!response.ok) {
        throw new Error('Unable to fetch balance.');
    }

    const payload = (await response.json()) as ApiEnvelope;
    return payload.data;
}
