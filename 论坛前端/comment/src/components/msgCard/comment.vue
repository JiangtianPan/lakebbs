<template>
    <el-card class="tweet-container">
        <!-- 顶部：头像和用户名 -->
        <el-row :gutter="10" class="tweet-header">
            <el-col :span="3">
                <el-avatar :src="avatarSrc" size="large" />
            </el-col>
            <el-col :span="18">
                <div class="user-info">
                    <span class="name">{{ comment.userName }}</span>
                    <!-- 时间 -->
                    <span class="handle">{{ comment.userHandle }}</span>
                </div>
                <div class="tweet-content">
                    <p>{{ comment.commentText }}</p>
                </div>
            </el-col>
        </el-row>
    </el-card>
    <div style="">11111</div>
</template>

<script setup>
// 引入图标
import { ChatLineRound, Star, Pointer } from '@element-plus/icons-vue'
// 定义 Props
defineProps({
    avatarSrc: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userHandle: {
        type: String,
        required: true,
    },
    tweetText: {
        type: String,
        required: true,
    },
    tweetTime: {
        type: String,
        required: true,
    },
    viewsCount: {
        type: String,
        required: true,
    },
    repliesCount: {
        type: String,
        required: true,
    },
    retweetsCount: {
        type: String,
        required: true,
    },
    likesCount: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verifiedIconSrc: {
        type: String,
        default: '',
    },
    comment: {
        type: Object,
        required: true,
    },
})


</script>

<style scoped>
/* 容器 */
.tweet-container {
    background-color: #000;
    color: #fff;
    padding: 2px;
    width: 100%;
    border-radius: 10px;
    font-family: 'Arial', sans-serif;
    box-sizing: border-box;
}

/* 头像和用户名部分 */
.tweet-header {
    margin-bottom: 10px;
}

.user-info {
    display: flex;
    flex-direction: row;
}

.name {
    font-weight: bold;
    font-size: 18px;
}

.verified-icon {
    width: 18px;
    height: 18px;
    margin-left: 5px;
}

.handle {
    color: #8899a6;
    font-size: 14px;
    line-height: 2;
}

/* 内容部分 */
.tweet-content {
    margin-top: 10px;
    font-size: 16px;
    line-height: 1.5;
}

</style>