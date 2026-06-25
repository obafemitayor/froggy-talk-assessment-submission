import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: [{ find: /^@formatjs\/intl$/, replacement: resolve(__dirname, 'src/shims/formatjs-intl.ts') }],
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
    },
});
