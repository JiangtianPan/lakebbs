const { Model, DataTypes } = require('sequelize');
const sequelize = require('../modules/database').getSequelize();


class Ad extends Model { }
Ad.init({
    adId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: '广告ID'
    },
    imageUrl: {
        type: DataTypes.TEXT('long'), // 使用STRING类型并限制长度以避免数据过长导致错误
        allowNull: false,
        comment: '广告图片的base64数据'
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '广告描述'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '广告标题'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: '创建时间'
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        comment: '更新时间'
    }
}, {
    sequelize,
    modelName: 'Ad',
    tableName: 'ads', // 数据库表名
    timestamps: true // 自动管理 createdAt 和 updatedAt 字段
});

module.exports = Ad;
