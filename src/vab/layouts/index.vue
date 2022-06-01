<template>
 
  <el-container class="contanier_box">
    <!-- 头部 -->
    <el-header>
       <common-head></common-head>
    </el-header>
    <!-- 头部下面的内容 -->
    <el-container>
      <!-- 侧边导航 -->
      <el-aside width='205px'
                class="sliber_box">
         <common-aside></common-aside>
      </el-aside>
      <!-- 主要内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
 
</template>
 
<script>
import CommonAside from "@/components/CommonAside.vue";
import CommonHead from "@/components/CommonHead.vue";
export default {

   components: {
    // eslint-disable-next-line vue/no-unused-components
    CommonAside,
    // eslint-disable-next-line vue/no-unused-components
    CommonHead,
  },
}
</script>
 
<style lang="scss" scoped>
</style>