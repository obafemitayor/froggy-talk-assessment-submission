import { request } from './apiClient';

type LoginResponse = {
    token: string;
    user: {
        id: number;
        email?: string;
        name?: string;
    };
};

type ApiEnvelope = {
    data: {
        access_token: string;
        token_type: string;
        expires_in: number;
        user: LoginResponse['user'];
    };
    message?: string;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    const payload = (await response.json().catch(() => null)) as ApiEnvelope | null;

    if (!response.ok) {
        throw new Error(payload?.message ?? 'Login failed.');
    }

    return {
        token: payload?.data.access_token as string,
        user: payload?.data.user as LoginResponse['user'],
    };
}
