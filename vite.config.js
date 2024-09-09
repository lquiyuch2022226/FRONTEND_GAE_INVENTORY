import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Aquí puedes añadir otras opciones de build si es necesario
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
