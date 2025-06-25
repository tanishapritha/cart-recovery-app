import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/', // ✅ use '/' for root deployment on Vercel
  plugins: [react()],
})
