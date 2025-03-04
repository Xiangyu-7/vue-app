import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  //添加别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
      
    
  
})
