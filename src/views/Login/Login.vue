<template>
  <div
    v-loading="loading"
    class="login-container"
    element-loading-text="登录中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="right"
    >
      <div class="title-container">
        <h3 class="title">后台管理系统</h3>
      </div>

      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          auto-complete="on"
          name="username"
          placeholder="username"
          tabindex="1"
          type="text"
        >
        
            <svg-icon slot="prefix" icon-class='user' />
        
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          auto-complete="on"
          name="password"
          placeholder="Password"
          tabindex="2"
          @keyup.enter.native="handleLogin"
        >
          <template #prefix>
            <svg-icon icon-class='password' />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="captchaOnOff" prop="code">
        <el-input
          v-model.trim="loginForm.code"
          :placeholder="'验证码' + previewText"
          tabindex="3"
          type="text"
        >
          <template #prefix>
            <svg-icon icon-class="code" />
          </template>
        </el-input>
        <el-image :src="codeUrl" class="code" @click="getCode" />
      </el-form-item>
      <div>
        <el-button
          style="width: 20%; margin-bottom: 20px"
          type="primary"
          @click="handleLogin"
          >登录</el-button
        >
      </div>
      <div class="tips">
        <span style="margin-right: 20px"
          >如果您还没有账号请先
          <span style="color: #409eff; cursor: pointer" @click="register"
            >注册</span
          ></span
        >
      </div>
    </el-form>
  </div>
</template>

<script>
// 引入去除空格工具
import { isBlank } from "@/utils/validate";
import { getCodeImg, login } from "@/api/system/user/user";
import { mapMutations } from "vuex";
import { setToken } from "@/utils/token";
import { mapGetters } from "vuex";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  computed: {
    ...mapGetters({
      theme: "settings/theme",
      extra: "settings/extra",
      routes: "routes/routes",
      token: "user/token",
      visitedRoutes: "tabs/visitedRoutes",
    }),
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (isBlank(value)) {
        callback(new Error("用户名不能为空！"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码最少为6位字符！"));
      } else {
        callback();
      }
    };
    return {
      // 头像状态
      TxStatus: true,
      loginForm: {
        username: "",
        password: "",
        code: "",
        uuid: "",
      },
      // 登录规则
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      // user: {
      //   Authorization: ''
      // },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      captchaOnOff: true,
      previewText: "",
      codeUrl: "",
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCode();
  },
  methods: {
    ...mapMutations(["changeLogin"]),
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    getCode() {
      getCodeImg().then((res) => {
        this.captchaOnOff =
          res.data.captchaOnOff === undefined ? true : res.data.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.data.code;
          this.loginForm.uuid = res.data.uuid;
        }
      });
    },
    handleRoute() {
      return this.redirect === "/404" || this.redirect === "/403"
        ? "/"
        : this.redirect;
    },
    // 登录业务
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid)
          try {
            this.loading = true;
            await login(this.loginForm).then((res) => {
              if (res.code == "200") {
                console.log(res.data.token);
                setToken(res.data.token);
                this.$router.push({ name: "Home" });
              } else {
                resetRouter(); // 调用router里的resetRouter方法重新匹配路由
                this.$router.replace("/"); // 重定向到首页
              }
            });
            //await this.$router.push(this.handleRoute())
          } finally {
            this.loading = false;
          }
      });
    },
    // 注册业务
    register() {
      this.$router.push({ name: "register" });
    },
  },
};
</script>
 
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background: url(@/assets/login_images/background.jpg);
  background-size: 100% 100%;
  // 头像
  .avatar-box {
    margin: 0 auto;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 1px solid #409eff;
    box-shadow: 0 0 10px #409eff;
    position: relative;
    bottom: 20px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    background: url("@/assets/login_images/login_form.png");
  }

  .tips {
    font-size: 18px;
    text-align: center;
    color: #000;
    margin-bottom: 10px;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 30px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: 500;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
<!-- <style lang="scss" scoped>
.login-container {
  height: 100vh;
  background: url("@/assets/login_images/background.jpg") center center fixed
    no-repeat;
  background-size: cover;
}
.login-form {
  position: relative;
  max-width: 100%;
  padding: 4.5vh;
  margin: calc((100vh - 475px) / 2) 5vw 5vw;
  overflow: hidden;
  background: url("@/assets/login_images/login_form.png");
  background-size: 100% 100%;
  .title {
    font-size: 54px;
    font-weight: 500;
  }
  .title-tips {
    margin-top: 29px;
    font-size: 26px;
    font-weight: 400;
  }
  .login-btn {
    display: inherit;
    width: 220px;
    height: 50px;
    margin-top: 5px;
    border: 0;

    &:hover {
      opacity: 0.9;
    }
    .forget-passwordword {
      width: 100%;
      margin-top: 40px;
      text-align: left;

      .forget-password {
        width: 129px;
        height: 19px;
        font-size: 20px;
        font-weight: 400;
        color: rgba(92, 102, 240, 1);
      }
    }
  }
  .tips {
    margin-bottom: 5px;
    font-size: 5px;
    span {
      &:first-of-type {
        margin-right: 10px;
      }
    }
  }
  .title-container {
    position: relative;
    .title {
      margin: 0 auto 40px auto;
      font-size: 10px;
      font-weight: bold;
      text-align: center;
    }
  }

  i {
    position: absolute;
    top: 8px;
    left: 5px;
    z-index: 10px;
    font-size: 16px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }

  .show-password {
    position: absolute;
    right: 5px;
    left: -35px;
    font-size: 5px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }

  ::v-deep {
    .el-form-item {
      padding-right: 0;
      margin: 20px 0;
      color: #454545;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 2px;

      &__content {
        min-height: 10px;
        line-height: 10px;
      }

      &__error {
        position: absolute;
        top: 100%;
        left: 18px;
        font-size: 10px;
        line-height: 18px;
      }
    }

    .el-input {
      box-sizing: border-box;

      input {
        height: 48px;
        padding-left: 35px;
        font-size: 70px;
        line-height: 58px;
        background: #f6f4fc;
        border: 0;
      }
    }

    .code {
      position: absolute;
      top: 4px;
      right: 4px;
      height: 38px;
      cursor: pointer;
    }
  }
}
</style> -->
