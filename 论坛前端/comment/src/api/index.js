import http from './requerst';
/**
 * @name 登录模块
 */
// 用户登录
const PORT1 = '/api';
export const loginApi = params => {
    return http.post(PORT1 + `/login`, params, { loading: false }); // 正常 post json 请求  ==>  application/json
};