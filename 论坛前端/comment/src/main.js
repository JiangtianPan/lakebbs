import { createApp } from 'vue' // 导入 Vue 创建应用的方法
import App from './App.vue' // 导入根组件
import router from '@/router' // 导入路由管理器
import { createPinia } from 'pinia' // 导入 Pinia 创建存储的方法
import ElementPlus from 'element-plus' // 导入 Element Plus 库
import 'element-plus/dist/index.css' // 引入 Element Plus 的样式文件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 导入 Pinia 插件，将数据持久化存储
import './style.css'
// 创建 Vue 应用实例
const app = createApp(App)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // 使用 Pinia 插件，将数据持久化存储

// 使用 Pinia 创建存储实例
app.use(pinia)

// 使用路由管理器
app.use(router)

// 使用 Element Plus 组件库
app.use(ElementPlus)

// 挂载应用到 DOM 中
app.mount('#app')