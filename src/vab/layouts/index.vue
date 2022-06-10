<template>
  <el-container class="contanier_box" style="height: 100%">
    <!-- 头部 -->
    <el-header>
      <common-head></common-head>
    </el-header>
    <!-- 头部下面的内容 -->
    <el-container>
      <el-aside width="auto">
        <common-aside></common-aside>
      </el-aside>
      <!-- 主要内容 -->
      <el-main>
        <common-tab></common-tab>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
 
<script>
import CommonAside from "@/components/CommonAside.vue";
import CommonHead from "@/components/CommonHead.vue";
import CommonTab from "@/components/CommonTab.vue";
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    CommonAside,
    // eslint-disable-next-line vue/no-unused-components
    CommonHead,
    // eslint-disable-next-line vue/no-unused-components
    CommonTab,
  },
};
</script>
 
<style lang="scss" scoped>
.el-header {
  background-color: #beb3d1;
  color: rgb(51, 51, 51);
  line-height: 60px;
}
</style>