<template>
  <el-container class="container">

    <!-- 使用 el-aside 作为侧边栏容器 -->
    <el-aside width="100%" class="sidebar">
      <!-- 使用 el-menu 来创建垂直导航菜单 -->

      <!-- 默认选中的菜单项 -->
      <el-menu :default-active='activeIndex' class="el-menu-vertical-demo" background-color="#1A1A1B"
        text-color="#ffffff" active-text-color="#409EFF">
        <!-- ⾸⻚ -->
        <el-menu-item index="1" @click="goToHome('1', '/')">
          <el-icon>
            <HomeFilled />
          </el-icon> <!-- 使用图标 -->
          <span>⾸⻚</span>
        </el-menu-item>

        <!-- 新鲜事⼉ -->
        <el-menu-item index="2" @click="goToHome('2', '/freshNews')">
          <el-icon>
            <Search />
          </el-icon>
          <span>新鲜事⼉</span>
        </el-menu-item>

        <!-- ⼆⼿ -->
        <el-menu-item index="3" @click="goToHome('3', '/secondHand')">
          <el-icon>
            <BellFilled />
          </el-icon>
          <span>⼆⼿</span>
        </el-menu-item>

        <!-- 房产 -->
        <el-menu-item index="4" @click="goToHome('4', '/realEstate')">
          <el-icon>
            <Message />
          </el-icon>
          <span>房产</span>
        </el-menu-item>

        <!-- 更多菜单项可以按类似方式添加 -->

        <!-- 汽⻋ -->
        <el-menu-item index="9" @click="goToHome('9', '/car')">
          <el-icon>
            <User />
          </el-icon>
          <span>汽⻋</span>
        </el-menu-item>

        <!-- ⼯作 -->
        <el-menu-item index="10" @click="goToHome('10', '/work')">
          <el-icon>
            <More />
          </el-icon>
          <span>⼯作</span>
        </el-menu-item>
      </el-menu>

      <!-- 底部按钮 "Post" -->
      <el-button type="primary" class="post-button" @click="visible=true">发帖</el-button>
      <el-button type="primary" class="post-button-two post-button" @click="PersonalCenterdialogVisiblefunc">个人中心</el-button>
      <el-button type="primary" class="post-button-two post-button" @click="dialogVisibleLogin = true">登录</el-button>
      <!-- 发帖对话框 -->
      <el-dialog v-model="visible" :show-close="false" width="56.5%" align-center style="height: 100vh;">
        <div class="my-header">
          <el-input placeholder="请输入标题" v-model="title" style="width: 80%;"></el-input>
          <el-button type="primary" @click="submitPost">发表</el-button>
        </div>
        <el-input type="textarea" placeholder="请输入内容" v-model="content" :rows="20"></el-input>

        <!-- 本地上传图片 -->
        <el-upload class="avatar-uploader" :file-list="fileList" list-type="picture-card" :auto-upload="false"
          :on-change="handleFileChange" :on-remove="handleRemove" :on-preview="handlePictureCardPreview"
          accept="image/*" multiple>
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisibleImage" :close-on-click-modal="false">
          <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%;" />
        </el-dialog>
        分类：
        <span>
          <el-radio-group v-model="category">
            <el-radio label="房产">房产</el-radio>
            <el-radio label="汽车">汽车</el-radio>
            <el-radio label="二手">二手</el-radio>
            <el-radio label="新鲜事">新鲜事</el-radio>
            <el-radio label="工作">工作</el-radio>
          </el-radio-group>
        </span>
      </el-dialog>
      <!-- 登录弹出框内容 -->
      <el-dialog v-model="dialogVisibleLogin"  width="450" center>
        <Login @zha="zhahanshu" />
      </el-dialog>
      <!-- 个人中心弹出框内容 -->
      <el-dialog v-model="PersonalCenterdialogVisible"  width="100%" class="el-dialog-box " align-center style="height: 100vh;">
        <PersonalCenter/>
      </el-dialog>
    </el-aside>
  </el-container>
</template>

<script setup>
import { HomeFilled, Search, BellFilled, Message, User, More, Plus } from '@element-plus/icons-vue'
import Login from '../../views/Login/index.vue'
import PersonalCenter from '../PersonalCenter/index.vue'
import { ElMessage } from 'element-plus'
import { postRouter } from '../../api/post/index.js'
// 导入获取用户信息的接口
// import { getUserProfile } from '../../api/userPost/index.js'
// 获取帖子列表的接口

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { fa, tr } from 'element-plus/es/locale/index.mjs'

const dialogVisibleLogin = ref(false)
const PersonalCenterdialogVisible = ref(false)
 
// 定义个人中心弹窗
const PersonalCenterdialogVisiblefunc = async () => {
  PersonalCenterdialogVisible.value = true
  // 调用接口获取用户信息
  // await getUserProfile('user-9bf2a28d').then(res => {
  //   console.log(res)
  // })
  
}



// 定义登录弹窗
const zhahanshu = (shuju) => {
  dialogVisibleLogin.value = false
}
// 定义上传图片的变量
const fileList = ref([]);
const dialogVisibleImage = ref(false);
const dialogImageUrl = ref("");
// 定义分类变量
const category = ref("");

// 处理文件变化
const handleFileChange = (file, fileList) => {
  // 打印文件信息以调试
  console.log("文件信息:", file);
  console.log("文件信息row:", file.raw);

  console.log("文件列表:", fileList);

  if (file.raw) {
    // 确保 file.raw 是有效的 File 对象
    const reader = new FileReader();
    reader.onload = (e) => {
      dialogImageUrl.value = e.target.result; // 将图片转为 Base64 URL
      dialogVisibleImage.value = true; // 打开预览对话框
    };

    // 读取文件为 Base64
    reader.readAsDataURL(file.raw);
  } else {
    ElMessage.error("无法读取文件");
  }
};

// 处理文件上传
const submitPost = () => {
  // 提交逻辑
  // console.log("标题：", title.value);
  // console.log("内容：", content.value);
  // console.log("文件列表：", fileList.value);
  // console.log("图片URL：", dialogImageUrl.value);
  ElMessage.success("发表成功!");
  postRouter({
    title: title.value,
    content: content.value,
    image: dialogImageUrl.value,
    section: category.value,
  }).then(res => {
    console.log(res)
    if (res.code === 200) {
      visible.value = false; // 关闭弹窗
      fileList.value = []; // 清空上传文件列表
    }
  })
};
 
// 定义路由
const router = useRouter();
const activeIndex = ref("1");
const visible = ref(false);
const title = ref("");
const content = ref("");

const goToHome = (user, pathUrl) => {

  // 跳转到指定页面
  router.push(pathUrl);
  activeIndex.value = user;
};
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisibleImage.value = true
}
const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

</script>

<style scoped>
/* 侧边栏样式 */
.container {
  width: 100%;
  padding: 0;
}

.sidebar {
  background-color: #1a1a1b;
  /* 设置侧边栏的背景色 */
  height: 88vh;
  /* 侧边栏高度占满视口 */
  display: flex;
  flex-direction: column;
  /* 使用 flex 布局，垂直排列 */
  justify-content: space-between;
}

/* 菜单项样式，图标与文字对齐 */
.el-menu-item {
  display: flex;
  align-items: center;
}

/* 角标样式 */
.badge-icon {
  position: absolute;
  top: 0;
  right: 0;
}

/* 底部按钮样式 */
.post-button {
  margin-top: auto;
  /* 将按钮置于底部 */
  width: 100%;
  /* 按钮宽度占满 */
  height: 50px;
  /* 按钮高度 */
  background-color: #1da1f2;
  /* 按钮背景色，接近 Twitter 的蓝色 */
  border-radius: 25px;
  /* 按钮圆角 */
}

.post-button-two {
  margin-top: 10px;
  /* 按钮距离顶部距离 */
  width: 100%;
  /* 按钮宽度占满 */
  height: 50px;
  /* 按钮高度 */
  background-color: #1da1f2;
  /* 按钮圆角 */
  border-radius: 25px;
  margin-left: 0px !important;
}


/* 侧边栏头部样式 */
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* 图片上传样式 */
.avatar-uploader .avatar {
  width: 64px;
  height: 64px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 64px;
  height: 64px;
  text-align: center;
}
/* .el-overlay-dialog{
  margin-left: 15% !important;
} */
 .el-dialog-box{
    margin-left: 15% !important;
 }

</style>