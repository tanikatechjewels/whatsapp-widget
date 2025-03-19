import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://github.com/tanikatechjewels/whatsapp-widget', 
  server: {
    proxy: {
      // This proxy setup will forward requests to GitHub
      '/whatsapp-widget': {
        target: 'https://github.com', // Target the domain you want to proxy
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/whatsapp-widget/, ''), // Strip the /whatsapp-widget from the path
      },
    },
  },

});
