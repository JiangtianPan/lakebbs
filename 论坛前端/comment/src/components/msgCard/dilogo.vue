<template>
    <el-card class="tweet-container scroll-container-main scroll-box">
        <!-- 顶部：头像和用户名 -->
        <el-row :gutter="10" class="tweet-header">
            <el-col :span="3">
                <el-avatar :src="selectedItem.User.avatar" size="large" />
            </el-col>
            <el-col :span="18">
                <div class="user-info">
                    <span class="name">{{ selectedItem.User.name }}</span>
                    <!-- 时间 -->
                    <div class="tweet-footer">
                        <span>{{ selectedItem.publishTime }}</span>
                    </div>
                    <!-- 是否关注 -->
                    <div class="tweet-guanzhu">
                        <el-button type="text" @click="handleGuanzhu('user-9bf2a28d', 'user-983e267a')">{{ isFollowing ?
                            '已关注' : '关注' }}</el-button>
                    </div>
                </div>
                <!-- 文章标题 -->
                <div>
                    <h3>{{ selectedItem.title }}</h3>
                </div>
            </el-col>
        </el-row>
        <!-- 主体内容部分 -->
        <div class="tweet-content">
            <p>{{ selectedItem.tweetText }}</p>
        </div>
        <div class="tweet-image">
            <el-image :src="selectedItem.image" />
        </div>
        <!-- 文本域 -->
        <div>
            <el-input v-model="textarea" style="width: 100%" :rows='5' type="textarea" placeholder="Please input" />
        </div>
        <!-- 提交按钮 -->
        <div>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
        <!-- 评论区 -->
        <div class="comment-container scroll-container-main" ref="commentsContainer" @scroll="handleScroll"
            style="height: 300px; overflow-y: auto;">
            <div v-for="(comment, index) in selectedItem.Comments" :key="index" class="comment-item">
                <Comment :comment="comment" :index="index" />
            </div>
                
            <div v-if="loading" class="loading">加载中...</div>
            
        </div>
    </el-card>
</template>

<script setup>
// 引入图标
import { ref, onMounted } from 'vue';
import { ChatLineRound, Star, Pointer } from '@element-plus/icons-vue';
// 引入组件
import Comment from './comment.vue';
import { followUser, unfollowUser } from '../../api/follow';

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
    tweetLabel: {
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
    isFollowing: {
        type: Boolean,
        default: false,
    },
    selectedItem: Object, // 接收选中的用户
    visible: Boolean, // 控制对话框的可见性
})

const textarea = ref('');
const isFollowing = ref(false); // 初始化关注状态
const comments = ref([]); // 所有评论
const visibleComments = ref([]); // 当前显示的评论
const loading = ref(false);
const commentsContainer = ref(null);
const totalComments = 50; // 假设总共有50条评论
const commentsToLoad = 10; // 每次加载10条评论
let loadedComments = 0; // 计数已加载的评论数量

// 定义方法
function handleSubmit() {
    // 发送评论
    console.log(textarea.value)
    // visibleComments.value = false
}
// 处理关注按钮的点击事件
function handleGuanzhu(a, b) {
    // 取消关注按钮调用接口
    if (isFollowing.value == true) {
        isFollowing.value = !isFollowing.value; // 切换关注状态
        console.log("取消关注");
        // 调取取消关注接口
        unfollowUser(a, b)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });

    } else {
        isFollowing.value = !isFollowing.value; // 切换关注状态
        console.log("关注成功");
        // 调取关注接口
        followUser(a, b).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }
}

// 处理关注按钮的点击事件
console.log(isFollowing.value);

// 定义评论组件
function handleComment(comment) {

}

// 模拟加载评论的函数
const loadComments = () => {
    loading.value = true;

    setTimeout(() => {
        // 模拟获取新评论
        const newComments = Array.from({ length: commentsToLoad }, (_, i) => `评论 ${loadedComments + i + 1}`);
        visibleComments.value.push(...newComments);

        loadedComments += commentsToLoad;
        loading.value = false;
    }, 1000);
};

// 滚动事件处理函数
const handleScroll = () => {
    const container = commentsContainer.value;

    // 判断是否接近底部
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 20) {
        if (!loading.value && loadedComments < totalComments) {
            loadComments(); // 加载更多评论
        }
    }
};

const closeDialog = () => {
    const emit = defineEmits(['close']); // 使用 emit 定义关闭事件
    emit('close'); // 触发关闭事件
};

// 组件挂载后初始化加载评论
onMounted(() => {
    // 加载评论
    loadComments(); // 初始加载
    handleComment(comments)

});
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

/* 内容部分 */
.tweet-content {
    margin-top: 10px;
    font-size: 16px;
    line-height: 2;
}

/* 评论区 */
.comment-container {
    border: 1px solid #ccc;
    padding: 10px;
    height: 287px;
    /* 设置评论区高度 */
    overflow-y: auto;
    /* 启用垂直滚动 */
}

.loading {
    text-align: center;
    padding: 10px;
}

.tweet-guanzhu {
    position: absolute;
    right: 10px;
}

.tweet-image {
    display: flex;
    width: 200px;
}

.scroll-box {
    overflow-y: scroll;
}
</style>
