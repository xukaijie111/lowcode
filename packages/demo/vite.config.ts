import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const { resolve } = require("path")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    port:3100
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@lowcode/shared':resolve(__dirname,`../shared/src/index.ts`),
      '@lowcode/core':resolve(__dirname,`../core/src/index.ts`)
    }
  }
})
