import { useState } from 'react';
import { login as loginRequest } from '../services/authService';

type Customer = {
    id: number;
    email?: string;
    name?: string;
};

const readStoredToken = (): string | null => localStorage.getItem('billing.jwt');

const readStoredCustomer = (): Customer | null => {
    try {
        return JSON.parse(localStorage.getItem('billing.customer') ?? 'null') as Customer | null;
    } catch {
        return null;
    }
};

export function useAuth() {
    const [token, setToken] = useState<string | null>(() => readStoredToken());
    const [customer, setCustomer] = useState<Customer | null>(() => readStoredCustomer());
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const login = async (email: string, password: string) => {
        setBusy(true);
        setError('');

        try {
            const data = await loginRequest(email, password);
            localStorage.setItem('billing.jwt', data.token);
            localStorage.setItem('billing.customer', JSON.stringify(data.user));
            setToken(data.token);
            setCustomer(data.user);
            return data;
        } catch (exception) {
            setError(exception instanceof Error ? exception.message : 'Login failed.');
            throw exception;
        } finally {
            setBusy(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('billing.jwt');
        localStorage.removeItem('billing.customer');
        setToken(null);
        setCustomer(null);
    };

    return {
        token,
        customer,
        busy,
        error,
        setError,
        login,
        logout,
    };
}
