<template>
    <el-carousel height="300px" :autoplay="true" style="background-color: pink;">
        <el-carousel-item v-for="(image, index) in images" :key="index">
            <img :src="image.url" class="carousel-image" alt="carousel image" />
        </el-carousel-item>
    </el-carousel>
</template>

<script setup>
// 后端传来的图片数组
import { ref } from 'vue'

// 模拟从后端获取的图片数据
const images = ref([
    { url: 'http://localhost:3000/image1.jpg' },
    { url: 'http://localhost:3000/image2.png' },
    { url: 'http://localhost:3000/image3.jpg' },
    // 更多图片...
])


</script>
<style scoped>
.carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>