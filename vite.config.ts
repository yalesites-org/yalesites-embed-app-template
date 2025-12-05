import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/{{APP_NAME}}/',
  define: {
    'import.meta.env.VITE_APP_HOMEPAGE': JSON.stringify(pkg.homepage),
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        assetFileNames: 'assets/app.css'
      }
    }
  },
  preview: {
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': 'http://yalesites-platform.lndo.site',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  }
});
