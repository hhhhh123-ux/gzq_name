<template>
  <el-menu
    default-active="String(activeNav)"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    background-color="#545c64"
    text-color="#fff"
  >
   
    <el-menu-item
      :index="item.path"
      v-for="item in noChildren"
      :key="item.path"
      @click="clickMen(item)"
    >
      <template slot="title">
        <svg-icon
          slot="prefix"
          v-if="item.meta && item.meta.icon"
          :icon-class="item.meta.icon"
        ></svg-icon>
        <span slot="title">{{ item.meta.title }}</span>
      </template>
    </el-menu-item>

    <el-submenu :index="v.path" v-for="v in hasChildren" :key="v.path">
      <template slot="title">
        <svg-icon
          v-if="v.meta && v.meta.icon"
          :icon-class="v.meta.icon"
        ></svg-icon>
        <span>{{ v.meta.title }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          :index="sub.path"
          v-for="sub in v.children"
          :key="sub.path"
          @click="clickMen(sub)"
        >
          <svg-icon
            v-if="sub.meta && sub.meta.icon"
            :icon-class="sub.meta.icon"
          ></svg-icon>
          <span>{{ sub.meta.title }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
import { getList } from "@/api/system/menu/menu";

export default {
  data() {
    return {
      isCollapse: true,
      activeTab: "1", //默认显示的tab
      tabIndex: 1, //tab目前显示数
      navList: [],
    };
  },
  created() {
    this.getMenu();
  },
  computed: {
    setHeight() {
      return document.documentElement.clientHeight - 65;
    },
    noChildren() {
      return this.navList.filter((item) => !item.children);
    },
    hasChildren() {
      return this.navList.filter((item) => item.children);
    },
    activeNav() {
      //当前激活的导航
      return this.$route.path;
    },
  },
  methods: {
    handleOpen() {
      if (this.isCollapse == false) {
        this.isCollapse = true;
      } else {
        this.isCollapse = false;
      }
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getMenu() {
      getList().then((res) => {
        this.navList = res.data;
      });
    },
    clickMen(item) {
      this.$router.push({ path: item.path });
    },
  },
};
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu {
  height: 100%;
  border: none;

  h3 {
    color: #fff;
    text-align: center;
    line-height: 48px;
  }
}
</style>