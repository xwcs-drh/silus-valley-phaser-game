import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser', 'phaser3-rex-plugins']
                }
            }
        },
    },
    server: {
        port: 8080
    }
});
