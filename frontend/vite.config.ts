import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_TARGET || 'http://localhost:8080'

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            if (id.includes('ant-design-vue') || id.includes('@ant-design/icons-vue')) {
              return 'antd'
            }
            if (id.includes('echarts')) return 'echarts'
            if (id.includes('vue') || id.includes('axios')) return 'vendor'
            return undefined
          }
        }
      }
    }
  }
})
