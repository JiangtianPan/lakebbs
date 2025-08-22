const express = require('express');
const router = express.Router();
const Follow = require('../models/follows');
const { respondSuccess, respondError } = require('../utils/responses');
const User = require('../models/user');
const Post = require('../models/post');

// 创建关注
router.post('/', async (req, res) => {
    try {
        const { followerId, followedId } = req.body;
        const newFollow = await Follow.create({
            followerId,
            followedId,
        });
        respondSuccess(res, 201, '关注成功', newFollow);
    } catch (error) {
        respondError(res, 500, '关注失败', error);
    }
});

// 获取特定用户的关注列表
router.get('/follower/:userId', async (req, res) => {
    try {
        const follows = await Follow.findAll({
            where: { followerId: req.params.userId },
        });
        respondSuccess(res, 200, '获取关注列表成功', follows);
    } catch (error) {
        respondError(res, 500, '获取关注列表失败', error);
    }
});

// 取消关注
router.delete('/', async (req, res) => {
    try {
        const { followerId, followedId } = req.query;
        
        const follow = await Follow.findOne({
            where: { followerId, followedId }
        });
        if (!follow) {
            return respondError(res, 404, '关注记录不存在');
        }
        await follow.destroy();
        respondSuccess(res, 200, '取消关注成功');
    } catch (error) {
        respondError(res, 500, '取消关注失败', error);
    }
});

module.exports = router;


