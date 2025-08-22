<template>
  <div class="home">
    <el-row>
      <el-col :span="16" style="padding: 20px;">
        <div @scroll="handleScroll" class="scroll-container scroll-container-main"
          style="overflow-y: auto; height: 99vh;">
          <lunbo />
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" :stretch="true">
            <el-tab-pane label="推荐" name="first">
              <div v-for="(item, index) in visibleItems" :key="index" class="msgcard">
                <msgCard :avatarSrc="item.User.avatar" :userName="item.User.name" :tweetText="item.title"
                  :tweetTime="item.publishTime" 
                  :verifiedIconSrc="item.image"
                  :repliesCount="item.repliesCount" 
                  :retweetsCount="item.retweetsCount"
                  :likesCount="item.likesCount" 
                  @visibleFunc="visibled(item)"
                  :selectedId="item"
                  />
              </div>
              <div v-if="loading" class="loading">加载中...</div>
            </el-tab-pane>
            <!-- 关注页面 -->
            <el-tab-pane label="关注" name="second">
              <div v-for="(item, index) in visibleItems" :key="index" class="msgcard">
                <msgCard  :avatarSrc="item.User.avatar" :userName="item.User.name" :tweetText="item.title"
                  :tweetTime="item.publishTime" 
                  :verifiedIconSrc="item.image"
                  :repliesCount="item.repliesCount" 
                  :retweetsCount="item.retweetsCount"
                  :likesCount="item.likesCount" 
                  @visibleFunc="visibled(item)"
                  :selectedId="item"
                  />
              </div>
              <div v-if="loading" class="loading">加载中...</div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>

      <el-col :span="8" class="scroll-container-main" style="height: 100vh">
        <rightNav/>
      </el-col>

    </el-row>

    <!-- 对话框模板层 -->
    <el-dialog v-model="visible" :show-close="false" width="58%" align-center style="height: 80vh;overflow: hidden;border: 1px solid white;background-color: black;border-radius: 20px;" @close="handleClose">
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import msgCard from '@/components/msgCard/index.vue';
import lunbo from './lun.vue';
import rightNav from '@/components/rightNav/index.vue'
import diLogo from '@/components/msgCard/dilogo.vue';
import { Back } from '@element-plus/icons-vue'
//  引入接口
import { getHomeData } from '@/api/home';
import { getPostListRouter } from '../../api/post'
import {getFollowList} from '../../api/follow/index.js'
import emitter from '../../api/eventBus/index.js'
import { useUserStore } from '../../stores/modules/user.js';

// 调取接口获取帖子列表
// getPostListRouter().then(res => {
//   console.log(res)
// })

// 定义数据
const activeName = ref('first'); // 当前激活的标签页
const handleClick = (tab, event) => {
  if (tab.props.label === '关注') {
    
    visibleItems.value = []
    getFollowList(useUserStore().userId).then(res => {
      // followerId是我自己的userid
      if(res.data.code == 200 ) {
        getPostListRouter().then(tiezi => {
          tiezi.data.forEach(element => {
            if(res.data.data.length == 0) visibleItems.value = []
            res.data.data.forEach(item => {
              if(element.userId == item.followedId) {
                visibleItems.value.push(element)
              }
            })
        });
        })
      }
    })
  }else if (tab.props.label === '推荐') {
    visibleItems.value = []
    fetchHomeData()
  }
};

function handleClose() {
  emitter.emit('routed',['1', '/'])
}

const isFollowing = ref(true); // 初始化关注状态
const visible = ref(false); // 对话框是否可见
const items = ref([]); // 所有数据
const visibleItems = ref([]); // 可见数据
const loading = ref(false);
const totalItems = 10; // 示例总数据条数
const loadThreshold = 100; // 触发加载的阈值（像素）
const selectedItem = ref(null); // 当前选中的用户

// 定义方法
function visibled(item) {
  selectedItem.value = item; // 存储选中的用户
  isFollowing.value = item.verified; // 更新关注状态
  visible.value = true;
  emitter.emit('updataping', item)
}

onMounted(() => {
    emitter.on('remark', showfun)
})

onBeforeUnmount(() => {
    emitter.off('remark')
})
 
function showfun(itdaa){ 
      if(itdaa) {
        visible.value = true;
        visibled(itdaa)
      }else {
        visible.value = false;
      }
}

// 处理关闭对话框事件
const close = () => {
  visible.value = false; // 关闭对话框
  selectedItem.value = null; // 清空选中项
};

// 调用 getHomeData 函数,获取推荐的数据
const fetchHomeData = async () => {
  try {
    visibleItems.value = []
   const {data} =  await getPostListRouter();
   items.value = data; // 假设接口返回的数据在 response.data 中
   visibleItems.value = items.value
   visibleItems.value = items.value.slice(0, 10); // 初始化可见数据
    // loadMoreData()   // 加载更多数据
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

.demo-tabs {
  overflow: auto;
}

.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: white !important;
  font-size: 32px;
  font-weight: 600;
}

.msgcard {
  margin-top: 30px;
}

::v-deep .el-tabs__item {
  color: white ; /* 修改字体颜色 */
  background-color: black;
}

::v-deep .el-tabs__nav {
    border-bottom: 1px solid #202020 !important;
}

</style>