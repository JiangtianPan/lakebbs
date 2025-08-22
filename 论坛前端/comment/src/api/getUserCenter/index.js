import  request  from "../requerst.js";
// 获取用户信息的函数
export const fetchUserData = async (userId) => {
    try {
        const response = await request.get(`/user/${userId}`);
        return response.data; // 返回响应的数据
    } catch (error) {
        throw new Error('获取用户信息失败：' + (error.response?.data?.message || error.message));
    }
};

// 确保函数被导出
