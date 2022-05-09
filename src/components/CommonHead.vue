<template>
  <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#ffffff"
      text-color="#ffffff"
      active-text-color="#ffffff"
  >
    <el-header style="text-align: right; font-size: 60px">
      <el-dropdown @command="handleCommand">
        <el-avatar class="user-avatar" :src="avatar" style="margin-right: 15px"/>
        <div class="user-name">
          <span class="hidden-xs-only" style="margin-right: 15px">{{ username }}</span>
          <vab-icon
              class="vab-dropdown"
              :class="{ 'vab-dropdown-active': active }"
              icon="arrow-down-s-line"
          />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="personalCenter">
              <vab-icon icon="user-line"/>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="logout">
              <vab-icon icon="logout-circle-r-line"/>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
  </el-menu>
</template>
<script>
import {userInfo, logOut} from '@/api/system/user/user';
import {toLoginRoute} from '@/router/index';
import {mapActions} from 'vuex'

export default {
  data() {
    return {
      active: false,
      activeIndex: '1',
      activeIndex2: '1',
      avatar: 'https://i.gtimg.cn/club/item/face/img/3/15643_100.gif',
      username: '嘻嘻',
    };
  },
  created() {
    this.userInfo();
  },
  methods: {
    ...mapActions({
      _logout: logOut,
    }),
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleCommand(command) {
      console.log("command==", command)
      switch (command) {
        case 'logout':
          this.logout()
          break
        case 'personalCenter':
          this.personalCenter()
          break
      }
    },
    personalCenter() {
      this.$router.push('/setting/personalCenter')
    },
    async logout() {
      console.log("loginOut")

      await this._logout().then((res) => {
        if (res.code == '200') {
          var storage = window.localStorage;
          storage.clear();
        }
      })
      await this.$router.push(toLoginRoute(this.$route.fullPath))
    },
    userInfo() {
      userInfo().then((res) => {
        console.log("res==", res.data.username)
        this.username = res.data.username;
      })
    },
  }
}
</script>