const express = require('express');
const vanrouter = express.Router();
const userRoutes = require('./user.js');
const postRoutes = require('./post.js');
const commentRoutes = require('./comment.js');
const likeRoutes = require('./like.js');
const followRoutes = require('./follows.js');
const adRoutes = require('./ad.js');
// 创建主路由器
// 使用各个子路由
// 用户相关路由
vanrouter.use('/user', userRoutes);

// 帖子相关路由
vanrouter.use('/post', postRoutes);

// 评论相关路由
vanrouter.use('/comment', commentRoutes);

// 点赞相关路由
vanrouter.use('/like', likeRoutes);
// 关注相关路由
vanrouter.use('/follow', followRoutes);
vanrouter.use('/ad', adRoutes);
// 导出主路由器
module.exports = vanrouter;