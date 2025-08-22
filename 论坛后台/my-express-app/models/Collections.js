const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../modules/database').getSequelize();

// 收藏表
class Collection extends Sequelize.Model { }
Collection.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        // 点赞ID，主键，自增
    },
    userId: {
        type: DataTypes.STRING,
        references: {
            model: 'users',
            key: 'userId',
        },
        // 点赞用户ID，外键关联 users 表
    },
    postId: {
        type: DataTypes.STRING,
        references: {
            model: 'posts',
            key: 'postId',
        },
        // 点赞帖子ID，外键关联 posts 表
    },
}, {
    sequelize, // Sequelize实例
    tableName: 'collections',
    timestamps: false,
});

module.exports = Collection;