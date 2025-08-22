import {useUserStore} from '../../stores/modules/user.js';
import request from '../requerst.js';

// 发布帖子
export const postRouter = async (params) => {
    const userStore = useUserStore();
    const userId =userStore.userId;
    try {
      const response = await request.post('/post/create',{
        ...params,userId
      }); // 假设这是获取数据的接口
      return response.data; // 返回数据
    } catch (error) {
      console.error('请求失败：', error); // 错误处理
      throw error; // 抛出错误以便上层处理
    }
  };
  
  // 获取所有帖子列表
  export const getPostListRouter = async () => {
    try {
      const response = await request.get('/post/all'); // 假设这是获取数据的接口 
      return response.data; // 返回数据

    } catch (error) {
      console.error('请求失败：', error); // 错误处理
      throw error; // 抛出错误以便上层处理
    }
  };

  // 删除帖子
  export const deletePostRouter = async (postId) => {
    try {
      const response = await request.delete(`/post/${postId}`,{
        data: {
          postId
        }
      }); // 假设这是获取数据的接口      
      return response.data; // 返回数据
    } catch (error) {
      console.error('请求失败：', error); // 错误处理
      throw error; // 抛出错误以便上层处理
    }
  };

  
 // 确定点赞
 export const getThumbsUp = async (userId,postId) => {
  try {
    const response = await request.get('/like/post',{params:{userId,postId}}); // 假设这是获取数据的接口     
    return response; // 返回数据
  } catch (error) {
    console.error('请求失败：', error); // 错误处理
    throw error; // 抛出错误以便上层处理
  }
};

// 取消点赞
 export const deleteThumbsUp = async (userId,postId) => {
  try {
    const response = await request.delete('/like/post',{params:{userId,postId}}); // 假设这是获取数据的接口     
    return response; // 返回数据
  } catch (error) {
    console.error('请求失败：', error); // 错误处理
    throw error; // 抛出错误以便上层处理
  }
};

// 获取特定用户的点赞列表
export const getLikeList = (userId) => {
  return request.get( `/like/post/${userId}`);
};

// 根据postid查帖子数量
export const getPostCount = (postId) => {
  return request.get( `/post/count/${postId}`);
}