<template>
    <div class="personal-center-container">
        <!-- 个人信息框 -->
        <div class="personal-center">
            <el-row>
                <el-col :span="4">
                    <div class="avatar_image">
                        <img :src="userInfo.avatarUrl" alt="用户头像" />
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="personal-user-info">
                        <h2>用户名: {{ userInfo.account }}</h2>
                        <h2>手机号: {{ userInfo.phone }}</h2>
                        <h2>密码: {{ userInfo.password }}</h2> <!-- 替换为星号或提示信息 -->
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 收藏和发帖 -->
        <el-tabs v-model="activeName" class="demo-tabs" stretch="true" @tab-click="handleClick">
            <el-tab-pane label="已发贴" name="first" class="scroll-container">
                <RightNav ref="rightNav" />
            </el-tab-pane>
            <el-tab-pane label="收藏" name="second">
                <!-- 收藏的内容 -->
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import RightNav from '../rightNav/delete.vue';
import { fetchUserData } from '../../api/getUserCenter'; // 假设从此 API 模块获取用户数据

// 定义用户信息对象
const userInfo = ref({
    username: '',
    phone: '',
    avatarUrl: '', // 用户头像的URL
});

// 当前激活的标签
const activeName = ref('first');

// 请求用户信息的函数
const fetchUserInfo = async () => {
    try {
        const response = await fetchUserData("user-608914fe"); // 假设获取ID为user-9bf2a28d的用户信息
        // console.log(response.data);
        
        userInfo.value = response.data; // 将获取的值赋给 userInfo
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
};

// 标签点击事件
const handleClick = (tab, event) => {
    console.log(tab, event);
};

// 组件挂载后获取用户信息
onMounted(() => {
    fetchUserInfo();
});
</script>

<style scoped>
.personal-center {
    width: 100%;
    height: 30vh;
}

.avatar_image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-top: 20px;
    margin-left: 20px;
    background-color: pink;
}

.avatar_image img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.personal-user-info {
    margin-top: 20px;
}

.scroll-container {
    overflow: hidden;
    overflow-y: scroll;
}

.demo-tabs {
    height: 65vh;
}

.el-overlay-dialog {
    overflow: hidden !important;
}
</style>
