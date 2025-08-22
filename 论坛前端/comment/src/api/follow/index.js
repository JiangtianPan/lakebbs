import  request  from "../requerst.js";

// 关注用户
export const followUser = (followerId,followedId) => {
  return request.post('/follow',{followerId,followedId});
};
// 取消关注用户
export const unfollowUser = (followerId,followedId) => {
  return request.delete(`/follow`,{params:{followerId,followedId}});
};

// 获取特定用户的关注列表
export const getFollowList = (userId) => {
  return request.get( `/follow/follower/${userId}`);
};
