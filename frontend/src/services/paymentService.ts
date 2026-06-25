import { request } from './apiClient';

export async function initiatePayment(token: string, amount: number, currency: string): Promise<void> {
    const response = await request('/api/payments', {
        method: 'POST',
        token,
        body: JSON.stringify({ amount, currency }),
    });

    if (response.status !== 202) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? 'Payment request failed.');
    }
}
