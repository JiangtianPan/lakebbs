import axios from "axios"; // 导入axios库
import router from "@/router"; // 导入路由管理器
// 定义axios的默认配置
const instance = {
    // 默认地址请求地址，可在 .env.** 文件中修改
    // baseURL: import.meta.env.VITE_API_URL, // 从环境变量中读取API基础URL
    // baseURL: 'http://192.168.0.109:8880/api',
    baseURL: 'http://127.0.0.1:8880/api',
    // 设置超时时间
    timeout: 20000, // 设置请求超时时间为30秒
    // 跨域时候允许携带凭证
    // withCredentials: true // 允许跨域请求时携带cookie
    headers: {
        'Content-Type': 'application/json',
    },
};


// 创建axios实例
const http = axios.create(instance);

// 请求拦截器
http.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么，例如添加 token
        // 示例：添加 token 到请求头
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        // 处理请求错误
        return Promise.reject(error);
    }
);

// 响应拦截器
http.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        return response;
    },
    (error) => {
        // 对响应错误做点什么
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 未授权状态码，可以跳转到登录页面
                    router.push('/login');
                    break;
                case 403:
                    // 禁止访问状态码，可以提示用户没有权限
                    alert('您没有权限访问此资源！');
                    break;
                case 404:
                    // 资源未找到状态码，可以跳转到 404 页面
                    router.push('/404');
                    break;
                default:
                    // 其他错误状态码，可以统一处理
                    console.error('请求失败:', error);
                    break;
            }
        } else if (error.request) {
            // 请求已发出，但没有收到响应
            console.error('没有收到响应:', error.request);
        } else {
            // 发送请求时发生了一些错误
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default http;