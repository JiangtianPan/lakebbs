<template>
  <el-card class="tweet-container">
    <!-- 顶部：头像和用户名 -->
    <el-row :gutter="10" class="tweet-header">
      <el-col :span="3">
        <el-avatar :src="comment.User.avatar" size="large" class="imagesd" />
      </el-col>
      <el-col :span="18">
        <div class="user-info">
          <span class="name">{{ comment.User.name }}</span>
          <span style="width: 10px;height: 10px;"></span>
          <!-- 时间 -->
          <span class="handle">{{ localTime(comment.commentTime) }}</span>
        </div>
        <div class="tweet-content">
          <p>{{ comment.content }}</p>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { getUserProfile } from '../../api/userPost';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import emitter from '../../api/eventBus/index.js'
import { localTime } from '../../api/getTimed/index.js'

// 定义 Props
defineProps({
  comment: {
    type: Object,
    required: true,
  }
});

</script>

<style scoped>
/* 容器 */
.tweet-container {
  background-color: #000;
  color: #fff;
  padding: 2px;
  width: 100%;
  border-radius: 10px;
  font-family: 'Arial', sans-serif;
  box-sizing: border-box;
}

/* 头像和用户名部分 */
.tweet-header {
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  flex-direction: row;
}

.name {
  font-weight: bold;
  font-size: 18px;
}

.verified-icon {
  width: 18px;
  height: 18px;
  margin-left: 5px;
}

.handle {
  color: #8899a6;
  font-size: 14px;
  line-height: 2;
}

/* 内容部分 */
.tweet-content {
  margin-top: 10px;
  font-size: 16px;
  line-height: 1.5;
}

.imagesd {
  background-color: white !important;
}

</style>