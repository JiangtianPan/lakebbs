
import request from './request'; // 引入 Axios 实例

// 调用接口的示例函数
export const fetchAds = async () => {
    try {
        const ads = await request.get('/ad/all'); // 获取广告数据
        return ads;
    } catch (error) {
        console.error('获取广告数据失败:', error);
        throw error; // 抛出错误以便调用者处理
    }
};

export const addAd = async (ad) => {
    try {
        const addedAd = await request.post('/ad/create', ad); // 添加广告
        return addedAd;
    } catch (error) {
        console.error('添加广告失败:', error);
        throw error; // 抛出错误以便调用者处理
    }
};

export const deleteAd = async (adId) => {
    try {
        await request.delete(`/ad/${adId}`); // 删除广告
    } catch (error) {
        console.error('删除广告失败:', error);
        throw error; // 抛出错误以便调用者处理
    }
};

export const addPost = async (ad) => {
    try {
        const postedAd = await request.post('/posts', ad); // 添加帖子
        return postedAd;
    } catch (error) {
        console.error('添加帖子失败:', error);
        throw error; // 抛出错误以便调用者处理
    }
};
// 获取所有帖子
export const getPosts = async (ad) => {
    try {
        const postedAd = await request.get('/post/all'); // 添加帖子
        return postedAd;
    } catch (error) {
        console.error('添加帖子失败:', error);
        throw error; // 抛出错误以便调用者处理
    }
};
// 获取特定帖子
export const getPostId = async (postId) => {
    try {
        const postedAd = await request.get(`/post/${postId}`); // 添加帖子
        return postedAd;
    } catch (error) {
        console.error('获取特定帖子失败:', error);
        throw error; // 抛出错误以便调用者处理
    }
};
// 删除帖子
export const deletePost = async (postId) => {
    try {
        await request.delete(`/post/${postId}`); // 删除帖子
    } catch (error) {
        console.error('删除帖子失败:', error);
        throw error; // 抛出错误以便调用者处理
    }
};

