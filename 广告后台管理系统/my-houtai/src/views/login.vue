<!-- Start Generation Here -->
<template>
    <el-container style="height: 100vh; background-color: #f5f5f5;">
        <el-header style="background-color: #409EFF; color: white; text-align: center;">
            <h1>登录页</h1>
        </el-header>
        <el-main style="display: flex; justify-content: center; align-items: center;">
            <el-form :model="form" @submit.prevent="handleLogin"
                style="width: 400px; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="form.username" placeholder="请输入用户名" required />
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.password" placeholder="请输入密码" required />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit" style="width: 100%;">登录</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const form = ref({
    username: '',
    password: ''
})
const router = useRouter()
const formLabelWidth = '80px'

const handleLogin = () => {
    // 这里可以添加登录逻辑，比如调用API进行验证
    // 假设登录成功后，跳转到ad页
    router.push('/dashboard/ad')
}
</script>

<style scoped>
/* 添加样式 */
h1 {
    margin: 0;
    font-size: 24px;
}

.el-form-item {
    margin-bottom: 20px;
}
</style>
<!-- End Generation Here -->
