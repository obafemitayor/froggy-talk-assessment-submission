import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

window.Pusher = Pusher;

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8088';
const reverbKey = import.meta.env.VITE_REVERB_KEY ?? '';
const reverbHost = import.meta.env.VITE_REVERB_HOST ?? 'localhost';
const reverbPort = Number(import.meta.env.VITE_REVERB_PORT ?? 8080);
const reverbScheme = import.meta.env.VITE_REVERB_SCHEME ?? 'http';

export type ReverbClient = Echo;

export function createReverbClient(token: string): ReverbClient {
    return new Echo({
        broadcaster: 'reverb',
        key: reverbKey,
        wsHost: reverbHost,
        wsPort: reverbPort,
        wssPort: reverbPort,
        forceTLS: reverbScheme === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: `${apiBaseUrl}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });
}
