<template>
  <el-container class="container">

    <!-- 使用 el-aside 作为侧边栏容器 -->
    <el-aside width="100%" class="sidebar">
      <!-- 使用 el-menu 来创建垂直导航菜单 -->

      <!-- 默认选中的菜单项 -->
      <el-menu :default-active='activeIndex' class="el-menu-vertical-demo" background-color="black"
        text-color="#ffffff" active-text-color="#409EFF">
        <!-- ⾸⻚ -->
        <el-menu-item index="1" @click="goToHome('1', '/')" class="activesd">
          <el-icon>
            <HomeFilled />
          </el-icon> <!-- 使用图标 -->
          <span style="font-size: 19px;">⾸⻚</span>
        </el-menu-item>

        <!-- 新鲜事⼉ -->
        <el-menu-item index="2" @click="goToHome('2', '/freshNews')" class="activesd">
          <el-icon>
            <Search />
          </el-icon>
          <span style="font-size: 19px;">新鲜事⼉</span>
        </el-menu-item>

        <!-- ⼆⼿ -->
        <el-menu-item index="3" @click="goToHome('3', '/secondHand')" class="activesd">
          <el-icon>
            <BellFilled />
          </el-icon>
          <span style="font-size: 19px;">⼆⼿</span>
        </el-menu-item>

        <!-- 房产 -->
        <el-menu-item index="4" @click="goToHome('4', '/realEstate')" class="activesd">
          <el-icon>
            <Message />
          </el-icon>
          <span style="font-size: 19px;">房产</span>
        </el-menu-item>

        <!-- 更多菜单项可以按类似方式添加 -->

        <!-- 汽⻋ -->
        <el-menu-item index="9" @click="goToHome('9', '/car')" class="activesd">
          <el-icon>
            <User />
          </el-icon>
          <span style="font-size: 19px;">汽⻋</span>
        </el-menu-item>

        <!-- ⼯作 -->
        <el-menu-item index="10" @click="goToHome('10', '/work')" class="activesd">
          <el-icon>
            <More />
          </el-icon>
          <span style="font-size: 19px;">⼯作</span>
        </el-menu-item>
      </el-menu>

      <!-- 底部按钮 "Post" -->
      <el-button v-if="useUserStore().token == 'abcdef'" class="post-button" @click="visible=true">发帖</el-button>
      <el-button v-if="useUserStore().token == 'abcdef'" class="post-button-two post-button" @click="PersonalCenterdialogVisiblefunc">个人中心</el-button>
      <el-button v-if="useUserStore().token == ''" class="post-button-two post-button" @click="dialogVisibleLogin = true">登录</el-button>
      
      <!-- 发帖对话框 -->
      <el-dialog v-model="visible" :show-close="false" width="40%" align-center style="background-color: black;border: 1px solid white;border-radius: 15px;">
        <div class="my-header">
          <img :src="useUserStore().avatar" style="width: 40px;border-radius: 50%;height: 40px;">
          <el-input placeholder="请输入标题" v-model="title" style="width: 80%;"></el-input>
          <el-button type="primary" @click="submitPost">发表</el-button>
        </div>
        <el-input type="textarea" placeholder="有什么新鲜事儿？" v-model="content" :rows="8" class="texted"></el-input>

        <!-- 本地上传图片 -->
        <el-upload class="avatar-uploader bianimg" :file-list="fileList" list-type="picture-card" :auto-upload="false"
          :on-change="handleFileChange" :on-remove="handleRemove" :on-preview="handlePictureCardPreview"
          accept="image/*" multiple
          >
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisibleImage" class="bianimg" :close-on-click-modal="false">
          <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%"/>
        </el-dialog>
        分类：
        <span>
          <el-radio-group v-model="category">
            <el-radio label="新鲜事">新鲜事</el-radio>
            <el-radio label="二手">二手</el-radio>
            <el-radio label="房产">房产</el-radio>
            <el-radio label="汽车">汽车</el-radio>
            <el-radio label="工作">工作</el-radio>
          </el-radio-group>
        </span>
      </el-dialog>

      <!-- 登录弹出框内容 -->
      <el-dialog v-model="dialogVisibleLogin"  width="450" center style="background-color: black;box-shadow: 0px 0px 30px 0px rgb(100,100,100);border-radius: 20px;">
        <Login @zha="zhahanshu" />
      </el-dialog>

      <!-- 个人中心弹出框内容 -->
      <el-dialog v-model="PersonalCenterdialogVisible" :before-close="handleclose" width="80%" class="el-dialog-box"  align-center style="height: 90vh;">
        <PersonalCenter />
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
import emitter from '../../api/eventBus/index.js'
import { getPostListRouter } from '../../api/post';
import { useUserStore } from '../../stores/modules/user.js'

// 导入获取用户信息的接口
// import { getUserProfile } from '../../api/userPost/index.js'
// 获取帖子列表的接口

function handleclose () {
  PersonalCenterdialogVisible.value = false
  router.go(0); // 刷新路由
}

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const dialogVisibleLogin = ref(false)
const PersonalCenterdialogVisible = ref(false)
 
// 定义个人中心弹窗
const PersonalCenterdialogVisiblefunc = async () => {
  PersonalCenterdialogVisible.value = true
  // 调用接口获取用户信息
  // await getUserProfile('user-9bf2a28d').then(res => {
  //   console.log(res)
  // })
  // 触发那边函数让组件更新
  emitter.emit('shuaxin')
}

const itemArr = ref([])

onMounted(() => {
  goToHome('1', '/')
  emitter.on('routed',loadHome)
  emitter.emit('shuaxin')
  getPostListRouter().then((res) => {
        console.log(res.data);
        if(res.code == 200) {
            itemArr.value = res.data;
        }
        else {
            console.log('获取帖子列表失败');
        }
    });
  
})

function loadHome(data) {
  goToHome(data[0],data[1])
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
const category = ref("新鲜事");

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
  postRouter({
    title: title.value,
    content: content.value,
    image: dialogImageUrl.value,
    section: category.value,
  }).then(res => {
    console.log(res)
    if (res.code === 201) {
      visible.value = false; // 关闭弹窗
      ElMessage.success("发表成功!");
      fileList.value = []; // 清空上传文件列表
      console.log("发表成功");
      title.value = "";
      content.value = "";
      dialogImageUrl.value = "";
      router.go(0); // 刷新路由
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
  if(!useUserStore().token){
    ElMessage.error("请先登录");
    activeIndex.value = 1;
  }else {
    // 跳转到指定页面
    router.push(pathUrl);
    activeIndex.value = user;
  }
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
::v-deep .el-textarea__inner {
  color: white !important; /* 将颜色修改为您想要的颜色 */
}
::v-deep .el-upload{
  top: 25px ;
  left: 20px;
  width: 100px !important;
  height: 100px !important;
  background-color: black !important; /* 替换为你的颜色 */
}
::v-deep .el-textarea__inner {
  background-color: black !important;  /* 设置背景颜色 */
}
::v-deep .el-input__wrapper {
  background-color: black !important;
}
::v-deep .el-input__inner {
  background-color: black !important;
  border: 0 !important;
  color: white !important;
}
/* 侧边栏样式 */
.container {
  width: 100%;
  padding: 0;
}

.sidebar {
  background-color: rgb(0, 0, 0);
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
  color: white;
  margin-top: auto;
  /* 将按钮置于底部 */
  width: 95% !important;
  /* 按钮宽度占满 */
  height: 60px !important;
  /* 按钮高度 */
  background-color: black !important;
  /* 按钮背景色，接近 Twitter 的蓝色 */
  border-radius: 25px;
  /* 按钮圆角 */
  margin-bottom: 40px !important;
}

.post-button-two {
  margin-top: 10px;
  /* 按钮距离顶部距离 */
  width: 100%;
  /* 按钮宽度占满 */
  height: 50px;
  /* 按钮高度 */
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

.bianimg {
  height: 150px !important;
  background-color: black !important;
  margin: 10px !important;
}


/* 图片上传样式 */
.avatar-uploader .avatar {
  width: 64px;
  height: 64px;
  display: block;
  background-color: black !important;
  margin: 20px !important;
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
::v-deep .el-dialog-box{
    color: white !important;
    margin-left: 15% !important;
    background-color: black !important;
    box-shadow: 0px 0px 20px 0px rgb(60,60,60);
 }

 .activesd:hover {
  color: #1da1f2;
  background-color: #e6ecf0;
  border-radius: 25px;
  cursor: pointer;
  width: 100%;
  height: 50px;
  margin-left: 0px !important;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #1da1f2;
  background-color: #e6ecf0;
 }

 .el-menu-vertical-demo {
  border: 0 !important;
 }
 
.el-icon svg{
  width: 22px !important;
  height: 22px !important;
}

</style>