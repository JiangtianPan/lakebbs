<template>
  <div class="freshNews">
    <!-- 主页面 -->
    <el-row>
      <el-col :span="16"> 
        <div @scroll="handleScroll" class="scroll-container scroll-container-main" style="overflow-y: auto; height: 99vh;">
          <!-- <lunbo /> -->
          <msgCard plain @click="visible = true" avatarSrc="/path/to/avatar.jpg" userName="岸田文雄" tweetText="昨日、中国広東省深圳市で男に襲われた..."
            tweetTime="2:32 AM · Sep 19, 2024"  repliesCount="9.7K" retweetsCount="14K" likesCount="91K"
            verified verifiedIconSrc="/path/to/verified-icon.png" />
          <div v-for="(item, index) in visibleItems" :key="index" class="msgCard"  plain @click="visible = true">
            <msgCard :avatarSrc="item.avatarSrc" :userName="item.userName" :tweetText="item.tweetText"
              :tweetTime="item.tweetTime"  :repliesCount="item.repliesCount"
              :retweetsCount="item.retweetsCount" :likesCount="item.likesCount" />
          </div>
          <div v-if="loading" class="loading">加载中...</div>
        </div>
      </el-col>
      <el-col :span="8" class="scroll-container-main" style="height: 100vh; overflow-y: scroll;">
        <rightNav/>
      </el-col>
    </el-row>
    <!-- 对话框模板层 -->
    <el-dialog v-model="visible" :show-close="false" width="56.5%" align-center style="height: 100vh;" >
      <template #header="{ close }">
        <div class="my-header">
          <!-- 按钮 -->
          <el-button style="background-color: #000000;border: none;" @click="close" >
            <el-icon color="#ffffff" ><Back  /></el-icon>
          </el-button>
        </div>
      </template>
      <diLogo userName="岸田文雄" tweetLabel="昨日、中国広東省深圳市で男に襲われた..." tweetText="这是第1条消息的内容"
            tweetTime="2:32 AM · Sep 19, 2024" verified verifiedIconSrc="/path/to/verified-icon.png" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import diLogo from '@/components/msgCard/dilogo.vue';

// import lunbo from '';
import rightNav from '@/components/rightNav/index.vue'
import { Back } from '@element-plus/icons-vue'

const visible = ref(false)   // 对话框显示状态

const items = ref([]); // 所有数据
const visibleItems = ref([]); // 可见数据
const loading = ref(false);
const totalItems = 10; // 示例总数据条数
const loadThreshold = 100; // 触发加载的阈值（像素）

// 模拟数据
const generateItems = () => {
  for (let i = 0; i < totalItems; i++) {
    items.value.push({
      avatarSrc: '/path/to/avatar.jpg',
      userName: `用户${i}`,
      tweetText: `这是第${i + 1}条消息`,
      tweetTime: '2:32 AM · Sep 19, 2024',
      repliesCount: `${Math.floor(Math.random() * 10000)}K`,//
      retweetsCount: `${Math.floor(Math.random() * 10000)}K`,
      likesCount: `${Math.floor(Math.random() * 10000)}K`,
      verified: true,
      verifiedIconSrc: '/path/to/verified-icon.png'
    });
  }
}

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
    loadMoreData();
  }
}

// 组件挂载时生成数据
onMounted(() => {
  generateItems();
  loadMoreData(); // 加载初始数据
});
// handleClick事件触发
const handleClick = () => {

}
</script>

<style scoped>
.scroll-container {
  border: 1px solid #ccc; /* 可选样式 */
}
.loading {
  text-align: center;
  padding: 10px;
}
/* 自定义样式 */

</style>
