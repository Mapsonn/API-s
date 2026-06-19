import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const CSP = [
  "default-src 'self'",

  // 'unsafe-inline' y 'unsafe-eval' son necesarios para que Vite funcione en desarrollo
  // EN PRODUCCIÓN se eliminan y se reemplazan por nonces o hashes
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",

  // Los estilos inline son comunes en React (style={{}})
  "style-src 'self' 'unsafe-inline'",

  // Imágenes: mismo origen + el backend de imágenes
  "img-src 'self' data: blob: http://localhost:8080",

  // Conexiones permitidas: la API + WebSocket de Vite HMR
  "connect-src 'self' http://localhost:8080 ws://localhost:5173",

  "font-src 'self'",

  // Bloquea Flash y plugins (vector XSS clásico)
  "object-src 'none'",

  // Evita inyección de etiqueta <base> que redirige recursos
  "base-uri 'self'",
].join('; ')

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': CSP,
    },
  },
})
