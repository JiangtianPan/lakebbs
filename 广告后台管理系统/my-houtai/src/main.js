// 导入 Vue 创建应用的函数
import { createApp } from 'vue'
// 导入全局样式
import './style.css'
// 导入主应用组件
import App from './App.vue'
// 导入 Element Plus 组件库
import ElementPlus from 'element-plus'
// 导入 Element Plus 的样式
import 'element-plus/dist/index.css'
// 导入 Axios 库
import axios from 'axios'
// 导入路由配置
import router from './router' // 添加路由的导入
// 创建 Vue 应用实例
const app = createApp(App)
// 使用 Element Plus 组件库
app.use(ElementPlus)
// 使用路由
app.use(router) // 添加路由的使用
// 挂载应用到 DOM 中的 #app 元素
app.mount('#app')
