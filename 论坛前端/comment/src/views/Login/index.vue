<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" stretch>
    <!-- 登录界面 -->
    <el-tab-pane label="登录" name="first">
      <el-form :model="ruleForm" label-width="auto" style="max-width: 400px" ref="ruleFormRef" :rules="rules">
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="ruleForm.phone" />
        </el-form-item>
        <el-form-item label="密码:" prop="passward">
          <el-input v-model="ruleForm.passward" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 260px;margin: auto;" @click="onSubmitenroll">登录</el-button>
          <br>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <!-- 注册界面 -->
    <el-tab-pane label="注册" name="second">
      <!-- 上传图片 -->
      <el-upload class="avatar-uploader" :show-file-list="fileList" :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
      <br>
      <el-form :model="ruleForm" label-width="auto" style="max-width: 400px" ref="ruleFormRef" :rules="rules">
        <el-form-item label="用户名:" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="ruleForm.phone" />
        </el-form-item>
        <el-form-item label="密码:" prop="passward">
          <el-input v-model="ruleForm.passward" />
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
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(['zha'])
//绑定第一个页面
const activeName = ref('first')

const imageUrl = ref('');
// 限制图片格式
const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw);
};

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!');
    return false;
  }
  return true;
};

// 表单验证
const ruleFormRef = ref(null)
const ruleForm = reactive({
  name: '',
  phone: '',
  passward: ''
})
const rules = {
  name: [
    { required: true, message: '请填写姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请填写手机号', trigger: 'blur' },
    { validator: phoneValidator, }
  ],
  passward: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}
// 手机号码验证
function phoneValidator(rule, value, callback) {

  if (ruleForm.phone === null) {

    callback()

  } else if (ruleForm.phone === '') {

    callback(new Error('请输入手机号码'))

  } else if (!/^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/.test(ruleForm.phone)) {

    callback(new Error("请输入正确格式的手机号码"))

  } else {

    callback()

  }
}
// 注册按钮
const onSubmit = () => {
  ruleFormRef.value.validate(valid => {
    if (valid) {
      emit('zha', '');
      console.log('校验通过了')
    }
  })
}
// 登录按钮
const onSubmitenroll = () => {
  emit('zha', '');
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>

<style>
::v-deep .el-tabs__nav-scroll {
  width: 50%;
  margin: 0 auto
}

.avatar-uploader .el-upload {
  margin-left: 160px;
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
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>