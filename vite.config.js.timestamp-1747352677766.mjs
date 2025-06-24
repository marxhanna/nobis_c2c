// vite.config.js
import { defineConfig } from "file:///home/koenins/Documentos/Area%20de%20teste/nobis/nobis_c2c/node_modules/vite/dist/node/index.js";
import react from "file:///home/koenins/Documentos/Area%20de%20teste/nobis/nobis_c2c/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///home/koenins/Documentos/Area%20de%20teste/nobis/nobis_c2c/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react(), VitePWA({
    registerType: "autoUpdate",
    manifest: {
      name: "Plataforma Nobis",
      short_name: "Nobis",
      description: "Plataforma de impacto 4.0",
      theme_color: "#ffffff",
      screenshots: [
        {
          src: "assets/screen2_mobile.png",
          sizes: "397x874",
          type: "image/png",
          form_factor: "narrow",
          label: "Primeira tela"
        },
        {
          src: "assets/screen1_mobile.png",
          sizes: "397x874",
          type: "image/png",
          form_factor: "narrow",
          label: "Segunda tela"
        }
      ],
      icons: [
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      maximumFileSizeToCacheInBytes: 5e6
    }
  })],
  server: {
    host: "0.0.0.0"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9rb2VuaW5zL0RvY3VtZW50b3MvQXJlYSBkZSB0ZXN0ZS9ub2Jpcy9ub2Jpc19jMmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2tvZW5pbnMvRG9jdW1lbnRvcy9BcmVhIGRlIHRlc3RlL25vYmlzL25vYmlzX2MyYy92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9rb2VuaW5zL0RvY3VtZW50b3MvQXJlYSUyMGRlJTIwdGVzdGUvbm9iaXMvbm9iaXNfYzJjL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgVml0ZVBXQSh7XG4gICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4gICAgbWFuaWZlc3Q6IHtcbiAgICAgIG5hbWU6ICdQbGF0YWZvcm1hIE5vYmlzJyxcbiAgICAgIHNob3J0X25hbWU6ICdOb2JpcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1BsYXRhZm9ybWEgZGUgaW1wYWN0byA0LjAnLFxuICAgICAgdGhlbWVfY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgIHNjcmVlbnNob3RzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzcmM6IFwiYXNzZXRzL3NjcmVlbjJfbW9iaWxlLnBuZ1wiLFxuICAgICAgICAgIHNpemVzOiBcIjM5N3g4NzRcIixcbiAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgICAgICAgIGZvcm1fZmFjdG9yOiBcIm5hcnJvd1wiLFxuICAgICAgICAgIGxhYmVsOiBcIlByaW1laXJhIHRlbGFcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3JjOiBcImFzc2V0cy9zY3JlZW4xX21vYmlsZS5wbmdcIixcbiAgICAgICAgICBzaXplczogXCIzOTd4ODc0XCIsXG4gICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcbiAgICAgICAgICBmb3JtX2ZhY3RvcjogXCJuYXJyb3dcIixcbiAgICAgICAgICBsYWJlbDogXCJTZWd1bmRhIHRlbGFcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgaWNvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogJy9pY29uLTE5MngxOTIucG5nJyxcbiAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3JjOiAnL2ljb24tNTEyeDUxMi5wbmcnLFxuICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgd29ya2JveDoge1xuICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyoue2pzLGNzcyxodG1sLHBuZyxzdmcsaWNvfSddLFxuICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDUwMDAwMDAsXG4gICAgfSxcbiAgfSksXSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzAuMC4wLjAnLFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3VixTQUFTLG9CQUFvQjtBQUNyWCxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBR3hCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsUUFBUTtBQUFBLElBQ3pCLGNBQWM7QUFBQSxJQUNkLFVBQVU7QUFBQSxNQUNSLE1BQU07QUFBQSxNQUNOLFlBQVk7QUFBQSxNQUNaLGFBQWE7QUFBQSxNQUNiLGFBQWE7QUFBQSxNQUNiLGFBQWE7QUFBQSxRQUNYO0FBQUEsVUFDRSxLQUFLO0FBQUEsVUFDTCxPQUFPO0FBQUEsVUFDUCxNQUFNO0FBQUEsVUFDTixhQUFhO0FBQUEsVUFDYixPQUFPO0FBQUEsUUFDVDtBQUFBLFFBQ0E7QUFBQSxVQUNFLEtBQUs7QUFBQSxVQUNMLE9BQU87QUFBQSxVQUNQLE1BQU07QUFBQSxVQUNOLGFBQWE7QUFBQSxVQUNiLE9BQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBLE1BQ0EsT0FBTztBQUFBLFFBQ0w7QUFBQSxVQUNFLEtBQUs7QUFBQSxVQUNMLE9BQU87QUFBQSxVQUNQLE1BQU07QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsT0FBTztBQUFBLFVBQ1AsTUFBTTtBQUFBLFFBQ1I7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsY0FBYyxDQUFDLGdDQUFnQztBQUFBLE1BQy9DLCtCQUErQjtBQUFBLElBQ2pDO0FBQUEsRUFDRixDQUFDLENBQUU7QUFBQSxFQUNILFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
