<template>
  <div class="home">
    <el-row>
      <el-col :span="16">
        <div @scroll="handleScroll" class="scroll-container scroll-container-main"
          style="overflow-y: auto; height: 99vh;">
          <lunbo />
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" :stretch="true">
            <el-tab-pane label="推荐" name="first">
              <div v-for="(item, index) in visibleItems" :key="index" class="msgCard">
                <msgCard :avatarSrc="item.User.avatar" :userName="item.User.name" :tweetText="item.title"
                  :tweetTime="item.publishTime" 
                  :verifiedIconSrc="item.image"
                  :repliesCount="item.repliesCount" 
                  :retweetsCount="item.retweetsCount"
                  :likesCount="item.likesCount" @click="visibleFunc(item)"
                  :selectedId="item"
                   />
              </div>
              <div v-if="loading" class="loading">加载中...</div>
            </el-tab-pane>
            <!-- 关注页面 -->
            <el-tab-pane label="关注" name="second">
              <div v-for="(item, index) in visibleItems" :key="index" class="msgCard">
                <msgCard  :avatarSrc="item.User.avatar" :userName="item.User.name" :tweetText="item.title"
                  :tweetTime="item.publishTime" 
                  :verifiedIconSrc="item.image"
                  :repliesCount="item.repliesCount" 
                  :retweetsCount="item.retweetsCount"
                  :likesCount="item.likesCount" @click="visibleFunc(item)"
                  :selectedId="item"
                  />
              </div>
              <div v-if="loading" class="loading">加载中...</div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="8" class="scroll-container-main" style="height: 100vh; overflow-y: scroll;">
        <rightNav />
      </el-col>
    </el-row>

    <!-- 对话框模板层 -->
    <el-dialog v-model="visible" :show-close="false" width="58%" align-center style="height: 100vh;">
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
      <diLogo :selectedItem="selectedItem"  />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import msgCard from '@/components/msgCard/index.vue';
import lunbo from './lun.vue';
import rightNav from '@/components/rightNav/index.vue'
import diLogo from '@/components/msgCard/dilogo.vue';
import { Back } from '@element-plus/icons-vue'
//  引入接口
import { getHomeData } from '@/api/home';

import { getPostListRouter } from '../../api/post/index.js'
import {getFollowList} from '../../api/follow/index.js'

// 调取接口获取帖子列表
// getPostListRouter().then(res => {
//   console.log(res)
// })
// 定义数据
const activeName = ref('first'); // 当前激活的标签页
const handleClick = (tab, event) => {
  console.log(tab, event);
  console.log(1111111);
  
};

const isFollowing = ref(true); // 初始化关注状态
const visible = ref(false); // 对话框是否可见
const items = ref([]); // 所有数据
const visibleItems = ref([]); // 可见数据
const loading = ref(false);
const totalItems = 10; // 示例总数据条数
const loadThreshold = 100; // 触发加载的阈值（像素）
const selectedItem = ref(null); // 当前选中的用户

// 定义方法
const visibleFunc = (item) => {
  selectedItem.value = item; // 存储选中的用户
  console.log("selectedItem", selectedItem.value);

  isFollowing.value = item.verified; // 更新关注状态
  visible.value = true;
}
// 处理关闭对话框事件
const close = () => {
  visible.value = false; // 关闭对话框
  selectedItem.value = null; // 清空选中项
};

// 模拟数据
//  const generateItems = () => {
//    for (let i = 0; i < totalItems; i++) {
//      items.value.push({
//        avatarSrc: '/path/to/avatar.jpg',//头像
//        userName: `用户${i}`,//用户名
//        tweetText: `这是第${i + 1}条消息`,//标题
//        tweetTime: '2:32 AM · Sep 19, 2024',//时间
//        repliesCount: `${Math.floor(Math.random() * 10000)}K`,//随机赞
//        retweetsCount: `${Math.floor(Math.random() * 10000)}K`,//随机收藏
//        likesCount: `${Math.floor(Math.random() * 10000)}K`,//随机评论
//        verified: true,//是否关注
//        verifiedIconSrc: '/path/to/verified-icon.png'//图片
//      });
//    }
//  }

// 调用 getHomeData 函数
const fetchHomeData = async () => {
  try {
   const {data} =  await getPostListRouter();
   console.log(data);
   
    items.value = data; // 假设接口返回的数据在 response.data 中
    loadMoreData()   // 加载更多数据
  } catch (error) {
    console.error('获取数据失败：', error); // 处理错误
  }

};

// 加载更多数据
const loadMoreData = () => {
  // 如果当前正在加载数据，则直接返回，不执行后续代码
  if (loading.value) return;

  loading.value = true;// 设置加载状态为正在加载
  // 使用 setTimeout 模拟数据加载延迟
  setTimeout(() => {
    // 从 items 中获取下一批需要加载的数据
    const nextItems = items.value.slice(visibleItems.value.length, visibleItems.value.length + 5);
    visibleItems.value.push(...nextItems);
    loading.value = false;
  }, 1000);
}

// 滚动事件处理
const handleScroll = (event) => {
  // 从事件对象中提取 scrollTop 和 offsetHeight
  const { scrollTop, offsetHeight } = event.target;
  // innerHeight 获取视口的高度
  const innerHeight = window.innerHeight;
  // console.log(scrollTop, offsetHeight, innerHeight, event.target.scrollHeight);


  // 判断是否接近底部
  if (scrollTop + offsetHeight + loadThreshold >= event.target.scrollHeight) {
    if (visibleItems.value.length == items.value.length) {
      loading.value = false;
    } else {
      loadMoreData();
    }
  }
}

// 组件挂载时生成数据
onMounted(() => {
  //  generateItems();
  fetchHomeData(); // 调用接口获取数据
 
});
//  页面渲染
</script>

<style scoped>
.scroll-container {
  border: 1px solid #ccc;
  /* 可选样式 */
}

.loading {
  text-align: center;
  padding: 10px;
}

.msg-container {
  text-align: center;
  font-size: 28px;
}

.text_title {
  cursor: pointer;
  /* 设置为小手样式 */
  transition: color 0.3s;
  /* 添加平滑过渡效果 */
}

.text_title:hover {
  color: #409EFF;
  /* Hover 状态下的颜色变化 */
  text-decoration: underline;
  /* 添加下划线 */
}

.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

</style>