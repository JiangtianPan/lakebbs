<template>
  <div ref="scrollContainer" @scroll="handleScroll" class="container scroll-container-main">
    <el-row :gutter="10" v-for="(item, index) in leftItems" :key="'left-' + index"> <!-- 使用gutter设置列间距 -->
      <el-col :span="8" >
        <imageBox class="imageBox" ></imageBox> <!-- 添加class -->
      </el-col>
      <el-col :span="8">
        <imageBox  class="imageBox" ></imageBox> <!-- 添加class -->
      </el-col>
      <el-col :span="8">
        <imageBox  class="imageBox" ></imageBox> <!-- 添加class -->
      </el-col>
    </el-row>
    <div v-if="loading" class="loading">加载中...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import imageBox from '@/components/imageBox/index.vue';

const leftItems = ref([]);
const rightItems = ref([]);
const loading = ref(false);
const scrollContainer = ref(null);
const totalItems = 20; // 假设总共需要加载的项目数

const loadItems = () => {
  if (loading.value) return;

  loading.value = true;
  setTimeout(() => {
    const newItems = Array.from({ length: 5 }, (_, i) => `Item ${leftItems.value.length + i + 1}`);
    leftItems.value.push(...newItems.slice(0, 3));
    rightItems.value.push(...newItems.slice(3));
    loading.value = false;
  }, 1000);
};

const handleScroll = () => {
  const container = scrollContainer.value;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 20) {
    if (leftItems.value.length + rightItems.value.length < totalItems) {
      loadItems();
    }
  }
};

onMounted(() => {
  loadItems();
});
</script>

<style scoped>
.container {
  overflow-y: scroll;
  height: 100vh;
}

.imageBox {
  /* margin: 5px; 调整每个盒子的间距 */
}

.loading {
  text-align: center;
  /* padding: 10px; */
}
</style>
