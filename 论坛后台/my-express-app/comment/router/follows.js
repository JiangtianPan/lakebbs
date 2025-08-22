const express = require('express');
const router = express.Router();
const Follow = require('../models/follows');
const { respondSuccess, respondError } = require('../utils/responses');

// 创建关注
router.post('/', async (req, res) => {
    try {
        const { followerId, followedId } = req.body;
        const newFollow = await Follow.create({
            followerId,
            followedId
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
            include: {
                model: User, // 假设你已经导入了 User 模型
                attributes: ['userId', 'name'], // 返回关注者的用户ID和名称
                include: {
                    model: Post, // 假设你已经导入了 Post 模型
                    attributes: { exclude: [] }, // 返回帖子的所有信息
                    order: [['createdAt', 'DESC']] // 按时间降序排序
                }
            }
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


