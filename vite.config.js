import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        host: '0.0.0.0', // Permite conexiones desde cualquier IP
        port: 5173,
        strictPort: true,
        cors: true,
        hmr: {
            host: 'localhost', // Corregido: localIP no está definido
            port: 5173,
            protocol: 'ws',
        },
        watch: {
            usePolling: true,
            interval: 1000,
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
});