<template>
    <el-card class="tweet-container">
        <!-- 顶部：头像和用户名 -->
        <el-row :gutter="10" class="tweet-header">
            <el-col :span="3">
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
        <div>
            <el-image :src=" verifiedIconSrc" />
        </div>
        <!-- 底部的操作图标 -->
        <div class="tweet-icons">
            <!-- 点赞 -->
            <span @click.stop="toggleIcon('replies',selectedId)" :class="{ active: onphoto(postInfo,selectedId.postId)
                 }" class="handsStyle">
                <el-icon><Pointer /></el-icon>{{ repliesCount }}
            </span>
            <!-- 收藏 -->
            <span @click.stop="toggleIcon('retweets',selectedId)" :class="{ active: isActive.retweets }" class="handsStyle">
                <el-icon ><Star /></el-icon>{{ retweetsCount }}
            </span>
            <!-- 评论 -->
            <span @click="toggleIcon('likes',selectedId)" :class="{ active: isActive.likes }" class="handsStyle">
                <el-icon ><ChatLineRound /></el-icon>{{ likesCount }}
            </span>
        </div>
    </el-card>
</template>

<script setup>
// 引入图标
import { ChatLineRound, Star, Pointer } from '@element-plus/icons-vue'
import { getThumbsUp,deleteThumbsUp,getPostListRouter } from "../../api/post"
import {useUserStore} from '../../stores/modules/user.js';
import { onMounted,reactive } from 'vue'
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
    selectedId:Object
})
import { ref } from 'vue'
// 定义状态
const isActive = ref({
    replies: false,
    retweets: false,
    likes: false,
})
// 用户信息
const stores = useUserStore()

// 所有帖子信息
const postInfo = reactive([])
// 初始化图标激活状态
onMounted(function(){
   getpostInfo()
})
// 获取所有帖子
const getpostInfo = async () => {
    await getPostListRouter().then(res=>{
        postInfo.splice(0, postInfo.length, ...res.data[0].Likes);
    });
}
const onphoto = (list,postid) => {
    for(let i=0;i<list.length;i++){
        if(list[i].postId==postid&&list[i].userId==stores.userId){
            return true
        }
    }
}

// 切换图标激活状态的函数
const toggleIcon =async (type,selectedId) => {
    // console.log(postInfo);
    if(onphoto(postInfo,selectedId.postId)){
        console.log(111);
        //取消点赞
        await deleteThumbsUp(stores.userId,selectedId.postId)
        onphoto(postInfo,selectedId.postId)
        console.log(onphoto(postInfo,selectedId.postId));
    }
    else if(!onphoto(postInfo,selectedId.postId)){
        console.log(222);
         // 确定点赞
        getThumbsUp(stores.userId,selectedId.postId)
        onphoto(postInfo,selectedId.postId)
        console.log(onphoto(postInfo,selectedId.postId));
    }
    getpostInfo()
}


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
    flex-direction: column;
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
}

/* 内容部分 */
.tweet-content {
    margin-top: 10px;
    font-size: 16px;
    line-height: 1.5;
}

/* 底部统计信息 */
.tweet-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 14px;
    color: #8899a6;
}

.views {
    margin-left: 10px;
}

/* 底部的图标区域 */
.tweet-icons {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.tweet-icons span {
    display: flex;
    align-items: center;
    gap: 5px;
}
.tweet-icons span.active {
    color: #42b983; /* 激活状态样式 */
}
/* 小手样式 */
.handsStyle{
    cursor: pointer;
}
</style>