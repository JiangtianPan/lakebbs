// // 进行数据库表的外键链接
// const User = require('../models/user');
// const UserRole = require('../models/userRole');
// // 关联表使用 belongsTo 和 hasMany

// function joinModels() {
//     User.belongsTo(UserRole, {
//         foreignKey: 'identityname',
//         targetKey: 'identityname',
//         as: 'role'
//     });
//     UserRole.hasMany(User, {
//         foreignKey: 'userRoleId',
//         sourceKey: 'identityname',
//     });
// }
// module.exports.joinModels = joinModels;