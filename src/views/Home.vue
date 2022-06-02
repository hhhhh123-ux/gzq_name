<template>
  <el-container style="height: 100%; weight:100%">
    <el-header style="weight:100%">
      <common-head></common-head>
    </el-header>
    <el-container style="weight: 100%">
      <el-aside>
        <common-aside></common-aside>
      </el-aside>
      <el-main style="padding: 0">
        <common-tab> </common-tab>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonAside from "../components/CommonAside.vue";
import CommonHead from "../components/CommonHead.vue";
import CommonTab from "../components/CommonTab.vue";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  components: {
    CommonAside,
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