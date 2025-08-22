import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
import LoginPage from '../views/login.vue'
import AdPage from '../views/ad.vue'
import PostPage from '../views/post.vue'
// 定义路由
const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard.vue'), // 主页面组件
        redirect: { name: 'Ad' }, // 重定向到默认子路由
        children: [
            {
                path: 'ad',
                name: 'Ad',
                component: AdPage
            },
            {
                path: 'posts',
                name: 'Posts',
                component: PostPage
            }
        ]
    }
]

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

// 导出路由实例
export default router


