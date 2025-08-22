<template>
    <el-card class="tweet-container" @click.stop.prevent="remarks()">
        <!-- 顶部：头像和用户名 -->
        <el-row :gutter="10" class="tweet-header">
            <el-col :span="3">
                <el-avatar :src="avatarSrc" size="large" class="imagesd" />
            </el-col>
            <el-col :span="18">
                <div class="user-info">
                    <span class="name">{{ userName }}</span>
                     <!-- 底部的统计信息 -->
                    <div class="tweet-footer">
                        <span>{{ localTime(tweetTime) }}</span>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!-- 主体内容部分 -->
        <div class="tweet-content">
            <p style="font-weight: 800;">{{ selectedId.title }}</p>
        </div>
        <div class="tweet-content">
            <p style="margin: 10px;">{{ selectedId.content }}</p>
        </div>
        <div>
            <el-image v-if="verifiedIconSrc" :src=" verifiedIconSrc" style="border-radius: 20px;margin: 10px;" />
        </div>
        
        <!-- 底部的操作图标 -->
        <div class="tweet-icons">
            <!-- 点赞 -->
            <span @click.stop="esteem('replies',selectedId.postId)" :class="{ active: isActive.replies }" class="handsStyle">
                <el-icon><Pointer /></el-icon>{{ zanNaum }}
            </span>
            <!-- 收藏 -->
            <span @click.stop="collection('retweets',selectedId.postId)" :class="{ active: isActive.retweets }" class="handsStyle">
                <el-icon ><Star /></el-icon>{{ cangNum }}
            </span>
            <!-- 评论 -->
            <span @click.stop="remarks()" :class="{ active: isActive.likes }" class="handsStyle">
                <el-icon ><ChatLineRound /></el-icon>
                {{ grtpingNum(selectedId.postId) }}
                {{ pingNum }}
            </span>
        </div>
    </el-card>
    <span v-show="false">
                {{ getLike(selectedId) }}
                {{ getcommont(selectedId) }}
    </span>
</template>

<script setup>
// 点赞收藏图标引入,删除会gg
import { ChatLineRound, Star, Pointer } from '@element-plus/icons-vue'
import { collectionPost, unCollectionPost, getCollectionPost, getCollectionPostById } from '../../api/Collectioned/index.js'
import { ref } from 'vue'
import { getThumbsUp,deleteThumbsUp,getPostListRouter } from "../../api/post"
import {useUserStore} from '../../stores/modules/user.js';
import { onMounted,reactive } from 'vue'
import {getFollowList} from '../../api/follow'
import { getLikeList } from '../../api/post'
import emitter  from '../../api/eventBus/index.js'
import { defineEmits } from 'vue';
import { localTime } from '../../api/getTimed'
import { getPostCount } from '../../api/post'
import { getAllComment } from '../../api/commont/index.js'

const zanNaum = ref(0)
const cangNum = ref(0)
const pingNum = ref(0)

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

// 打开组件时触发


// 获取点赞数据,并且转化形式
function getzanNaum(postId) {
    getPostCount(postId).then((res) => {
        if( res.status == 200 ) {
            if(res.data.data < 1000) {
                zanNaum.value = res.data.data
            } else if(res.data.data >= 1000 && res.data.data <= 10000) {
                zanNaum.value = formatNumberk(res.data.data / 1000)
            } else if(res.data.data > 10000) {
                zanNaum.value = formatNumberw(res.data.data / 10000)
            }
        }
    })
}

// 格式化数字为 "1.1k" 的形式
function formatNumberk(number) {
    return number.toFixed(1) + 'k'
}

// 格式化数字为 "1.1w" 的形式
function formatNumberw(number) {
    return number.toFixed(1) + 'w'
}

// 获取收藏数据,并且进行转化
function getcangNum(postId) {
    getCollectionPostById(postId).then((res) => {
        if( res.status == 200 ) {
            if(res.data.data < 1000) {
                cangNum.value = res.data.data
            } else if(res.data.data >= 1000 && res.data.data <= 10000) {
                cangNum.value = formatNumberk(res.data.data / 1000)
            } else if(res.data.data > 10000) {
                cangNum.value = formatNumberw(res.data.data / 10000)
            }
        }
    })
}

// 获取评论数据并进行转化 
function grtpingNum(postId) {
    getAllComment(postId).then((res) => {
        if( res.status == 200 ) {
            if(res.data.data.length < 1000) {
                pingNum.value = res.data.data.length
            } else if(res.data.data.length >= 1000 && res.data.data.length <= 10000) {
                pingNum.value = formatNumberk(res.data.data.length / 1000)
            } else if(res.data.data.length > 10000) {
                pingNum.value = formatNumberw(res.data.data.length / 10000)
            }
        }
    })
}

const emit = defineEmits(['visibleFunc'])

// 定义状态
const isActive = ref({
    replies: false,
    retweets: false,
    likes: false,
})

// 用户信息
const stores = useUserStore()

// 点击评论
function remarks() {
    if(!stores.token) {
        ElMessage.error("请先登录");
        return
    }
    emit('showDialog')
    emit('visibleFunc')
}

// onMounted(() => {
//     emitter.emit('remark', visibleFunc)
// })

// 收藏
const collection = async (type, postId) => {
    if(!stores.token) {
        ElMessage.error("请先登录");
        return
    }
    const userId = stores.userId;
    const toggleState = isActive.value[type];
    const apiCall = toggleState ? unCollectionPost : collectionPost;
    const successMessage = toggleState ? '取消收藏成功' : '收藏成功';
    const failureMessage = toggleState ? '取消收藏失败' : '收藏失败';

    try {
        const res = await apiCall(userId, postId);
        if (res.data.code === 200) {
            isActive.value[type] = !toggleState;
            getcangNum(postId);
            console.log(successMessage);
        } else {
            console.log(failureMessage);
        }
    } catch (error) {
        console.error(failureMessage);
    }
};


// 点赞
const esteem = (type, postId) => {
    if(!stores.token) {
        ElMessage.error("请先登录");
        return
    }
    const userId = stores.userId
    // 判断当前图标是否处于激活状态,如果是则取消点赞，否则执行点赞操作
    if(isActive.value[type] === false){
        // 在这里实现点赞的逻辑
        getThumbsUp(userId, postId).then((res) => {
        if (res.data.code === 200) {
            // 点赞成功
            isActive.value[type] = !isActive.value[type]
            getzanNaum(postId)
            console.log('点赞成功')
        } else {
            // 点赞失败
            console.log('点赞失败')
        }
    })
    } else {
        // 在这里实现取消点赞的逻辑
        deleteThumbsUp(userId, postId).then((res) => {
        if (res.data.code === 200) {
            // 取消点赞成功
            isActive.value[type] = !isActive.value[type]
            getzanNaum(postId)
            console.log('取消点赞成功')
        } else {
            // 取消点赞失败
            console.log('取消点赞失败')
        }
        })
    }
}

// 所有帖子信息
const postInfo = reactive([])
// 初始化图标激活状态
onMounted(function(){
   getpostInfo()
})

// 检索数据库有无点赞
const getLike = async (selectedId) => {
    if(!stores.token) {
        return
    }
    getzanNaum(selectedId.postId)
    const userId = stores.userId
    if(!stores.token) return
    // 获取点赞的数量
    // 检索点赞
    await getLikeList(userId).then(res=>{
        for(let i = 0; i < res.data.data.length; i++) {
            if(res.data.data[i].postId === selectedId.postId) {
                isActive.value["replies"] = true
                return
            }else {
                isActive.value["replies"] = false
            }
        }
    })
}

// 检索数据库有无收藏
const getcommont = async (selectedId) => {
    if(!stores.token) {
        return
    }
    getcangNum(selectedId.postId)
    const userId = stores.userId
    if(!stores.token) return
    // 检索收藏
    await getCollectionPost(userId).then(res=>{
        for(let i = 0; i < res.data.data.length; i++) {
            if(res.data.data[i].postId === selectedId.postId) {
                isActive.value["retweets"] = true
                return
            }else {
                isActive.value["retweets"] = false
            }
        }
    })
}

// 获取所有帖子
const getpostInfo = async () => {
    await getPostListRouter().then(res=>{
        if (res.code != 200) return
        postInfo.splice(0, postInfo.length, ...res.data[0].Likes);
        // 索取数据库点赞数量，收藏数量
    });
}

// 切换图标激活状态的函数
const toggleIcon =async (type,selectedId) => {
    console.log(selectedId.postId);
}

</script>

<style scoped>

/* 容器 */
.tweet-container {
    background-color: #000000;
    color: #fff;
    padding: 2px;
    width: 100%;
    border-radius: 10px;
    font-family: 'Arial', sans-serif;
    box-sizing: border-box;
    border: 0px !important;
    border-bottom: 1px solid #333333 !important;
}

.tweet-container:hover {
    background-color: rgb(55, 55, 55);
    cursor: pointer;
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
    display: flex !important;
    justify-content: space-between;
    margin-top: 10px;
}

.tweet-icons span {
    display: flex !important;
    align-items: center;
    gap: 5px;
}
.tweet-icons span.active {
    color: #e07aff; /* 激活状态样式 */
}
/* 小手样式 */
.handsStyle{
    cursor: pointer;
}

.imagesd {
    background-color: #fff;
}

</style>