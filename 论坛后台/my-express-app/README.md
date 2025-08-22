#### 项目整体文件说明
- `config` 配置文件目录
  - `default.json` 默认配置文件（其中包含数据库配置，jwt配置）
- `dao` 数据访问层，存放对数据库的增删改查操作
  - `DAO.js` 提供的公共访问数据库的方法
- `models` 存放具体数据库 ORM 模型文件
- `modules` 当前项目模块
  - `authorization.js` API权限验证模块
  - `database.js` 数据库模块（数据库加载基于 nodejs-orm2 库加载）
  - `passport.js` 基于 passport 模块的登录搭建
  - `resextra.js` API 统一返回结果接口
- `node_modules` 项目依赖的第三方模块
- `routes` 统一路由
  - `api` 提供 api 接口
  - `v1` 提供后台管理接口
  - `v2` 提供前端页面接口
- `services` 服务层，业务逻辑代码在这一层编写，通过不同的接口获取的数据转换成统一的前端所需要的数据
- `app.js` 主项目入口文件
- `package.json` 项目配置文件

// 创建项目命令
//数据格式： 一级:{"name":"test","age":18}
//路由 来源: 一级:  去向
// 一级表示一级分类，一级分类下有二级分类，二级分类下有三级分类，三级分类下有商品
 一级表 id rid  categories字段(一级菜单) 
 二级表 id rid  categories字段(二级菜单+title名) categories字段(一级菜单) title 0,1
 三级表 id rid  categories字段(三级菜单) categories字段(二级菜单) categories字段(一级菜单)  
## 部署 Node 项目和前端网站页面以及后台管理系统页面的完整教程（Windows 电脑，使用宝塔面板）

### 1. 准备工作
- 确保你已经购买了一个服务器，并且已经安装了宝塔 Linux 面板 7.5.1。
- 确保你的服务器上已经安装了 Node.js 和 npm。如果没有，请按照以下步骤安装：

#### 安装 Node.js 和 npm
1. **登录宝塔面板**
   - 在浏览器中输入你的服务器 IP 地址，后面加上端口号 `8888`，例如 `http://你的服务器IP:8888`，即可访问宝塔面板的登录页面。
   - 112.74.56.226
     - http://112.74.56.226:8888
   - 使用你在安装宝塔面板时设置的用户名和密码进行登录。

2. **宝塔面板是否免费**
   - 宝塔面板提供了免费版和付费版。免费版包含基本的功能，适合大多数用户使用。如果需要更多高级功能，可以选择购买付费版。

3. **安装 Node.js**
   - 在宝塔面板中，点击左侧的“软件商店”。
   - 找到 Node.js，点击“安装”按钮，选择合适的版本进行安装。

4. **验证安装**
   - 在宝塔面板的终端中，运行以下命令检查 Node.js 和 npm 是否成功安装：
   ```bash
   node -v
   npm -v
   ```

### 2. 项目文件结构
- 将你的项目文件按照以下结构放置在服务器上：
  ```
  /www/wwwroot/
      ├── node-app/          # Node 项目文件夹
      ├── frontend/           # 前端网站页面文件夹
      └── admin-panel/        # 后台管理系统页面文件夹
  ```

### 3. 部署 Node 项目
1. **创建项目文件夹**
   - 在宝塔面板的文件管理中，进入 `/www/wwwroot/` 目录，创建一个名为 `node-app` 的文件夹。

2. **上传项目文件**
   - 使用 FTP 工具（如 FileZilla）或直接通过宝塔面板的文件管理将你的 Node 项目文件上传到 `/www/wwwroot/node-app/` 文件夹。

3. **安装依赖**
   - 在宝塔面板的终端中，进入 Node 项目目录，运行以下命令安装依赖：
   ```bash
   cd /www/wwwroot/node-app/
   npm install
   ```

4. **设置环境变量**
   - 创建一个 `.env` 文件，配置你的环境变量，例如数据库连接信息等。

5. **启动项目**
   - 使用以下命令启动你的 Node 应用：
   ```bash
   npm start
   ```
   - 你也可以使用 `pm2` 来管理你的 Node 应用，确保它在后台运行：
   ```bash
   npm install -g pm2
   pm2 start app.js --name "my-node-app"
   ```

### 4. 部署前端网站页面
1. **创建前端项目文件夹**
   - 在 `/www/wwwroot/` 下创建一个名为 `frontend` 的文件夹。

2. **构建前端项目**
   - 如果你的前端项目使用了构建工具（如 Webpack、Vue CLI 等），请先运行构建命令：
   ```bash
   cd /path/to/your/frontend/
   npm run build
   ```

3. **上传构建后的文件**
   - 将构建后的文件（通常在 `dist` 或 `build` 文件夹中）上传到 `/www/wwwroot/frontend/` 文件夹。

4. **配置宝塔面板**
   - 在宝塔面板中，点击“网站”，选择“添加站点”，输入网站名称、物理路径（指向 `/www/wwwroot/frontend/`）和端口号（如 80）。
   - 点击“确定”以创建网站。

### 5. 部署后台管理系统页面
1. **创建后台管理系统项目文件夹**
   - 在 `/www/wwwroot/` 下创建一个名为 `admin-panel` 的文件夹。

2. **重复前面的步骤**
   - 如果后台管理系统是一个单独的前端项目，构建并上传文件到 `/www/wwwroot/admin-panel/` 文件夹，配置宝塔面板。

### 6. 访问你的应用
- 在浏览器中输入你的服务器 IP 或域名，检查 Node 应用和前端页面是否正常运行。

### 7. 维护和监控
- 定期检查服务器的运行状态，使用 `pm2` 或其他监控工具来确保应用的稳定性。

### 8. 参考资料
- [Node.js 官方文档](https://nodejs.org/en/docs/)
- [宝塔面板官方文档](https://www.bt.cn/bbs/forum.php?mod=viewthread&tid=1)
- [PM2 官方文档](https://pm2.keymetrics.io/docs/usage/quick-start/)

通过以上步骤，你应该能够成功将 Node 项目和前端网站页面以及后台管理系统页面部署到新购买的服务器中。






