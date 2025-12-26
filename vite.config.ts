import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno desde el archivo .env (si existe)
  // El tercer parámetro '' permite cargar variables que no empiecen por VITE_
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // Esto inyecta la API Key en el código para que funcione en el navegador
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});