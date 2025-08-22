// Start Generation Here
const express = require('express');
const router = express.Router();
const Like = require('../models/like');
const { respondSuccess, respondError } = require('../utils/responses');
// 点赞帖子
router.get('/post', async (req, res) => {
    try {
        const { userId,postId } = req.query;
        console.log(postId);
        console.log(userId);
        const newLike = await Like.create({
            userId,
            postId
        });
        respondSuccess(res, 201, '点赞成功', newLike);
    } catch (error) {
        respondError(res, 500, '点赞失败', error);
    }
});

// 获取特定帖子的所有点赞
router.get('/post/:postId', async (req, res) => {
    try {
        const likes = await Like.findAll({
            where: { postId: req.params.postId }
        });
        respondSuccess(res, 200, '获取点赞成功', likes);
    } catch (error) {
        respondError(res, 500, '获取点赞失败', error);
    }
});

// 取消点赞
router.delete('/post', async (req, res) => {
    try {
        const { userId,postId } = req.query;
        
        const like = await Like.findOne({
            where: { userId,postId }
        });
        if (!like) {
            return respondError(res, 404, '关注记录不存在');
        }
        await like.destroy();
        respondSuccess(res, 200, '取消关注成功');
    } catch (error) {
        respondError(res, 500, '取消关注失败', error);
    }
});

module.exports = router;
