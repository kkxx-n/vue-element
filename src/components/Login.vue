<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="" srcset="">
      </div>
      <el-form label-width="0px" class="login-form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user-filling" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-lock" type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>>
    </div>
  </div>
</template>

<script>
import { getLoginStatus } from '../api/login.js'

export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度应该在3到10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度应该在6到15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const result = await getLoginStatus(this.loginForm)
        console.log(result)
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        window.sessionStorage.setItem('token', result.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  background-color: #009999;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: relative;

    .avatar-box {
      position: absolute;
      background-color: #fff;
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 4rem;
    box-sizing: border-box;

    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }

}
</style>
