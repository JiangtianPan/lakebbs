<template>
  <div class="app">
    <!-- 侧边栏 -->
    <div style="width: 15%;">
       <!-- logo 图标 -->
       <div class="naTab-logo">
            <img src="./assets/image/logo2.png" alt="">
        </div>
      <navTab />
    </div>

    <div style="width: 85%;">
      <router-view></router-view>
    </div>
    <!-- 热搜 -->
    <!-- <div style="width: 20%;height: 100vh;overflow-y: scroll;">
      <rightNav />
    </div> -->
  </div>
</template>
<script setup>
import navTab from '@/components/navTab/index.vue'
import rightNav from '@/components/rightNav/index.vue'
import { RouterView } from 'vue-router';
</script>
<style scoped>
.app {
  width: 100%;
  height: 100%;
  display: flex;
}
.naTab-logo{
    width: 99.5%;
    height: 12vh;
    background-color: #1A1A1B;
}
.naTab-logo img{
    width: 97%;
    height: 100%;
    display: block;
}
</style>
