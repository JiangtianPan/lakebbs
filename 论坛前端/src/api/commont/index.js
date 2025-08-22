// 评论相关api
import  request  from "../requerst.js";

// 点击提交评论
export const addComment = async (content ,userId, postId) => {
    content = {content}.content; // 获取评论内容
    return request.post(`/comment/create`,{params:{ content ,userId, postId }})
}

// 获取全部评论
export const getAllComment = async (postId) => {
    return request.get(`/comment/post/${postId}`) 
}