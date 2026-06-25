import { useState } from 'react';
import { initiatePayment as initiatePaymentRequest } from '../services/paymentService';

export function usePayments(token: string | null) {
    const [status, setStatus] = useState('Idle');
    const [error, setError] = useState('');

    const initiatePayment = async (amount: number, currency: string) => {
        if (!token) {
            throw new Error('Sign in before initiating a payment.');
        }

        setStatus('Pending');
        setError('');

        try {
            await initiatePaymentRequest(token, amount, currency);
            return 'Pending';
        } catch (exception) {
            setStatus('Failed');
            setError(exception instanceof Error ? exception.message : 'Payment request failed.');
            throw exception;
        }
    };

    return {
        status,
        setStatus,
        error,
        setError,
        initiatePayment,
    };
}
