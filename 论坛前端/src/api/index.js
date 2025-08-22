import http from './requerst';
/**
 * @name 登录模块
 */
// 用户登录
export const login = (data) => http.post('/user/login', data);
// 用户注册
export const register = (data) => http.post('/user/register', data);

