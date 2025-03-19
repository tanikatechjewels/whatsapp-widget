import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://github.com/tanikatechjewels/whatsapp-widget', // 👈 Add this line
});
