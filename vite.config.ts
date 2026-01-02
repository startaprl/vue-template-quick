import path from 'node:path'
import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/variable" as *;',
        },
      },
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    server: {
      port: Number(env.VITE_PORT) || 5173,
      proxy: {
        '/api': {
          changeOrigin: true,
          rewrite: path => path,
          // rewrite: path => path.replace(/^\/api/, ''),
          target: 'http://localhost:3000',
          ws: true,
        },
      },
    },
  }
})
