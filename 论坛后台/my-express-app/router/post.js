const express = require('express');
const router = express.Router();
const Post = require('../models/post.js');
const User = require('../models/user.js');
const Comment = require('../models/Comments.js');
const Like = require('../models/like.js');
const Collection = require('../models/Collections.js');
const Follow = require('../models/follows.js');
const { respondSuccess, respondError, respondPagination } = require('../utils/responses');

// 创建新帖子
router.post('/create', async (req, res) => {
    try {
        // 从请求体中解构所需数据
        const { title, content, image, userId, section } = req.body;
        // 创建新帖子
        const userExists = await User.findByPk(userId); // 检查用户是否存在
        if (!userExists) {
            return respondError(res, 400, '用户不存在，无法创建帖子'); // 如果用户不存在，返回错误
        }
        const newPost = await Post.create({
            title,
            content,
            image,
            userId,
            section,
            publishTime: new Date() // 设置发布时间为当前时间
        });
        // 返回成功响应
        respondSuccess(res, 201, '帖子创建成功', newPost);
    } catch (error) {
        // 如果出错，返回错误响应
        respondError(res, 500, '创建帖子失败', error);
    }
});

// 获取所有帖子
router.get('/all', async (req, res) => {
    try {
        // 查找所有帖子，并包含相关的用户、评论和点赞信息
        const posts = await Post.findAll({
            include: [
                { model: User, attributes: ['name', 'avatar'] }, // 包含用户名和头像
                { model: Comment, attributes: ['content', 'commentTime', 'userId', 'postId']}, // 包含评论数量
                { model: Like, attributes: ['id', 'userId', 'postId'] } // 包含点赞数量
            ],
            order: [['publishTime', 'DESC']] // 按发布时间降序排序
        });
        // 返回帖子列表
        respondSuccess(res, 200, '获取帖子成功', posts);
    } catch (error) {
        // 如果出错，返回错误响应
        respondError(res, 500, '获取帖子失败', error);
    }
});

// 获取特定帖子
router.get('/:postId', async (req, res) => {
    try {
        // 根据ID查找特定帖子，并包含相关的用户、评论和点赞信息
        const post = await Post.findByPk(req.params.postId, {
            include: [
                { model: User, attributes: ['name', 'avatar'] }, // 包含发帖用户信息
                { model: Comment, include: [{ model: User, attributes: ['name', 'avatar'] }] }, // 包含评论及评论用户信息
                { model: Like, attributes: ['userId'] } // 包含点赞用户ID
            ]
        });
        // 查询出来的数据格式大致如下:
        // {
        //   id: 1,
        //   title: '帖子标题',
        //   content: '帖子内容',
        //   image: '图片base64',
        //   publishTime: '2023-05-20T10:00:00Z',
        //   userId: 1,
        //   section: '板块名称',
        //   User: {
        //     name: '用户名',
        //     avatar: '头像URL'
        //   },
        //   Comments: [
        //     {
        //       id: 1,
        //       content: '评论内容',
        //       userId: 2,
        //       postId: 1,
        //       User: {
        //         name: '评论用户名',
        //         avatar: '评论用户头像URL'
        //       }
        //     },
        //     // 更多评论...
        //   ],
        //   Likes: [
        //     { userId: 3 },
        //     { userId: 4 },
        //     // 更多点赞...
        //   ]
        // }
        if (!post) {
            // 如果帖子不存在，返回404错误
            return respondError(res, 404, '帖子不存在');
        }
        // 返回帖子信息
        respondSuccess(res, 200, '获取帖子成功', post);
    } catch (error) {
        // 如果出错，返回错误响应
        respondError(res, 500, '获取帖子失败', error);
    }
});

// 更新帖子
router.put('/:postId', async (req, res) => {
    try {
        // 从请求体中解构所需数据
        const { title, content, image, section } = req.body;
        // 查找要更新的帖子
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            // 如果帖子不存在，返回404错误
            return respondError(res, 404, '帖子不存在');
        }
        // 更新帖子信息
        await post.update({ title, content, image, section });
        // 返回更新成功的响应
        respondSuccess(res, 200, '帖子更新成功', post);
    } catch (error) {
        // 如果出错，返回错误响应
        respondError(res, 500, '更新帖子失败', error);
    }
});

// 获取特定用户的帖子列表
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { userId: req.params.userId }
        });
        if (!posts || posts.length === 0) {
            return respondError(res, 404, '用户没有发布任何帖子');
        }
        respondSuccess(res, 200, '获取用户帖子列表成功', posts);
    } catch (error) {
        respondError(res, 500, '获取用户帖子列表失败', error);
    }
});

// 删除帖子
router.delete('/:postId', async (req, res) => {
    try {
        // 查找要删除的帖子
        const postd = await Post.findByPk(req.params.postId)
        Collection.destroy({
            where: { postId: postd.postId },
            force: true
        });
        // 删除帖子相关的评论和点赞
        postd.destroy({
            where: { postId:postd.postId },
            force: true
        });
        // // 返回删除成功的响应
        respondSuccess(res, 200, '帖子删除成功');
    } catch (error) {
        // 如果出错，返回错误响应
        respondError(res, 500, '删除帖子失败', error);
    }
});

// 传过来postid获取帖子
router.get('/count/:postId', async (req, res) => {
    try {
        // 查找帖子
        const post = await Like.findAll({
            where: { postId: req.params.postId }
        })
        respondSuccess(res, 200, '帖子获取成功',post.length);
    } catch (error) {
        // 如果出错，返回错误响应
        respondError(res, 500, '获取帖子失败', error);
    }
})

module.exports = router;
