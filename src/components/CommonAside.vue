<template>
  <el-menu
    default-active="1-4-1"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    background-color="#545c64"
    text-color="#fff"
  >
    <h3>管理系统</h3>
    <el-menu-item
      :index="item.path"
      v-for="item in noChildren"
      :key="item.path"
      @click="clickMen(item)"
    >
      <i :class="'el-icon-' + item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>

    <el-submenu :index="v.path" v-for="v in hasChildren" :key="v.path">
      <template slot="title">
        <i :class="'el-icon-' + v.icon"></i>
        <span>{{ v.label }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          :index="sub.path"
          v-for="sub in v.children"
          :key="sub.path"
          @click="clickMen(sub)"
        >
          <i :class="'el-icon-' + sub.icon"></i>
          <span>{{ sub.label }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: false,
      navList: [
        {
          path: "/",
          name: "home",
          label: "首页",
          icon: "s-home",
          url: "Home/Home",
        },
        {
          path: "/mqll",
          name: "mall",
          label: "商品管理",
          icon: "video-play",
          url: "MallManage/manage",
        },
        {
          path: "/system",
          name: "system",
          label: "系统管理",
          icon: "video-play",
          children: [
            {
              path: "/user",
              name: "user",
              label: "用户管理",
              icon: "account-box-line",
              url: "user/user",
            },
            {
              path: "/role",
              name: "role",
              label: "角色管理",
              icon: "account-circle-line",
              url: "/role/role",
            },
            {
              path: "/gen",
              name: "gen",
              label: "生成管理",
              icon: "account-circle-line",
              url: "/gen/gen",
            },
            {
              path: "/swagger",
              name: "swagger",
              label: "系统接口",
              icon: "account-circle-line",
              url: "/gen/gen",
            },
            {
              path: "/druid",
              name: "druid",
              label: "数据监控",
              icon: "account-circle-line",
              url: "/druid",
            },
          ],
        },

      ],
    };
  },

  computed: {
    noChildren() {
      return this.navList.filter((item) => !item.children);
    },
    hasChildren() {
      return this.navList.filter((item) => item.children);
    },
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
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
        line-height: 48px
      }

}
</style>