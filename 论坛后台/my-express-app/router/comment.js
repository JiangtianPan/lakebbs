const express = require('express');
const router = express.Router();
const Comment = require('../models/Comments');
const User = require('../models/user');
const { respondSuccess, respondError } = require('../utils/responses');

// 创建新评论
router.post('/create', async (req, res) => {
    try {
        const { content, userId, postId } = req.body.params;
        const newComment = await Comment.create({
            content,
            userId,
            postId,
            commentTime: new Date()
        });
        respondSuccess(res, 201, '评论创建成功', newComment);
    } catch (error) {
        respondError(res, 500, '创建评论失败', error);
    }
});

// 获取特定帖子的所有评论
router.get('/post/:postId', async (req, res) => {
    try {
        const comments = await Comment.findAll({
            where: { postId: req.params.postId },
            include: [{ model: User, attributes: ['name', 'avatar'] }],
            order: [['commentTime', 'DESC']] // 修改为使用 commentTime 进行排序
        });
        respondSuccess(res, 200, '获取评论成功', comments);
    } catch (error) {
        respondError(res, 500, '获取评论失败', error);
    }
});

// 更新评论
router.put('/:id', async (req, res) => {
    try {
        const { content } = req.body;
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return respondError(res, 404, '评论不存在');
        }
        await comment.update({ content });
        respondSuccess(res, 200, '评论更新成功', comment);
    } catch (error) {
        respondError(res, 500, '更新评论失败', error);
    }
});

// 删除评论
router.delete('/:id', async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return respondError(res, 404, '评论不存在');
        }
        await comment.destroy();
        respondSuccess(res, 200, '评论删除成功');
    } catch (error) {
        respondError(res, 500, '删除评论失败', error);
    }
});

module.exports = router;
