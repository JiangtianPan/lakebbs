// src/api/home/index.js

import request from "../requerst"; // 导入 request 模块

// 示例函数：获取首页数据
export const getHomeData = async ( ) => {
  try {
    const response = await request.get('/home'); // 假设这是获取数据的接口
    return response.data; // 返回数据
  } catch (error) {
    console.error('请求失败：', error); // 错误处理
    throw error; // 抛出错误以便上层处理
  }
};
