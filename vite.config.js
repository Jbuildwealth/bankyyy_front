// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Remove path import if you added it earlier
// import path from 'path'
import tailwindcss from 'tailwindcss'; // Import tailwindcss
import autoprefixer from 'autoprefixer'; // Import autoprefixer

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      // Define plugins directly here
      plugins: [
        tailwindcss(), // Add tailwindcss plugin
        autoprefixer(), // Add autoprefixer plugin
      ],
    },
  },
  // Optional: Add build target if you haven't already
  // build: {
  //   target: 'es2020'
  // },
  // Optional: Add server proxy if needed for API calls in development
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:5000', // Your backend URL
  //       changeOrigin: true,
  //     }
  //   }
  // }
})