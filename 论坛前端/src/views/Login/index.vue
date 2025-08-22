<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" stretch>
    <!-- 登录界面 -->
    <el-tab-pane label="登录" name="first">
      <el-form :model="logoForm" label-width="auto" style="max-width: 400px" ref="ruleFormRef" :rules="rules">
        <el-form-item label="用户邮箱:" prop="account" >
          <el-input v-model="logoForm.account" class="inpt" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="用户密码:" prop="password">  
          <el-input v-model="logoForm.password" class="inpt" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 260px;margin: auto;" @click="onSubmitenroll()">登录</el-button>
          <br>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <!-- 注册界面 -->
    <el-tab-pane label="注册" name="second">
      <!-- 上传图片 -->
      <!-- <el-upload class="avatar-uploader" :show-file-list="fileList" :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload> -->
      <el-upload class="avatar-uploader" :file-list="fileList" :auto-upload="false"
        :on-change="handleFileChange" :on-remove="handleRemove" style="margin: 0 auto;width: 20%;"
        accept="image/*">
        <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar" />
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <br>
      <el-form :model="ruleForm" label-width="auto" style="max-width: 400px" ref="ruleFormRef" :rules="rules">
        <el-form-item label="用户邮箱:" prop="account">
          <el-input v-model="ruleForm.account" class="inpt" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="用户密码:" prop="password">
          <el-input v-model="ruleForm.password" class="inpt" placeholder="请输入密码" type="password"/>
        </el-form-item>
        <el-form-item label="用户姓名:" prop="name">
          <el-input v-model="ruleForm.name" class="inpt" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="验证码:" prop="captcha">
          <el-input v-model="ruleForm.captcha" style="width: 30%;" class="inpt" placeholder="请输入验证码" />
          <el-button v-if="Verification.contor" type="primary" style="width: 30%;margin: auto;" @click="onCaptcha">发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 260px;margin: auto;" @click="onSubmit">注册</el-button>
          <br>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>

</template>

<script setup>
import { ref, reactive, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { getCaptcha } from '../../api/Captcha'
import { login,register } from '../../api/index.js'
import emitter from "../../api/eventBus"
import { useUserStore } from '../../stores/modules/user.js'

const emit = defineEmits(['zha'])

//绑定第一个页面
const activeName = ref('first')
// 表单验证
const ruleFormRef = ref(null)
// 登录所用字段
const logoForm = reactive({
  account:"",
  password:""
})
// 注册所用字段
const ruleForm = reactive({
  account:"",
  name: '',
  captcha: '',
  password: '',
  avatar:""
})
// 图片存储
const dialogImageUrl = ref("");

// password存放验证码
const Verification = reactive({
  password: '',
  contor: true,
})

const rules = {
  account: [
    { required: true, message: '请填写邮箱', trigger: 'blur' },
    { validator: emailValidator, trigger: 'blur'}
  ],
  captcha: [
    { required: true, message: '请填写验证码', trigger: 'blur' },
    { validator: phoneValidator,trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: passwordValidator,trigger: 'blur' }
  ]
}
// 定义上传图片的变量
const fileList = ref([]);

// 邮箱验证
function emailValidator(ruleForm, value, callback) {
  if (value === '') {
    callback(new Error('请输入邮箱'))
  } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)) {
    callback(new Error("请输入正确格式的邮箱"))
  } else {
    callback()
  }
}

// 验证码验证
function phoneValidator(ruleForm, value, callback) {
  if (value != Verification.password) {
    callback(new Error('请输入正确的验证码'))
  } else if (value === '') {
    callback(new Error('请输入验证码'))
  }else {
    callback()
  }
}

// 密码验证
function passwordValidator(ruleForm, value, callback) {
    // 验证密码格式
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!passwordRegex.test(value)) {
    ElMessage.error("密码必须包含至少8个字符，且至少包含一个大写字母、一个小写字母和一个数字");
    return;
  }
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能小于6位'))
  } else {
    callback()
  }
  
}

// 发送验证码
const onCaptcha = () => {
  if (ruleForm.account === '') {
    ElMessage.error('请输入邮箱')
  } else {
    // 调用接口获取验证码
    getCaptcha(ruleForm.account).then(res => {
    // 后台返回验证码
    if (res.status === 200) {
      Verification.password = res.data.data
    }
  })
   // 60秒倒计时
   Verification.contor = false
  let time = 60
  let timer = setInterval(() => {
    time--
    if (time === 0) {
      clearInterval(timer)
      Verification.contor = true
    }
  },1000)
  }
 
}
// 处理文件变化
const handleFileChange = (file, fileList) => {
  handleRemove();
  console.log(file);
  if (file.raw) {
    // 确保 file.raw 是有效的 File 对象
    const reader = new FileReader();
    reader.onload = (e) => {
    console.log("处理文件变化"+dialogImageUrl.value);
      dialogImageUrl.value = e.target.result; // 将图片转为 Base64 URL
      ruleForm.avatar = e.target.result;
    };
    // 读取文件为 Base64
    reader.readAsDataURL(file.raw);
  } else {
    ElMessage.error("无法读取文件");
  }
};
const handleRemove = (uploadFile, uploadFiles) => {
  fileList.value=[];
  console.log(uploadFile, uploadFiles)
}
// 注册按钮
const onSubmit = () => {
  console.log(!dialogImageUrl.value);
  
  if(!dialogImageUrl.value){
    ElMessage.error('请上传头像')
    return
  }
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      register(ruleForm).then(res => {
        if (res.status === 201) {
          ElMessage.success('注册成功')
          // 记得添加关闭当前弹窗
          emit('zha')
          // 注册后清空表单
          ruleFormRef.value.resetFields()
          // 清空图片
          dialogImageUrl.value = ""
        } else {
          ElMessage.error('注册失败')
        }
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const userStore = useUserStore()

// 登录按钮
const onSubmitenroll = () => {
  login(logoForm).then(res => {
    if (res.status === 200) {
      ElMessage.success('登录成功')
      // 登录成功关闭页面并且隐藏按钮
      emit('zha')
      // 修改仓库的数据
      userStore.setPieAvatar(res.data.data.avatar)
      userStore.setBarAccount(res.data.data.account)
      userStore.setUserName(res.data.data.name)
      userStore.setUserUserId(res.data.data.userId)
      userStore.setPassword(res.data.data.password)
      userStore.setToken("abcdef")
      window.location.reload();
      // 清空数据
      ruleForm.value = {}
    }else {
      ElMessage.error('账号密码错误')
    }
  })
}


</script>

<style scoped>
::v-deep .el-upload {
  left: 0 !important;
  top: 0 !important;
}
::v-deep .el-input__wrapper {
  background-color: black !important;
}
::v-deep .el-input__inner {
  background-color: black !important;
  border: 0 !important;
  color: white !important;
}
::v-deep .el-icon {
  width: 100px !important;
  height: 100px !important;
}
::v-deep .el-form-item__label {
  color: white; /* 修改为你想要的字体颜色 */
}

::v-deep .el-tabs__item {
  color: white; /* 修改为你想要的字体颜色 */
}
.demo-tabs {
  color: white !important;
  background-color: black !important;
}

.avatar-uploader .avatar {
  width: 100px !important;
  height: 100px;
  display: block;
}

::v-deep .el-tabs__nav-scroll {
  width: 50%;
  margin: 0 auto
}

.avatar-uploader .el-upload {
  width: 200px !important;
  height: 150px;
  margin-left: 160px !important;
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
  width: 100px;
  height: 100px;
  text-align: center;
}

.el-input__wrapper {
  width: 50% !important;
}

.el-dialog {
  border-radius:10px !important;
}

</style>