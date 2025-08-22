<template>
    <el-carousel height="300px" :autoplay="true" style="background-color: pink;">
        <el-carousel-item v-for="(image, index) in images" :key="index">
            <img :src="image.url" class="carousel-image" alt="carousel image" />
            {{ image.url }}
        </el-carousel-item>
    </el-carousel>
</template>

<script setup>
// 后端传来的图片数组
import { ref, onMounted } from 'vue'
import { getAdList } from '../../api/ad'

// 模拟从后端获取的图片数据
const images = ref([
])

// 在这里，你可以根据实际情况从后端获取图片数据，并将其赋值给 images 变量
onMounted(()=>{
    getAdList().then(res=>{
        console.log(res.data.data)
        images.value = res.data.data
        images.value.forEach((item,index)=>{
            const file = base64ImgtoFile(item.imageUrl) // 得到File对象
            const imgUrl = window.webkitURL.createObjectURL(file) || window.URL.createObjectURL(file)
            images.value[index].url = imgUrl
        })
    })
})
  
function base64ImgtoFile (dataurl, filename = 'file') {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const suffix = mime.split('/')[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      })
    }

</script>
<style scoped>
.carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: white ;
}
</style>