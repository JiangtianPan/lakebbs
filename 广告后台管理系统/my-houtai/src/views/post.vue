<template>
    <el-container>
        <el-header>
            <h2>帖子展示</h2> <!-- 页面标题 -->
            <el-input v-model="searchPostId" placeholder="搜索 帖子 ID" @input="searchPosts"
                style="width: 300px; margin-bottom: 20px;"></el-input>
        </el-header>
        <el-main>
            <el-table :data="filteredPosts" style="width: 100%">
                <el-table-column prop="postId" label="帖子 ID" />
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="content" label="内容" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="danger" @click="handleDeletePost(scope.row.postId)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="publishTime" label="发布时间" />
                <el-table-column prop="section" label="归属板块" />
            </el-table>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getPosts, deletePost as apiDeletePost } from '../api/index'

const posts = ref([]); // 所有帖子数据
const searchPostId = ref(''); // 搜索的 Post ID
// 模拟从后端获取数据
const fetchPosts = async () => {
    // 这里可以调用接口获取数据
    // 假设后端返回的数据格式如下
    const { data } = await getPosts();
    posts.value = data;
    console.log(posts.value);
};

// 删除帖子
const handleDeletePost = async (postId) => {
    await apiDeletePost(postId);
    posts.value = posts.value.filter(post => post.postId !== postId); // 更新本地数据
};

// 搜索帖子
const filteredPosts = computed(() => {
    console.log(searchPostId.value);
    if (searchPostId.value === '') {
        return posts.value;
    }
    return posts.value.filter(post => post.postId.toString().includes(searchPostId.value));
});

// 初始化数据
fetchPosts();
</script>

<style scoped>
/* 添加样式 */
.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
