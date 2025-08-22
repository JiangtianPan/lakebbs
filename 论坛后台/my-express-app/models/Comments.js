const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../modules/database').getSequelize();

// 定义 Comment 模型
class Comment extends Sequelize.Model { }
Comment.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    // 评论ID，主键，自增
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    // 评论内容
  },
  commentTime: {
    type: DataTypes.DATE,
    allowNull: false,
    // 评论时间
  },
  userId: {
    type: DataTypes.STRING,
    references: {
      model: 'users',
      key: 'userId',
    },
    // 评论用户ID，外键关联 users 表
  },
  postId: {
    type: DataTypes.STRING,
    references: {
      model: 'posts',
      key: 'postId',
    },
    // 评论帖子ID，外键关联 posts 表
  },
}, {
  sequelize, // Sequelize实例
  tableName: 'comments',
  timestamps: false,
});

module.exports = Comment;