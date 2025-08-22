<template>
 <div style="width: 100vw;height: 100vh;background-color: black;">
  <div class="app">
    <!-- 侧边栏 -->
    <div style="width: 19%;border-right: 1px solid #202020;">
       <!-- logo 图标 -->
       <div class="naTab-logo">
            <img src="./assets/image/logo2.png" class="imglog">
        </div>
      <navTab />
    </div>

    <div style="width: 78%;" class="navtar">
      <router-view></router-view>
    </div>
    
    <!-- 热搜 -->
    <!-- <div style="width: 20%;height: 100vh;overflow-y: scroll;">
      <rightNav />
    </div> -->
  </div>
 </div>
</template>
<script setup>
import navTab from '@/components/navTab/index.vue'
import rightNav from '@/components/rightNav/index.vue'
import { RouterView } from 'vue-router';
</script>
<style scoped>
.app {
  background-color: black !important;
  width:1200px;
  margin: 0 auto;
  height: 100vh !important;
  display: flex;
  overflow: hidden;
}
.naTab-logo{
    width: 99.5%;
    height: 12vh;
    background-color: black;
}

.naTab-logo img{
    width: 97%;
    height: 100%;
    display: block;
}

.navtar {
  margin-left: 10px !important;
}
</style>
