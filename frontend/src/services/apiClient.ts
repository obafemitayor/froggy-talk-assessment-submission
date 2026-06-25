const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8088';

type RequestOptions = RequestInit & {
    token?: string | null;
};

export async function request(path: string, { token, ...options }: RequestOptions = {}) {
    return fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
    });
}
