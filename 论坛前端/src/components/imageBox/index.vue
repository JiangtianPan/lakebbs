<template>
  <div class="freshNews-container" @click="handle" >
          <!-- 图片 -->
          <div class="image-Box" v-if="visibleItems.image">
               <img :src="visibleItems.image" alt="">
          </div>
          <!-- 标题 -->
           <el-row class="title-row">
            <!-- 商品描述 -->
            <div style="font-weight: 800;">{{ visibleItems.title }}</div>
            <div style="margin-left: 10px;">{{ visibleItems.content }}</div>
           </el-row>
           <el-row class="title-row" style="font-size: 16px;">
            <!-- 用户头像和用户名 -->
            <div><img :src="visibleItems.User.avatar" style="width: 20px;height: 20px;border-radius: 50%;" ></div>
            <div style="margin-left: 10px;">{{ visibleItems.User.name }}</div>
           </el-row>
        </div>
</template>

<script setup>
  import { ref,defineProps, defineEmits } from 'vue'

  const emit = defineEmits(['handle'])
  const randomHeight = ref(Math.floor(Math.random() * (500 - 400 + 1)) + 400)
  const props = defineProps({
    visibleItems: {
      type: Object,
      default: () => ({})
    }
  })

  const handle = () => {
    emit('handle',props.visibleItems)
  }

</script>

<style>
  .freshNews-container {
    width: 100%;
    color: white;
    margin: 20px;
    font-size: 22px;
    background-color: rgb(12, 12, 12);
  }
  .freshNews-container:hover {
    background-color: rgb(43, 43, 43);
    /* 小手样式 */
    cursor: pointer;
  }
  .image-Box{
    width: 100% !important;
    /* height: 400px !important; */
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .image-Box img{
    width: 100% !important;
    /* object-fit: cover; */
  }
  .title-row{
    margin-top: 20px !important;
    width: 400px;
    margin: 0 auto;
  }
</style>