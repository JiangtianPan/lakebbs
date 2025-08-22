<!-- Start Generation Here -->
<template>
    <el-container>
        <el-header>
            <h2>广告展示</h2> <!-- 页面标题 -->
        </el-header>
        <el-main>
            <el-form @submit.prevent="addAd" style="margin-bottom: 20px;">
                <el-form-item label="标题" required>
                    <el-input v-model="newAd.title" placeholder="请输入广告标题" clearable></el-input>
                </el-form-item>
                <el-form-item label="广告图片" required>
                    <el-upload class="upload-demo" drag action="" :on-change="handleImageChange" :show-file-list="false"
                        :before-upload="beforeUpload">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="newAd.description" placeholder="请输入广告描述" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">添加广告</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="ads" style="width: 100%">
                <el-table-column prop="adId" label="广告 ID" />
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="imageUrl" label="广告图片">
                    <template #default="scope">
                        <img :src="scope.row.imageUrl" alt="广告图片" style="width: 100px; height: auto;" />
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="danger" @click="deleteAd(scope.row.adId)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchAds as apiFetchAds, deleteAd as apiDeleteAd, addAd as apiAddAd } from '../api/index'

const ads = ref([]); // 所有广告数据
const newAd = ref({ title: '', imageUrl: '', description: '' }); // 新广告数据

// 获取广告数据
const fetchAds = async () => {
    try {
        const { data } = await apiFetchAds();
        ads.value = data;
    } catch (error) {
        console.error('获取广告数据失败:', error);
    }
};

// 删除广告
const deleteAd = async (adId) => {
    try {
        await apiDeleteAd(adId);
        ads.value = ads.value.filter(ad => ad.adId !== adId); // 更新本地数据
    } catch (error) {
        console.error('删除广告失败:', error);
    }
};

// 添加广告
const addAd = async () => {
    try {
        const { data } = await apiAddAd(newAd.value);
        ads.value.push(data); // 更新广告列表
        newAd.value = { title: '', imageUrl: '', description: '' }; // 清空输入框
    } catch (error) {
        console.error('添加广告失败:', error);
    }
};

// 处理图片上传
const handleImageChange = (file) => {
    console.log();
    const reader = new FileReader();
    reader.onload = (e) => {
        newAd.value.imageUrl = e.target.result; // 将图片数据存储到 newAd 中
    };
    reader.readAsDataURL(file.raw);
};

// 上传前的验证
const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        this.$message.error('上传图片格式不正确!');
    }
    return isImage;
};

// 初始化数据
onMounted(fetchAds);
</script>

<style scoped>
/* 添加样式 */
.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
<!-- End Generation Here -->
