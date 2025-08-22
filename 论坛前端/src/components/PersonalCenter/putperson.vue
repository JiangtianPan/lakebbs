<!-- 修改个人信息的弹窗 -->
<template>
  <el-dialog v-model="dialogVisible" title="个人中心" width="30%" class="dialog" >
    <el-form label-width="80px">
      <!-- 用户名输入框 -->
      <el-form-item label="用户名">
        <el-input v-model="name"></el-input>
      </el-form-item>
      <!-- 邮箱输入框 -->
      <el-form-item label="邮箱">
        <el-input v-model="account"></el-input>
      </el-form-item>
      <!-- 密码输入框 -->
      <el-form-item label="密码">
        <el-input v-model="password" type="password"></el-input>
      </el-form-item>
      <!-- 头像上传 -->
      <el-upload class="avatar-uploader" :show-file-list="false" :file-list="fileList" :auto-upload="false"
        :on-change="handleFileChange" :on-remove="handleRemove"
        accept="image/*">
        <img v-if="userInfo.avatar" :src="avatar" class="avatar" />
      </el-upload>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <!-- 取消按钮 -->
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- 确定按钮 -->
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import emitter from '../../api/eventBus';
import { updateUserProfile } from '../../api/userPost';
import { useUserStore } from '../../stores/modules/user.js'

const userStore = useUserStore();

const fileList = ref([]);
const dialogImageUrl = ref('');
const name = ref('');
const account = ref('');
const password = ref('');
const avatar = ref('');
const userId = ref('');

// 用户信息
const userInfo = ref({})
const userInfos = ref({})

// 处理文件变化
const handleFileChange = (file, fileList) => {
  handleRemove();
  console.log(file);
  if (file.raw) {
    // 确保 file.raw 是有效的 File 对象
    const reader = new FileReader();
    reader.onload = (e) => {
      dialogImageUrl.value = e.target.result; // 将图片转为 Base64 URL
      userInfos.value.avatar = e.target.result;
      avatar.value = e.target.result;
    };
    // 读取文件为 Base64
    reader.readAsDataURL(file.raw);
  } else {
    ElMessage.error("无法读取文件");
  }
};

const handleRemove = (uploadFile, uploadFiles) => {
  fileList.value=[];
}

// 控制弹窗显示
const dialogVisible = ref(false);

// 组件挂载时，监听事件，打开弹窗并初始化用户信息
onMounted(() => {
emitter.on('openPerson', (data) => {
  dialogVisible.value = true;
  userInfo.value = data;
  name.value = data.name;
  account.value = data.account;
  password.value = data.password;
  avatar.value = data.avatar;
  userId.value = data.userId;
})
})

// 提交表单
const submitForm = () => {
// 提交表单逻辑
userInfos.value = {
  name: name.value,
  account: account.value,
  password: password.value,
  avatar: avatar.value,
  userId: userId.value
}

// // 修改数据库数据和store数据
updateUserProfile(userInfos.value).then((res) => {
  // 验证qq邮箱格式
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(account.value)) {
    ElMessage.error("请输入正确的邮箱格式");
    return;
  }
  // 验证qq邮箱格式
  const emailRegex163 = /^[a-zA-Z0-9._-]+@qq.com$/;
  if (!emailRegex163.test(account.value)) {
    ElMessage.error("请输入正确的邮箱格式");
    return;
  }

  // 验证密码格式
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!passwordRegex.test(password.value)) {
    ElMessage.error("密码必须包含至少8个字符，且至少包含一个大写字母、一个小写字母和一个数字");
    return;
  }

  userInfo.value.name = name.value
  userInfo.value.account = account.value
  userInfo.value.password = password.value
  userInfo.value.avatar = avatar.value
  dialogVisible.value = false;

  // 修改数据库数据和store数据
  userStore.updataUserfont(userInfo.value)

  ElMessage.success("修改成功");
}).catch((err) => {
  console.log(err);
  ElMessage.error("修改失败");
})
};

</script>

<style>
.el-dialog__title {
    color: #fff !important;
}
.el-form-item__label {
  color: white !important; /* 更改为你想要的颜色 */
}
::v-deep .el-dialog__header {
  color: white !important; /* 你想要的颜色 */
}
::v-deep .el-form-item__label {
  color: white !important; /* 修改为你想要的字体颜色 */
}

.avatar-uploader .el-upload {
border: 1px dashed #d9d9d9;
border-radius: 6px;
cursor: pointer;
position: relative;
overflow: hidden;
color: white !important;
background-color: white !important;
}
.avatar-uploader .el-upload:hover {
border-color: white !important;
}

.avatar-uploader-icon {
font-size: 28px;
width: 178px;
height: 178px;
line-height: 178px;
text-align: center;
color: white !important;
background-color: white !important;
}
.avatar {
width: 100%;
height: 100%;
display: block;
}
.dialog {
  border: 1px solid #fff;
  background-color: black !important;
}
</style>
