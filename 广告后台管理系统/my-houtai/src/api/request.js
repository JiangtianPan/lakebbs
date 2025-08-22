import axios from 'axios';

// 创建一个 Axios 实例
const instance = axios.create({
    baseURL: 'http://148.113.195.11:8880/api', // 设置基础 URL
    timeout: 10000, // 设置请求超时时间
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        console.log('请求发送:', config);
        return config;
    },
    error => {
        // 对请求错误做些什么
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    response => {
        // 对响应数据做些什么
        console.log('响应数据:', response);
        return response.data; // 只返回数据部分
    },
    error => {
        // 对响应错误做些什么
        console.error('响应错误:', error);
        return Promise.reject(error);
    }
);

// 导出 Axios 实例
export default instance;
