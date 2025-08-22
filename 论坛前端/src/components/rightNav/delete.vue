<template>
    <div class="rightnav">
        <el-card class="tweet-container" v-for="item in itemArr" :key="item" @click.stop.prevent="handleClick(item)">
        <!-- 顶部：头像和用户名 -->
        <el-row :gutter="10" class="tweet-header">
            <el-col :span="6">
                <el-avatar :src="getUrl(item.image)" size="large" class="imageds" />
            </el-col>
            <el-col :span="16">
                <div class="user-info">
                    <span class="name" v-if="item.publishTime">{{ item.User.name }}</span>
                    <span class="name1" v-if="!item.publishTime">{{ item.User.name }}</span>
                     <!-- 底部的统计信息 -->
                    <div class="tweet-footer" v-if="item.publishTime">
                        <span>{{ localTime(item.publishTime) }}</span>
                    </div>
                    <div class="tweet-footer" v-if="item.title">
                        <span>{{ item.title }}</span>
                    </div>
                </div>
            </el-col>
            <el-col :span="2">
                <el-button type="text" @click="handleDelete(item)" class="deleBut" >
                    删除
                </el-button>
            </el-col>
        </el-row>
        <!-- 主体内容部分 -->
        <div class="tweet-content" v-if="item.content">
            <p>{{ item.content }}</p>
        </div>
    </el-card>
    </div>
</template>
<script setup>
import { Search } from '@element-plus/icons-vue';
import { useUserStore } from '../../stores/modules/user';
import { ref, onMounted, defineEmits } from 'vue';
import { localTime } from '../../api/getTimed';

const userName = ref('');
const tweetText = ref('');
const emit = defineEmits(['delePost']); // 使用 emit 定义关闭事件

// 定义porps的值,那边传过来装数据的数组
const props = defineProps({
    itemArr: {
        type: Array,
        default: () => []
    }
})

// base64转url
function getUrl(images) {
    try {
  const file = base64ImgtoFile(images);
  const imgUrl = window.webkitURL.createObjectURL(file) || window.URL.createObjectURL(file);
  return imgUrl
  // 使用imgUrl
} catch (error) {
  // 处理错误,可以返回个默认的头像
    return useUserStore().avatar
}
}

function base64ImgtoFile (dataurl, filename = 'file') {
  if (!dataurl.startsWith('data:image/')) {
    throw new Error('Invalid dataurl');
  }
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const suffix = mime.split('/')[1] 
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}

// 点击帖子
function handleClick(item) {
    emit('handleClick',item); // 触发删除事件
}

// 删除事件
const handleDelete = (item) => {
    emit('delePost',item); // 触发删除事件
}

</script>
<style scoped>
.el-card__body {
    margin-top: 20px !important;
}
.rightnav {
    margin-top: 20px !important;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: black;
}
.tweet-container{
    padding: 0px !important;
    margin-top: 20px !important;
    background-color: black;
    border: 0 !important;
    color: white;
    margin-top: 30px !important;
    border-bottom: 1px solid #202020 !important;
}
.imageds {
    background-color: black;
}
.tweet-container:hover {
    box-shadow: 2px 2px 6px 6px #d4f6ff;
} 
.deleBut {
    margin-top: 25px;
}
.name1 {
    line-height: 60px;
}
</style>