<!-- 新鲜事 -->
<template>
  <div class="freshNews">
    <!-- 主页面 -->
    <el-row>
      <el-col :span="16"> 
        <div @scroll="handleScroll" class="scroll-container scroll-container-main" style="overflow-y: auto; height: 99vh;">
          <!-- <lunbo /> -->
            <div v-for="(item, index) in visibleItems" :key="index" class="msgcarde" >
                <msgCard :avatarSrc="item.User.avatar" :userName="item.User.name" :tweetText="item.title"
                  :tweetTime="item.publishTime" 
                  :verifiedIconSrc="item.image"
                  :repliesCount="item.repliesCount" 
                  :retweetsCount="item.retweetsCount"
                  :likesCount="item.likesCount" 
                  :selectedId="item"
                  @showDialog=showping(item)
                  />
              </div>
          <div v-if="loading" class="loading">加载中...</div>
        </div>
      </el-col>
      <el-col :span="8" class="scroll-container-main" style="height: 100vh; overflow-y: scroll;">
        <rightNav/>
      </el-col>
    </el-row>

  <!-- 对话框模板层 -->
  <el-dialog v-model="visible" :show-close="false" width="58%" align-center style="height: 80vh;overflow: hidden;background-color: black;border: 1px solid white;border-radius: 20px;" @close="handleClose">
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
  </div>
  
</template>

<script setup>
import msgCard from '@/components/msgCard/index.vue';
import { ref, onMounted } from 'vue';
import diLogo from '@/components/msgCard/dilogo.vue';
import { getPostListRouter } from '../../api/post'
// import lunbo from '';
import rightNav from '@/components/rightNav/index.vue'
import { Back } from '@element-plus/icons-vue'
import emitter from '../../api/eventBus';

const visible = ref(false)   // 对话框显示状态
const items = ref([]); // 所有数据
const visibleItems = ref([]); // 可见数据
const loading = ref(false);
const totalItems = 10; // 示例总数据条数
const loadThreshold = 100; // 触发加载的阈值（像素）
const selectedItem = ref(null); // 当前选中的项目

// 页面数据
const generateItems = () => {
  // 获取全部帖子
  getPostListRouter().then(res => {
    if(res.code == 200) {
      // 过滤 section 为 "新鲜事" 的数据
      const freshNewsItems = res.data.filter(item => item.section === '新鲜事');
      
      if(freshNewsItems.length >= 10) {
        items.value = freshNewsItems;
        visibleItems.value = items.value.slice(0, 10); // 初始显示10条数据
      } else {
        visibleItems.value = freshNewsItems;
      }
    }
  })
}

function handleClose() {
  emitter.emit('routed',['2', '/freshNews'])
}

// 显示评论
const showping = (item) => {
  selectedItem.value = item;
  visible.value = true;
  emitter.emit('updataping', item)
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

function showpinged() {
  visible.value = false
}

// 组件挂载时生成数据
onMounted(() => {
  generateItems();
  emitter.on('remarked',showping)
  emitter.on('remark', showpinged);
  // loadMoreData(); // 加载初始数据
});

</script>

<style scoped>

.loading {
  text-align: center;
  padding: 10px;
}

/* 自定义样式 */
.msgcarde {
  margin-top:10px !important;
}

</style>
