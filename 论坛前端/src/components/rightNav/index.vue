<!-- 主页最右边推荐栏目 -->
<template>
   <div style="border-left:1px solid #202020;padding-left: 10px">
        <!-- 搜索框 -->
    <el-input v-model="searchText" placeholder="搜索" class="search-input" @keydown="handleEnter"></el-input>
    <div class="rightNav">
        <el-card class="tweet-container" v-for="item in itemArr" :key="item" @click="shouitem(item)" >
        <!-- 顶部：头像和用户名 -->
        <el-row :gutter="10" class="tweet-header">
            <el-col :span="6">
                <el-avatar :src="item.User.avatar" size="large" />
            </el-col>
            <el-col :span="18">
                <div class="user-info">
                    <span class="name">{{ item.User.name }}</span>
                     <!-- 底部的统计信息 -->
                    <div class="tweet-footer">
                        <span>{{ localTime(item.publishTime) }}</span>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!-- 主体内容部分 -->
        <div class="tweet-content">
            <p>{{ item.content }}</p>
        </div>
    </el-card>
    </div>
   </div>
</template>
<script setup>

import { Search } from '@element-plus/icons-vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '../../stores/modules/user';
import { getPostListRouter } from '../../api/post';
import { localTime } from '../../api/getTimed';
import emitter from '../../api/eventBus';
import { getPostCount } from '../../api/post';

const itemArr = ref([]);
const itemArr1 = ref([]);
const searchText = ref('');
const sortarr = ref("");

onMounted(() => {
    getPostListRouter().then((res) => {
        if(res.code === 200) {
            itemArr1.value = res.data;
            if(res.data.length <= 10) {
                // 排序10条以下数据
                sortData(res.data).then(sortedData => {
                    itemArr.value = sortedData
                }).catch(error => {
                    console.error(error);
                });
            }else {
                // 排序好数组从里面挑出10条点赞最高的
                sortData(res.data).then(sortedData => {
                    itemArr.value = sortedData.slice(0, 10);
                }).catch(error => {
                    console.error(error);
                });
            }
        }
    });
})

// 传入得到的数据，按照点赞数量从高到低排序
function sortData(data) {
    return new Promise((resolve, reject) => {
        const promises = data.map(element => getPostCount(element.postId));
        Promise.all(promises)
            .then(responses => {
                const sortedData = data.slice().sort((a, b) => {
                    const indexA = data.findIndex(item => item.postId === a.postId);
                    const indexB = data.findIndex(item => item.postId === b.postId);
                    return responses[indexB].data.data - responses[indexA].data.data;
                });
                resolve(sortedData);
            })
            .catch(error => {
                reject(error);
            });
    });
}


// 回车搜索，搜索的是全部的数据
const handleEnter = (e) => {
    if(e.keyCode === 13) {
        console.log(searchText.value);
        if(searchText.value === '') {
            // 搜索为空显示全部
            itemArr.value = itemArr1.value;
        } 
        itemArr.value = itemArr1.value.filter((item) => item.content.includes(searchText.value));
    }
}

// 点击显示评论
const shouitem = (item) => {
    if(!useUserStore().token) {
        ElMessage.error("请先登录");
        return
    }
    emitter.emit('remarked',item)
}

</script>
<style scoped>
.rightNav {
    width: 120%;
    height: 100vh;
}
.tweet-container{
    padding: 0px !important;
    margin-top: 5px !important;
    cursor: pointer; /*小手样式 */
    background-color: black;
    color: white;
    border: 0px solid transparent ;
    border-bottom: 1px solid #202020;
}
.tweet-container:hover {
    background-color: rgb(136, 136, 136);
}
/* 改变按搜索框颜色 */
.search-input {
    opacity: 0.7;
    width: 120%;
    margin-top: 20px;
}
</style>