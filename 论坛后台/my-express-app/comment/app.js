// // 引入所需模块
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// 导入解决跨域问题
const cors = require('cors');
// 创建 Express 应用实例
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Type', 'multipart/form-data; charset=utf-8');
  next();
});
/**
 * 公共系统初始化
 */
global.UPLOADS_PATH = path.join(__dirname, 'uploads');
// 使用 bodyParser 中间件解析请求体中的 JSON 数据
app.use(bodyParser.json())
// 解析 application/x-www-form-urlencoded 格式的数据，并允许扩展参数
app.use(bodyParser.urlencoded({ extended: true }))
// 初始化数据库模块----链接数据库
const database = require('./modules/database');
(async () => {
  try {
    await database.initialize(app);
    // 启动应用服务器等后续操作...
    // const UserService = require('./services/UserLoginService');
    // const userService = new UserService();
    // userService.createUser(
    //   {
    //     userdename: '老王',
    //     password: '123456',
    //     userdepartment: "管理员"
    //   }
    // )
  } catch (error) {
    console.error('数据库初始化失败: ', error);
    process.exit(1); // 或者使用适当的错误处理机制
  }
})();
// 初始化 后台登录 passport策略
// const passport = require('passport');
// app.use(passport.initialize());
// const AdminPassport = require('./modules/passport');
// const UserService = require('./services/UserLoginService');
// const userService = new UserService();
// const adminPassport = new AdminPassport(userService);
// 设置登录模块的登录函数衔接 passport 策略
// adminPassport.setup(userService.login)
// 设置登录模块的登录函数衔接 passport 策略
// 设置 passport 登录入口点----登录中间件
// app.use('/api/commerce/v2/login', adminPassport.login);
// 设置 passport 验证路径----验证token
// app.use('/api/commerce/v2/*', adminPassport.tokenAuth);
// 配置路由接口进入文件
// const voneRouter = require('./router/v1');
// app.use('/api/commerce/v1/', voneRouter);
const voneRouter = require('./router/index');
app.use('/api/', voneRouter);
/**
 * https://locolalhost:8880/api 
 * 后台管理系统初始化
 */
/**
 * 统一处理无响应
 */
// 当请求找不到对应处理路径时返回 404 错误
app.use(function (req, res, next) {
  res.status(404).json({ message: '找不到页面' });
})
// 设置全局响应头（如需）
app.set('x-powered-by', '3.2.1');
app.set('json spaces', 2); // 设置JSON响应的缩进（可选）
// 启动 Express 服务器监听 8888 端口
const os = require('os');
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const ifaceName in interfaces) {
    for (const iface of interfaces[ifaceName]) {
      // 跳过 IPv6 和本地回环地址 '127.0.0.1'
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'IP not found';
}
// 192.168.112.218
const ip = getLocalIPAddress();
// console.log('Local IP Address:', ip);
app.listen(8880, '127.0.0.1', (error) => {
  if (error) {
    console.error('Failed to start the server:', error);
    return process.exit(1);
  }
  console.log(`服务启动成功 at ${ip}:8880`);
});
// 导出 Express 应用实例供外部使用
module.exports = app;