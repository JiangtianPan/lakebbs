<template>
  <div class="freshNews-container" :style="{ height: randomHeight + 'px' }">
          <!-- 图片 -->
          <div class="image-Box">
            <img src="https://picsum.photos/id/237/1000/500" alt="">
          </div>
          <!-- 标题 -->
           <el-row class="title-row">
            <el-col :span="8">1</el-col>
            <el-col :span="8">2</el-col>
            <el-col :span="8">3</el-col>
           </el-row>
        </div>
</template>

<script setup>
  import { ref } from 'vue'
  const randomHeight = ref(Math.floor(Math.random() * (500 - 400 + 1)) + 400)

</script>

<style>
  .freshNews-container {
    width: 100%;
    background-color: blue;
  }
  .image-Box{
    width: 100%;
    height: 80%;
  }
  .image-Box img{
    width: 100%;
    height: 100%;
  }
  .title-row{
    text-align: center;
  }
</style>