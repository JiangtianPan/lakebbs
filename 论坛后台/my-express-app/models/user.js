const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../modules/database').getSequelize();
const { v4: uuidv4 } = require('uuid');
// 定义 User 模型
class User extends Sequelize.Model { }
User.init({
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    defaultValue: () => `user-${uuidv4().split('-')[0]}`, // 使用UUID生成唯一ID，前缀为user-
    // 用户ID，前缀为user-，后面加6位随机数字
  },
  account: {
    type: DataTypes.STRING,
    allowNull: false,
    // 用户账号---邮箱
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    // 用户密码
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    // 用户名称---昵称
  },
  avatar: {
    type: DataTypes.TEXT('long'), // 使用TEXT类型以存储较大的base64数据
    allowNull: true,
    // 用户头像（base64格式）
  },
}, {
  sequelize,
  tableName: 'users',
  timestamps: false,
});

module.exports = User;

