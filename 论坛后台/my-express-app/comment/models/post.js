const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../modules/database').getSequelize();
const { v4: uuidv4 } = require('uuid');
// 点赞表
class Post extends Sequelize.Model { }
// 帖子表
Post.init({
    postId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: () => `post-${uuidv4().split('-')[0].slice(0, 8)}`, // 使用UUID生成唯一ID，前缀为post-，取前8位
        // 帖子ID，前缀为post-，后面加8位随机数字
    },
    // 图片base64
    image: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        // 帖子图片，Base64编码，使用TEXT类型以存储大量数据
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        // 帖子标题
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        // 帖子内容
    },
    publishTime: {
        type: DataTypes.DATE,
        allowNull: false,
        // 发布时间
    },
    userId: {
        type: DataTypes.STRING,
        references: {
            model: 'users',
            key: 'userId',
        },
        // 发布用户ID，外键关联 users 表
    },
    section: {
        type: DataTypes.STRING,
        allowNull: false,
        // 归属板块
    },
}, {
    sequelize, // Sequelize实例
    tableName: 'posts',
    timestamps: false,
});

module.exports = Post;