import  request  from "../requerst.js";

// 点击收藏
  export const collectionPost = (userId,postId) => {
    return request.post(`/collection/sc`,{ userId, postId });
  }; 

  // 点击取消收藏
  export const unCollectionPost = (userId,postId) => {
    return request.delete(`/collection`,{params:{ userId, postId }});
  }

  // 获取特定用户的收藏列表
export const getCollectionPost = (userId) => {
  return request.get( `/collection/${userId}`);
};

// 根据传过来的postid查询
export const getCollectionPostById = (postId) => {
  return request.get( `/collection/count/${postId}`);
}