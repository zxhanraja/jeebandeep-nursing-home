import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  // Multi-page app: all HTML files as entry points
  build: {
    rollupOptions: {
      input: {
        main:        resolve(__dirname, 'index.html'),
        appointment: resolve(__dirname, 'appointment.html'),
        departments: resolve(__dirname, 'departments.html'),
        doctors:     resolve(__dirname, 'doctors.html'),
      },
    },
  },
})
