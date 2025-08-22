const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../modules/database').getSequelize();

// 定义关注表模型
class Follow extends Sequelize.Model { }
Follow.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        // 关注ID，主键，自增
    },
    followerId: {
        type: DataTypes.STRING,
        references: {
            model: 'users',
            key: 'userId',
        },
        // 关注者用户ID，外键关联 users 表
    },
    followedId: {
        type: DataTypes.STRING,
        references: {
            model: 'users',
            key: 'userId',
        },
        // 被关注者用户ID，外键关联 users 表
    }

    
}, {
    sequelize, // Sequelize实例
    tableName: 'follows',
    timestamps: false,
});

module.exports = Follow;
