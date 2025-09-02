import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    // Optimizaciones para producción
    minify: "terser",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para mejor caching
          vendor: ["chart.js", "leaflet", "leaflet-routing-machine"],
          utils: ["date-fns", "chartjs-adapter-date-fns"],
        },
      },
    },
    // Configuración para PWA
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
  },
  // Configuración del servidor de desarrollo
  server: {
    port: 5173,
    host: true,
  },
  // Configuración del servidor de preview
  preview: {
    port: 4173,
    host: true,
  },
});
