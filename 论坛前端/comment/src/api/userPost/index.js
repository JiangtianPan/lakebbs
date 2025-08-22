// 获取用户个人信息
export const getUserProfile = async (id) => {
    try {
      const response = await axios.get(`/user/${id}`);
      return response.data; // 返回响应数据
    } catch (error) {
      throw new Error('获取用户信息失败：' + (error.response?.data?.message || error.message));
    }
  };
  // 获取所有