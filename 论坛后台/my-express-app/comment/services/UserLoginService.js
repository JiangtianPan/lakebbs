const User = require('../models/user.js'); // 导入用户模型
class UserService {
  /**
   * 根据用户名/邮箱和密码尝试登录
   * @param {string} username 用户名或邮箱
   * @param {string} password 输入的密码
   * @returns {Promise<User | null>} 登录成功的用户对象或null（登录失败）
   */
  async login(username, password) {
    try {
      // 尝试从数据库中查找与提供的用户名或邮箱匹配的用户
      const user = await User.findOne({
        where: { username: username }, // 查找条件
      });

      // 如果没有找到用户或者提供的密码不匹配，则返回 null
      if (!user || !(password === user.password)) {
        return null;
      }

      // 如果找到了用户且密码匹配，则返回用户对象
      return user;
    } catch (error) {
      console.error('Error logging in:', error); // 打印错误日志
      return null; // 返回 null 表示登录失败
    }
  }

  /**
   * 创建新管理员账户
   * @param {object} data 新账户数据（包含用户名、邮箱、密码等）
   * @returns {Promise<User>} 创建成功的用户对象
   */
  async createUser(data) {
    // 使用 bcrypt 对密码进行哈希处理
    // const hashedPassword = await bcrypt.hash(data.password, 6); // 迭代次数为 6
    // 创建新用户，并将哈希后的密码存储到数据库
    const newUser = await User.create({
      ...data, // 拷贝原始数据
    });
    // 返回创建的新用户对象
    return newUser;
  }
}

// 导出 UserService 类供其他模块使用
module.exports = UserService;