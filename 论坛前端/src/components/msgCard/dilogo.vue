<template>
    <el-card class="tweet-container scroll-container-main scroll-box">
        <!-- 顶部：头像和用户名 -->
        <el-row :gutter="10" class="tweet-header">
            <el-col :span="3">
                <el-avatar :src="selectedItem.User.avatar" size="large" class="imagesd" />
            </el-col>
            <el-col :span="18">
                <div class="user-info" style="margin-top: 15px;">
                    <span class="name">{{ selectedItem.User.name }}</span>
                    <span style="left: 20px;width: 10px;height: 10px;"></span>
                    <!-- 时间 -->
                    <div class="tweet-footer">
                        <span>{{ localTime(selectedItem.publishTime) }}</span>
                    </div>
                    <!-- 是否关注 -->
                    <div class="tweet-guanzhu">
                        <el-button type="text" @click="handleGuanzhu(selectedItem.postId)">{{ isFollowing ?
                            '已关注' : '关注' }}</el-button>
                    </div>
                </div>
                <!-- 文章标题 -->
                <div>
                    <h3 style="font-weight: 800;">{{ selectedItem.title }}</h3>
                </div>
            </el-col>
        </el-row>
        <!-- 主体内容部分 -->
        <div class="tweet-content">
            <p style="font-weight: 400;margin: 20px;;margin-left: 40px;">{{ selectedItem.content }}</p>
        </div>
        <div class="tweet-image" v-if="selectedItem.image" >
            <el-image :src="selectedItem.image" class="imge"/>
        </div>
        <!-- 文本域 -->
      <div>
        <img :src="useUserStore().avatar" style="width: 56px;height: 56px;border-radius: 50%;margin-left: 10px;position: relative;top: -55px">
        <el-input v-model="textarea" style="width: 90%;left: 10px;" :rows='5' type="textarea" placeholder="评论些什么吧~" class="textare" />
      </div>
      <!-- 提交按钮 -->
      <div>
        <el-button type="primary" @click="handleSubmit(selectedItem)" :style="{ borderRadius: '50px',float: 'right',marginRight: '10px',marginTop: '10px'}">回复</el-button>
      </div>
      <div class="bord"></div>
      <!-- 评论区 -->
      <div class="comment-container scroll-container-main" ref="commentsContainer" @scroll="handleScroll(selectedItem)"
        style="overflow-y: auto;">
        <div v-for="(comment, index) in visibleComments" :key="index" class="comment-item">
          <Comment :comment="comment" :index="index" />
        </div>
        <div v-if="loading" class="loading">{{ texted }}</div>
      </div>
      <span v-show="false">
        {{ loadComments(selectedItem) }}
        {{ checkFollowStatus(selectedItem) }}
      </span>
      <div style="bottom: 0;height: 20px">
        <span class="getNunCommputer">{{ "已显示评论数:" + loadedComments }}</span>
        <span class="getNunCommputer">{{ "总评论数:" + getping(selectedItem.postId)  }}</span>
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
import { addComment } from '../../api/commont';
import emitter from '../../api/eventBus';
import { getAllComment } from '../../api/commont';
import { useUserStore } from '../../stores/modules/user';
import { getUserPostfile } from '../../api/userPost';
import { getFollowList } from '../../api/follow';
import { localTime } from '../../api/getTimed';

const commit = ref("已显示评论数:0")

// 定义 Props
const props =  defineProps({
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
const totalComments = ref(0); // 总评论数
const commentsToLoad = ref(10); // 每次加载10条评论
const loadedComments = ref(0); // 计数已加载的评论数量

const userId = useUserStore().userId;
const texted = ref('加载中...')

onMounted(() => {
    emitter.on('updataping',getp)
})

// 获取评论数
function getping(postId) {
    getAllComment(postId).then(res => {
        commit.value = res.data.data.length
        totalComments.value = res.data.data.length
    })
    return commit.value
}

// 定义方法
function handleSubmit(item) {
    if( textarea.value == '') {
        // 评论为空则弹出提示
        ElMessage({
            message: '评论不能为空',
            type: 'warning',
        })
        return
    }
    // 发送评论
    addComment(textarea.value, userId, item.postId).then(res => {
        if (res.data.code == 201) {
            // 提醒评论成功
            ElMessage({
                message: '评论成功',
                type: 'success',
            })
            // 清空值
            textarea.value = ""
            emitter.emit('remark');
        }
    }).catch(err => {
        console.log("发送失败");
    })
}

// 处理关注按钮的点击事件
function handleGuanzhu(postId) {
    // 获取当前用户id
    getUserPostfile(postId).then(res => {
        let a = userId
        let b = res.data.userId
        // 取消关注按钮调用接口
        if (isFollowing.value == true) {
            // 调取取消关注接口
            unfollowUser(a, b)
                .then(res => {
                    isFollowing.value = !isFollowing.value; // 切换关注状态
                    console.log("取消关注");
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            // 调取关注接口
            followUser(a, b).then(res => {
                isFollowing.value = !isFollowing.value; // 切换关注状态
                console.log("关注成功");
            }).catch(err => {
                console.log(err);
            });
        }
    })
}

// 检查是否关注
const checkFollowStatus = (selectedItem) => {
    if (useUserStore().token == '') return;
    // 调用接口检查是否关注
    // 如果关注，则 isFollowing = true，否则 isFollowing = false
    // console.log(selectedItem.userId);
    // 先拿到发帖人的userid
    getFollowList(userId).then(res => {
        res.data.data.forEach(element => {
            if (element.followedId == selectedItem.userId) {
                isFollowing.value = true
            }
        });
    })
}

// 监听滚动事件

let timed = true;
// 模拟加载评论的函数
const loadComments = (selectedItem) => {
    // 加载评论
    if (timed == true) {
        timed = false;
        loading.value = true;
        setTimeout(() => {
            // 模拟获取新评论
            getAllComment(selectedItem.postId).then(res => {
                comments.value = res.data.data;
                
                if(comments.value.length == 0) {
                            texted.value = "没有更多评论了";
                }
                if (comments.value.length >= visibleComments.value.length || comments.value.length <= 10) { 
                    for (let i = loadedComments.value; i < commentsToLoad.value; i++) {
                        if (i >= comments.value.length) {
                            return
                        }
                        visibleComments.value.push(comments.value[i]);
                        if(comments.value.length <= 10) {
                            texted.value = "没有更多评论了";
                        }
                        loadedComments.value++;
                    }
                    loadedComments.value = visibleComments.value.length;
                    commentsToLoad.value = visibleComments.value.length + 1;
                    timed = true;
                    loading.value = false;
                }
            })
        }, 1000)
    }
    
}

// 滚动事件处理函数
const handleScroll = (selectedItem) => {
    const container = commentsContainer.value;
    // 判断是否接近底部
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 20) {
        
        if (!loading.value && loadedComments.value < totalComments.value) {
            setTimeout(() => {
                loadComments(selectedItem); // 加载更多评论
                texted.value = "加载中...";
            }, 2000)
        }else if (loadedComments.value >= totalComments.value) {
            texted.value = "没有更多评论了";
        }
    }
}

function getp(item){
        // 清空已加载的评论数量
        loadedComments.value = 0;
    // 清空当前显示的评论
    visibleComments.value = [];
    // 每次加载10条评论
    commentsToLoad.value = 10;
    // 更新数据
    getping(item.postId)
        getAllComment(item.postId).then(res => {
                comments.value = res.data.data;
                
                if(comments.value.length == 0) {
                            texted.value = "没有更多评论了";
                        }
                if (comments.value.length >= visibleComments.value.length || comments.value.length <= 10) { 
                    for (let i = loadedComments.value; i < commentsToLoad.value; i++) {
                        if (i >= comments.value.length) {
                            return
                        }
                        visibleComments.value.push(comments.value[i]);
                        if(comments.value.length <= 10) {
                            texted.value = "没有更多评论了";
                        }
                        loadedComments.value++;
                    }
                    loadedComments.value = visibleComments.value.length;
                    commentsToLoad.value = visibleComments.value.length + 1;
                    timed = true;
                    loading.value = false;
                }
            })
}
</script>

<style scoped>
.bord {
    width: 120% !important;
    margin-top:58px;
    border-top: 1px solid white;
}
.textare {
  --el-input-border-color: transparent; /* 修改边框颜色 */
}
::v-deep .el-input__wrapper {
  border: 0 !important;
}
.imge {
    width: 100% !important;
    border-radius: 50% !important;
    border: 1px solid white !important;
}
::v-deep .el-textarea__inner {
  background-color: black !important;  /* 设置背景颜色 */
  color: white !important;
  border: 0 !important;
}
/* 容器 */
.tweet-container {
    background-color: #000 !important;
    color: #fff;
    padding: 2px;
    width: 100%;
    height: 100% !important;
    border-radius: 10px;
    font-family: 'Arial', sans-serif;
    border: 0 !important;
}

/* 头像和用户名部分 */
.tweet-header {
    background-color: #000 !important;
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
    margin-top: 80px;
    padding: 10px;
    height: 400px !important; /* 修改为400px */
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
    width: 35%;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 30px;
}

.scroll-box {
    overflow-y: scroll;
    height: 70vh !important;
}

.imagesd {
    background-color: #fff;
}

.getNunCommputer {
    float: right;
    margin-left: 10px;
}
.comment-item {
    border-bottom: 1px solid #202020;
    margin-top: 20px;
}
</style>