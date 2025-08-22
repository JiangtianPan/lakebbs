<template>
    <div class="rightNav">
        <el-card class="tweet-container" v-for="item in itemArr.length" :key="item">
        <!-- 顶部：头像和用户名 -->
        <el-row :gutter="10" class="tweet-header">
            <el-col :span="6">
                <el-avatar :src="avatarSrc" size="large" />
            </el-col>
            <el-col :span="18">
                <div class="user-info">
                    <span class="name">{{ userName }}</span>
                     <!-- 底部的统计信息 -->
                    <div class="tweet-footer">
                        <span>{{ tweetTime }}</span>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!-- 主体内容部分 -->
        <div class="tweet-content">
            <p>{{ tweetText }}</p>
        </div>
    </el-card>
    </div>
</template>
<script setup>
import { Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
const userName = ref('张三');
const tweetTime = ref('2022-01-01 12:00:00');
const tweetText = ref('今天天气真好');
const itemArr = ref([
    {
        userName: '张三',
        tweetTime: '2022-01-01 12:00:00',
        tweetText: '今天天气真好'
    },
    {
        userName: '张三',
        tweetTime: '2022-01-01 12:00:00',
        tweetText: '今天天气真好'
    },
    {
        userName: '张三',
        tweetTime: '2022-01-01 12:00:00',
        tweetText: '今天天气真好'
    },
    {
        userName: '张三',
        tweetTime: '2022-01-01 12:00:00',
        tweetText: '今天天气真好'
    },
    {
        userName: '张三',
        tweetTime: '2022-01-01 12:00:00',
        tweetText: '今天天气真好'
    },
    {
        userName: '张三',
        tweetTime: '2022-01-01 12:00:00',
        tweetText: '今天天气真好'
    },
    {
        userName: '张三',
        tweetTime: '2022-01-01 12:00:00',
        tweetText: '今天天气真好'
    },
    {
        userName: '张三',
        tweetTime: '2022-01-01 12:00:00',
        tweetText: '今天天气真好'
    },
    
]);
// 头像
const avatarSrc = ref('https://via.placeholder.com/150');
</script>
<style scoped>
.rightNav {
    background-color: blue;
    width: 100%;
    height: 100vh;
}
.tweet-container{
    padding: 0px !important;
}
</style>