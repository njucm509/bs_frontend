<template>
  <div id="login">
    <el-form :model="login" :rules="login_rule" ref="login" class="login" style="width: 300px;">
      <h3 align="center" style="padding-bottom: 20px;padding-top: 20px;">登陆</h3>
      <el-form-item prop="username">
        <el-input v-model="login.name" placeholder="请输入账号..." style=""></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="login.password" placeholder="请输入密码..." show-password></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button @click="submit('login')" type="primary" style="width:100%">登陆</el-button>
        <router-link to="/register">
          <a type="primary">注册</a>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        login: {
          name: 'admin',
          password: '12345678'
        },
        login_rule: {
          name: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      submit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.$http.post('/user/login', this.login).then((res) => {
              console.log(res.data);
              let data = res.data;
              if (data.code == 1) {
                this.$message({
                  message: '登陆成功',
                  type: 'success'
                });
                let user = data.user;
                this.$http.get('/user/role/' + user.id).then((res) => {
                  user.roleId = res.data;
                  sessionStorage.setItem('user', JSON.stringify(user));
                  this.$router.push({
                    path: '/'
                  })
                });
                this.$http.get('/auth/role/list').then((res) => {
                  let roles = {};
                  for (let i = 0; i < res.data.length; i++) {
                    roles[i + 1] = res.data[i];
                  }
                  sessionStorage.setItem('roles', JSON.stringify(roles));
                });
              } else {
                this.$message({
                  message: data.msg,
                  type: 'error'
                });
              }
            });
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login {
    border-radius: 5px;
    background-clip: padding-box;
    width: 350px;
    margin: 180px auto;
    background-color: #FFFFFF;
    padding: 35px 35px 15px 35px;
    box-shadow: 0px 0px 25px #cac6c6;
  }
</style>
