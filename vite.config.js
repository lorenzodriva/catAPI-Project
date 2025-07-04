import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        gatos: resolve(__dirname, 'gatos.html'),
        favoritos: resolve(__dirname, 'favoritos.html'),
        juego: resolve(__dirname, 'juego.html'),
      }
    }
  }
});
