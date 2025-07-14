import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000, // or your preferred port
    },
    base: '/',
    build: {
        rollupOptions: {
            treeshake: false,
        },
    },
    resolve: {
        alias: {
            '@': '/src', // if you want to keep path aliases like '@/components'
        },
    },
});
