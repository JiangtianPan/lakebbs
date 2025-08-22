// 进行登陆认证token加密模块
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// token加密模块
const jwt = require('jsonwebtoken');
// config配置文件 secretKey:token加密字符串  expiresIn token过期时间
const { secretKey } = require('config').get('jwt_config');
const { expiresIn } = require('config').get('jwt_config');
// 注册本地验证策略
function localStrategy(managerService) {
  return new LocalStrategy(
    // 策略配置指定usernameField为usernameOrEmail passwordField为password
    { usernameField: 'username', passwordField: 'password' },
    //策略验证函数接收用户名/邮箱、密码和回调函数作为参数。
    // 通过调用ManagerService.login验证用户名/邮箱和密码的合法性。
    // 如果验证成功，通过回调函数返回用户对象；否则返回错误信息。
    async (username, password, done) => {
      try {
        const user = await managerService.login(username, password);
        if (!user) {
          return done(null, false, { message: '账号或密码错误' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  );
}
//生成JWT令牌。接收用户对象作为参数，使用jwt.sign方法创建令牌，签名密钥为secretKey，过期时间为expiresIn。
function generateToken(user) {
  return jwt.sign({ username: user.username, userdename: user.userdename }, secretKey, { expiresIn: expiresIn });
}
class AdminPassport {
  /**
   * managerService:引用登录数据库验证服务
   * @param {import('../services/UserLoginService')} managerService
   * 
   */
  constructor(managerService) {
    this.managerService = managerService;
    // 初始化 passport
    // 使用passport.use注册本地验证策略。策略由localStrategy方法返回的LocalStrategy实例提供。
    passport.use(localStrategy(this.managerService));
    // 使用passport.serializeUser和passport.deserializeUser注册序列化和反序列化用户函数。
    passport.serializeUser((user, done) => done(null, user.username));
    passport.deserializeUser(async (id, done) => {
      try {
        console.log(id);
        // const user = await this.managerService.getUserById(id);
        return done(null, id);
      } catch (error) {
        return done(error);
      }
    });
  }
  /**
   * 接收app和loginHandler作为参数。
   *设置登录模块的登录函数衔接 passport 策略
   * @param {*} app Express应用实例
   * @param {*} loginHandler 登录处理函数
   */
  setup(loginHandler) {
    // 将登录处理函数保存到类实例的loginHandler属性中。
    this.loginHandler = loginHandler;
  }
  /**
   * 作为中间件使用，处理登录请求。
   * 
   *验证成功后，生成JWT令牌（generateToken方法），执行外部登录处理逻辑（loginHandler），并返回响应。
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  async login(req, res, next) {
    console.log(req.body);
    //调用passport.authenticate('local')，使用已注册的本地验证策略进行身份验证。
    passport.authenticate('local', async (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json(info);
      }
      try {
        const token = generateToken(user);
        // 处理返回到页面的值
        function loginHandler(user, token) {
          console.log(user);
          const dataMsg = {
            code: 200,
            data: {
              user,
              token
            },
          }
          return dataMsg
        };
        const response = loginHandler(user, token); // 调用外部登录处理逻辑
        // 返回页面数据
        return res.json(response);
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  }

  // 作为中间件使用，验证请求头中的JWT令牌。
  // 如果请求头中没有Authorization字段或缺少令牌，
  // 返回401 Unauthorized状态码和相应错误信息。
  tokenAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '没有token令牌' });
    }
    try {
      /**
       * 尝试使用jwt.verify验证令牌的有效性。
       * 验证成功后，将解码后的用户信息保存到req.user属性，
       * 并调用next()继续处理请求。验证失败时，
       * 返回401 Unauthorized状态码和相应错误信息。
       */
      // 验证tken
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'token失效' });
    }
  }
}
module.exports = AdminPassport;