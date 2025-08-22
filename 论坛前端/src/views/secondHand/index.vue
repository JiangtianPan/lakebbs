<!-- 二手 -->
<template>
  <div ref="scrollContainer" @scroll="handleScroll" class="container scroll-container-main" v-if="leftItems">
    <div class="waterfall-container">
      <div class="waterfall-item" v-for="(item, index) in leftItems" :key="'left-' + index">
        <imageBox class="imageBox" :visibleItems="item" @handle="handleScroll(item)"></imageBox>
      </div>
      <div class="waterfall-item" v-for="(item, index) in rightItems" :key="'right-' + index">
        <imageBox class="imageBox" :visibleItems="item" @handle="handleScroll(item)"></imageBox>
      </div>
    </div>
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
import { ref, onMounted } from 'vue';
import imageBox from '@/components/imageBox/index.vue';
import { getPostListRouter } from "../../api/post/index";
import emitter from '../../api/eventBus';
import diLogo from "../../components/msgCard/dilogo.vue";
import { Back } from '@element-plus/icons-vue'

const leftItems = ref([]);
const rightItems = ref([]);
const loading = ref(false);
const scrollContainer = ref(null);
const zongitems = ref([]);
const totalItems = 20; // 假设总共需要加载的项目数
const selectedItem = ref(null);
const visible = ref(false);

function handleScroll(item) {
  selectedItem.value = item;
  visible.value = true;
  emitter.emit('updataping', item)
}

function handleClose() {
  emitter.emit('routed',['3', '/secondHand'])
}

onMounted(() => {
  emitter.on('remark',()=>{
    visible.value = false;
  })
  // 获取所有帖子
  getPostListRouter().then((res) => {
    zongitems.value = res.data.filter(item => item.section === '二手');
    zongitems.value.forEach((item, index) => {
      if (index % 2 === 0) {
        leftItems.value.push(item);
      } else {
        rightItems.value.push(item);
      }
    });
  });
});
</script>

<style scoped>
.container {
  overflow-y: scroll;
  height: 100vh;
  margin-left: 50px !important;
  margin-right: 50px !important;
}

.waterfall-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.waterfall-item {
  width: calc(50% - 5px);
  margin-bottom: 10px;
}

.imageBox {
  margin: 5px;
  color: white;
  box-sizing: border-box;
}

.loading {
  text-align: center;
  /* padding: 10px; */
}

.el-dialog {
  background-color: rgb(12, 12, 12) !important;
}
</style>
