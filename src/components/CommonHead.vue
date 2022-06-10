<template>
  <el-header>
    <div class="user-system">管理系统</div>
    <el-dropdown @command="handleCommand" style="cursor: pointer; float: right">
      <span class="avatar-dropdown">
        <el-avatar
          class="user-avatar"
          style="margin-right: 8px"
          :src="avatar"
        />
        <div class="user-name">
          <svg-icon icon-class="vab" />
          <span class="" style="height: 40px">
            {{ username }}
          </span>
        </div>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="personalCenter">
            <svg-icon icon-class="user" />
            个人中心
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <svg-icon icon-class="logout" />
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-header>
</template>
<script>
import { getUserInfo, logOut } from "@/api/system/user/user";
import {toLoginRoute} from "@/router/index";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      active: false,
      activeIndex: "1",
      activeIndex2: "1",
      avatar: "https://i.gtimg.cn/club/item/face/img/3/15643_100.gif",
      username: "嘻嘻",
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
      switch (command) {
        case "logout":
          this.logout();
          break;
        case "personalCenter":
          this.personalCenter();
          break;
      }
    },
    personalCenter() {
      this.$router.push("/setting/personalCenter");
    },
    async logout() {
      await this._logout().then((res) => {
        if (res.code == "200") {
          var storage = window.localStorage;
          storage.clear();
          
        }
      });
      console.log("path",this.$route.fullPath);
      this.$router.push(toLoginRoute(this.$route.fullPath));
    },
    userInfo() {
      getUserInfo().then((res) => {
        this.username = res.data.username;
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.user-system {
  display: flex;
  align-content: center;
  align-items: center;
  font-size: 20px;
  float: left;
  cursor: pointer;
  position: relative;
  margin-left: 6px;
  line-height: 40px;
  height: 40px;
}
.avatar-dropdown {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;

  .user-avatar {
    width: 40px;
    height: 40px;
    margin-left: 15px;
    cursor: pointer;
    border-radius: 50%;
  }

  .user-name {
    position: relative;
    display: flex;
    align-content: center;
    align-items: center;
    height: 40px;
    margin-left: 6px;
    line-height: 40px;
    cursor: pointer;

    [class*="ri-"] {
      margin-left: 0 !important;
    }
  }
}

</style>
