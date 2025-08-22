import { resolve } from "path";
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'

// 定义 Vite 配置
export default defineConfig({
  // 注册插件
  plugins: [
    // Vue 3 的官方支持插件
    vue(),
    // 自动导入 Vue 和 Vue Router 的功能
    AutoImport({
      // 使用 Element Plus 的自动导入解析器
      resolvers: [ElementPlusResolver()],
      // 自动导入 Vue、Vue Router 和 Pinia 的功能
      imports: ["vue", "vue-router", "pinia"],
    }),
    // 自动注册 Element Plus 组件
    Components({
      // 使用 Element Plus 的自动导入解析器
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // 添加路径别名配置
  resolve: {
    alias: {
      // '@' 别名指向 'src' 目录
      "@": resolve(__dirname, "./src"),
    },
  },
  
  // 配置 Vite 开发服务器
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://static.zhongyuanlai.cn',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
})