import request from '../requerst.js';

// 获取用户个人信息
export const getUserProfile = async (id) => {
  try {
    const response = await request.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('获取用户信息失败：' + (error.response?.data?.message || error.message));
  }
};

// 根据userid查被关注人的userid
export const getUserPostfile = async (id) => {
  try {
    const response = await request.get(`/user/post/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('获取用户信息失败：' + (error.response?.data?.message || error.message));
  }
};

// 修改用户个人信息
export const updateUserProfile = async (data) => {
  try {
    const response = await request.put(`/user`, data);
    return response.data;
  } catch (error) {
    throw new Error('修改用户信息失败：' + (error.response?.data?.message || error.message));
  }
}