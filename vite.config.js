import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { networkInterfaces } from 'os';

// Función para obtener la IP local
function getLocalIP() {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Buscar IPv4 no interna y que empiece con 192.168
            if (net.family === 'IPv4' && !net.internal && net.address.startsWith('192.168')) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

const localIP = getLocalIP();

export default defineConfig({
    server: {
        host: '0.0.0.0', // Permite conexiones desde cualquier IP
        port: 5173,
        strictPort: true,
        cors: true,
        hmr: {
            host: localIP,
            port: 5173,
            protocol: 'ws',
        },
        watch: {
            usePolling: true,
            interval: 1000,
        },
    },
    build: {
        // Asegurar que los assets usen rutas relativas o HTTPS en producción
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[name]-[hash][extname]',
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js'
            }
        }
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
            // Configuración específica para producción con HTTPS
            detectTls: true,
        }),
        react(),
    ],
});
