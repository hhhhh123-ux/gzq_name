<template>
  <div v-loading="loading" class="login-container" element-loading-background="rgba(0, 0, 0, 0.6)"
       element-loading-spinner="el-icon-loading" element-loading-text="登录中...">

    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" auto-complete="on" class="login-form"
             label-position="left">
      <!-- 头像区域 -->
      <div v-if="TxStatus" class="avatar-box">
        <img alt="" src="@/assets/login_images/background.jpg">
      </div>

      <div class="title-container">
        <h3 class="title">后台管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input ref="username" v-model="loginForm.username" auto-complete="on" name="username" placeholder="Username"
                  tabindex="1" type="text"/>
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
                  auto-complete="on" name="password" placeholder="Password" tabindex="2"
                  @keyup.enter.native="handleLogin"/>
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>
      <el-form-item v-if="captchaOnOff" prop="code">
        <el-input
            v-model.trim="loginForm.code"
            :placeholder="'验证码' + previewText"
            tabindex="3"
            type="text"
        >
          <template #prefix>
            <vab-icon icon="barcode-box-line"/>
          </template>
        </el-input>
        <el-image :src="codeUrl" class="code" @click="getCode"/>
      </el-form-item>
      <div>
        <el-button style="width:100%;margin-bottom:20px;" type="primary" @click="handleLogin">登录</el-button>
      </div>
      <div class="tips">
        <span style="margin-right:20px;">如果您还没有账号请先 <span style="color:#409EFF;cursor:pointer"
                                                          @click="register">注册</span></span>
      </div>

    </el-form>
  </div>
</template>

<script>
// 引入去除空格工具
import {isBlank} from '@/utils/validate'
import {getCodeImg, login} from '@/api/system/user/user'
import {mapMutations} from 'vuex'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (isBlank(value)) {
        callback(new Error('用户名不能为空！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码最少为6位字符！'))
      } else {
        callback()
      }
    }
    return {
      // 头像状态
      TxStatus: true,
      loginForm: {
        username: '',
        password: '',
        code: "",
        uuid: ""
      },
      // 登录规则
      loginRules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}]
      },
      user: {
        Authorization: ''
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      captchaOnOff: true,
      previewText: '',
      codeUrl: '',
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCode()
  },
  methods: {
    ...mapMutations(['changeLogin']),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    getCode() {
      console.log("code验证码")
      getCodeImg().then((res) => {
        this.captchaOnOff =
            res.data.captchaOnOff === undefined ? true : res.data.captchaOnOff
        if (this.captchaOnOff) {
          this.codeUrl = 'data:image/gif;base64,' + res.data.code
          this.loginForm.uuid = res.data.uuid
        }
      })
    },
    handleRoute() {
      return this.redirect === '/404' || this.redirect === '/403'
          ? '/'
          : this.redirect
    },
    // 登录业务
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
            if (valid)
              try {
                let _this = this;
                this.loading = true
                await login(this.loginForm).then((res) => {
                  console.log(res.data.token)
                  this.user.Authorization = res.data.token;
                  console.log("this.user==" + this.user);
                  _this.changeLogin(this.user);
                  this.$router.push({name: "Home"})
                })
                //await this.$router.push(this.handleRoute())

              } finally {
                this.loading = false
              }
          }
      )
    },
    // 注册业务
    register() {
      console.log('123')
      this.$router.push({name: 'register'})
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background: url(~@/assets/login_images/background.jpg);
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