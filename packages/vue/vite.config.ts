import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const { resolve } = require("path")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve:{
    alias:{
      '@':resolve(__dirname,'./src'),
      '@lowcode/shared':resolve(__dirname,'../shared/src/index.ts')
    },
    extensions:['.ts','.js']
  }
})
