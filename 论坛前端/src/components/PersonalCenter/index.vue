<template>
    <div class="personal-center-container">
        <!-- 个人信息框 -->
        <div class="personal-center">
            <el-row>
                <el-col :span="4">
                    <div class="avatar_image">
                        <img :src="userInfo.avatar" alt="用户头像" @click="oersonseh" />
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="personal-user-info">
                        <h2>用户ID: {{ userInfo.userId }}</h2>
                        <h2>用户名: {{ userInfo.name }}</h2> <!-- 替换为星号或提示信息 -->
                        <h2>用户账号: {{ userInfo.account }}</h2>
                    </div>
                </el-col>

                <el-button :span="4" style="background-color: black; border: 0;margin-top: 20px;">
                    <el-button type="primary" @click="openDialog">退出登录</el-button>
                </el-button>
 
            </el-row>
        </div>
        <!-- 收藏和发帖 -->
        <el-tabs v-model="activeName" class="demo-tabs" stretch="true">
            <el-tab-pane :label="itemArr1Name1" name="first" class="rig1ht-nav">
                <!-- 发帖的内容 -->
                <RightNav ref="rightNav" class="scroll-container" :itemArr="itemArr1" @delePost="handleDeletePost" @handleClick="handleClick" :key="num" />
            </el-tab-pane>
            <el-tab-pane :label="itemArr1Name2" name="second" class="rig1ht-nav">
                <!-- 点赞的内容 -->
                <RightNav ref="rightNav" class="scroll-container" :itemArr="itemArr2"  @delePost="handleDeletePost" @handleClick="handleClick" :key="num" />
            </el-tab-pane>
            <el-tab-pane :label="itemArr1Name3" name="three" class="rig1ht-nav">
                <!-- 收藏的内容 -->
                <RightNav ref="rightNav" class="scroll-container" :itemArr="itemArr3" @delePost="handleDeletePost" @handleClick="handleClick" :key="num" />
            </el-tab-pane>
            <el-tab-pane :label="itemArr1Name4" name="four" class="rig1ht-nav">
                <!-- 关注的内容 -->
                <RightNav ref="rightNav" class="scroll-container" :itemArr="itemArr4" @delePost="handleDeletePost" :key="num" />
            </el-tab-pane>
        </el-tabs>
    </div>

    <!-- 修改个人信息弹窗 -->
    <PutPerson />

     <!-- 对话框模板层 -->
   <el-dialog v-model="visible" :show-close="false" width="58%" align-center style="height: 80vh;overflow: hidden;border: 1px solid white;background-color: black;border-radius:20px;">
      <template #header="{ close }">
        <div class="my-header">
           <!-- 按钮 -->
          <el-button style="background-color: #000000;border: none;" @click="close">
            <el-icon color="#ffffff">
              <Back />
            </el-icon>
          </el-button>
        </div>
      </template>
      <diLogo :selectedItem="selectedItem" />
    </el-dialog> 

</template>

<script setup>
import diLogo from "../../components/msgCard/dilogo.vue";
import { ref, onMounted, defineEmits, onBeforeUnmount } from 'vue';
import RightNav from '../rightNav/delete.vue';
import { fetchUserData } from '../../api/getUserCenter'
import { getPostListRouter } from '../../api/post'
import { useUserStore } from '../../stores/modules/user.js';
import { getFollowList, unfollowUser } from '../../api/follow'
import { getLikeList } from '../../api/post'
import { getCollectionPost,unCollectionPost } from '../../api/Collectioned/index.js'
import { deletePostRouter, deleteThumbsUp } from '../../api/post'
import emitter from '../../api/eventBus/index.js';
import PutPerson from "./putperson.vue"
import { getUserProfile } from '../../api/userPost/index.js'

// 点击打开个人中心
function oersonseh() {
    emitter.emit('openPerson',userInfo.value)
}

// 定义用户信息对象
const userInfo = ref({});

const emit = defineEmits(['upData'])

const num = ref(0);
const visible = ref(false);
const selectedItem = ref(null);

const itemArr1Name1 = ref('');
const itemArr1Name2 = ref('');
const itemArr1Name3 = ref('');
const itemArr1Name4 = ref('');

const itemArr1 = ref([]);
const itemArr2 = ref([]);
const itemArr3 = ref([]);
const itemArr4 = ref([]);

function handleDeletePost(data) {
    if(data.mods == "发帖") {
        // 并且在表里删除这个帖子
        deletePostRouter(data.postId).then((res) => {
            if(res.code == 200) {
                 // 过滤掉这组数据
            itemArr1.value = itemArr1.value.filter(item => item !== data);
            console.log('删除成功');
            itemArr1Name1.value = "已发帖"+ "(" + itemArr1.value.length + ")";
            }
        }).catch((error) => {
            console.error('删除失败:', error);
        })
        
    }else if(data.mods == "点赞") {
        // 取消点赞
        deleteThumbsUp(useUserStore().userId,data.postId).then((res) =>{
            if(res.status == 200) {
                 // 过滤掉这组数据
                 itemArr2.value.length -= 1
                 itemArr1Name2.value = "已点赞"+ "(" + itemArr2.value.length + ")";
            console.log('取消成功');
            }
        })
        
    }else if(data.mods == "收藏") {
        //取消收藏
        unCollectionPost(useUserStore().userId,data.postId).then((res) =>{
            if(res.status == 200) {
                itemArr3.value.length -= 1
                itemArr1Name3.value = "已收藏"+ "(" + itemArr3.value.length + ")";
            console.log('取消成功');
            }
        })
    }else if(data.mods == "关注") {
        // 取消关注
        unfollowUser(useUserStore().userId,data.userId).then((res) =>{
            if(res.status == 200) {
                itemArr4.value.length -= 1
                itemArr1Name4.value = "已关注"+ "(" + itemArr4.value.length + ")";
            console.log('取消成功');
            }
        })
    }
    num.value++
}

// 点击帖子
function handleClick(data) {
    console.log(data);
    
    selectedItem.value = data;
    visible.value = true;
    emitter.emit('updataping', data)
}

// 当前激活的标签
const activeName = ref('first');

// 请求用户信息的函数
const fetchUserInfo = async () => {
    try {
        if(!useUserStore().token) return
        const response = await fetchUserData(useUserStore().userId); // 获取用户信息
        console.log(response.data);
        userInfo.value = response.data; // 将获取的值赋给 userInfo
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
};

// 退出登录
function openDialog() {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        // 清除用户信息
        useUserStore().clearUserInfo();
        // 刷新浏览器
        window.location.reload();
    }).catch(() => {
        // 取消操作，什么也不做
    });
}

// 标签点击事件
// const handleClick = (tab, event) => {
//     console.log(tab, event);
// };

function getData() {
     // 获取已发贴的数据
     getPostListRouter().then((res) => {
        itemArr1.value = []
        res.data.forEach(element => {
            if(element.userId == useUserStore().userId) {
                element = {mods:"发帖",...element};
                itemArr1.value.push(element);
            }else {
                return;
            }
        });
        itemArr1Name1.value = "已发帖"+ "(" + itemArr1.value.length + ")";
    })

    // 获取点赞的数据
    getLikeList(useUserStore().userId).then((postId) => {
        itemArr2.value = [];
        // 拿到了之后，根据返回的postid查询对应的帖子信息
        getPostListRouter().then((res) => {
            res.data.forEach((element) => {
                postId.data.data.forEach((element2) => {
                    if(element2.postId == element.postId) {
                        element = {mods:"点赞",...element};
                        itemArr2.value.push(element);
                    }else {
                        return;
                    }
                })
        });
        itemArr1Name2.value = "已点赞"+ "(" + itemArr2.value.length + ")";
       })
    });

    // 获取收藏的数据
    getCollectionPost(useUserStore().userId).then((postId) => {
        itemArr3.value = [];
        // 拿到了之后，根据返回的postid查询对应的帖子信息
        getPostListRouter().then((res) => {
            res.data.forEach((element) => {
                postId.data.data.forEach((element2) =>{
                    if(element.postId == element2.postId) {
                        element = {mods:"收藏",...element};
                        itemArr3.value.push(element);
                    }else {
                        return;
                    }
                })
            })
        itemArr1Name3.value = "已收藏"+ "(" + itemArr3.value.length + ")";
        })
    })
    const userList = ref([]);
    // 获取关注的数据
    getFollowList(useUserStore().userId).then((res) => {
        itemArr4.value = []
        res.data.data.forEach(element => {
            if(element.followerId == useUserStore().userId) {
                userList.value.push(element.followedId)
            }
        })
        // 获取完了关注人的userid之后获取那些人的个人信息
        userList.value.forEach(usid => {
            getUserProfile(usid).then((res) => {
                const userInfod = {
                    mods:"关注",
                    image: res.data.avatar,
                    userId: res.data.userId,
                    User: {
                        name: res.data.name,
                    }
                }
                itemArr4.value.push(userInfod);
                console.log(itemArr4.value);
                
                itemArr1Name4.value = "已关注"+ "(" + itemArr4.value.length + ")";
            })
            
        })
        if(itemArr4.value.length == 0) {
            itemArr1Name4.value = "已关注(0)";
        }
    })
}

// 定义回调函数
function handleShuaxin() {
    // 当shuaxin事件被触发时，这个函数将被执行
    getData();
}

// 组件挂载后获取用户信息和帖子信息
onMounted(() => {
    emitter.on('remark',()=>{
    visible.value = false;
  })
    fetchUserInfo();
    getData();
    emitter.on('shuaxin', ()=>{
        handleShuaxin()
    }
    );
});

</script>

<style scoped>
.personal-center-container {
    color: white !important;
    background-color: black;
}

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
}

.avatar_image:hover {
    cursor: pointer;
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
    height: 55vh;
}

.el-overlay-dialog {
    overflow: hidden !important;
}

.scroll-container::-webkit-scrollbar {
    width: 0px; /* 滚动条的宽度 */
    height: 0px; /* 滚动条的高度 */
}

.rig1ht-nav {
    overflow-y: auto; /* 添加垂直滚动条 */
    height: 90% !important;
}
::v-deep .el-tabs__item {
  color: white ; /* 修改字体颜色 */
  background-color: black;
}
/* 针对Webkit浏览器（如Chrome和Safari） */
.rig1ht-nav::-webkit-scrollbar {
  display: none;
}
::v-deep .el-tabs__nav {
    border-bottom: 1px solid #202020 !important;
}
</style>
