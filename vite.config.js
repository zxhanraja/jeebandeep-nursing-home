import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

// ESM-safe __dirname equivalent
const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  // Multi-page app: all 6 HTML pages as entry points
  build: {
    rollupOptions: {
      input: {
        main:        resolve(__dirname, 'index.html'),
        appointment: resolve(__dirname, 'appointment.html'),
        departments: resolve(__dirname, 'departments.html'),
        doctors:     resolve(__dirname, 'doctors.html'),
        facilities:  resolve(__dirname, 'facilities.html'),
        contact:     resolve(__dirname, 'contact.html'),
      },
    },
  },
})
