<!-- Start Generation Here -->
<template>
    <el-container style="width: 100%; height: 100%;">
        <el-aside width="200px">
            <el-menu>
                <el-menu-item index="1" @click="$router.push({ name: 'Ad' })">广告管理</el-menu-item>
                <el-menu-item index="2" @click="$router.push({ name: 'Posts' })">帖子管理</el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            <router-view></router-view> <!-- 二级路由展示 -->
        </el-main>
    </el-container>
</template>

<script setup>
// 这里可以添加相关的逻辑
</script>
<style scoped>
.el-aside {
    background-color: #f5f5f5;
}
</style>
<!-- End Generation Here -->
