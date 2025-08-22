const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
let sequelize;
async function initialize(app, callback) {
  const config = require('config').get('db_config');
  // 创建 Sequelize 实例
  sequelize = new Sequelize(config.database, config.user, config.password, {
    dialect: config.dialect,
    host: config.host,
    port: config.port,
    pool: {
      min: 0,
      max: 5,
      acquire: 30000,
      idle: 10000,
    },
    logging: config.debug ? console.log : false,
  });

  try {
    const modelsPath = path.join(__dirname, '../models');
    const files = fs.readdirSync(modelsPath);
    files.forEach((file) => {
      const model = require(path.join(modelsPath, file));
      sequelize.models[model.name] = model;
    });

    // 维护表关系
    const { User, Post, Comment, Like } = sequelize.models;

    // 用户和帖子关系
    User.hasMany(Post, { foreignKey: 'userId' });
    Post.belongsTo(User, { foreignKey: 'userId' });

    // 用户和评论关系
    User.hasMany(Comment, { foreignKey: 'userId' });
    Comment.belongsTo(User, { foreignKey: 'userId' });

    // 帖子和评论关系
    Post.hasMany(Comment, { foreignKey: 'postId' });
    Comment.belongsTo(Post, { foreignKey: 'postId' });

    // 用户和点赞关系
    User.hasMany(Like, { foreignKey: 'userId' });
    Like.belongsTo(User, { foreignKey: 'userId' });

    // 帖子和点赞关系
    Post.hasMany(Like, { foreignKey: 'postId' });
    Like.belongsTo(Post, { foreignKey: 'postId' });

    await sequelize.authenticate();
    console.log('数据库连接成功');
    // await sequelize.sync({ force: false });
    await sequelize.sync({ alter: true });
    console.log('所有模型同步成功');

    app.db = sequelize;
    app.models = sequelize.models;

    if (callback) callback();
  } catch (error) {
    console.error('数据库连接或模型同步失败: ', error);
    throw error;
  }
}

function getSequelize() {
  if (!sequelize) {
    throw new Error('Database not initialized yet.');
  }
  return sequelize;
}

module.exports = { initialize, getSequelize };
