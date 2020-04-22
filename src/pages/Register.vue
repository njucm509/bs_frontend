<template>
  <div id="register" style="width: 550px;">
    <el-form label-position="left" :rules="rules" ref="registerForm" label-width="100px" style="width: 450px;"
             class="register"
             :model="register_form">
      <h3 align="center" style="padding-bottom: 20px;padding-top: 20px; padding-left: 60px;">注册</h3>
      <el-form-item label="账号" required prop="name">
        <el-input v-model="register_form.name"></el-input>
      </el-form-item>
      <el-form-item label="真实名字" required prop="name">
        <el-input v-model="register_form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="密码" required prop="password">
        <el-input v-model="register_form.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="手机号" required prop="phone">
        <el-input v-model="register_form.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" required prop="email">
        <el-input v-model="register_form.email"></el-input>
      </el-form-item>
      <el-form-item label="角色" required>
        <el-radio-group v-model="register_form.role">
          <el-radio label="1">系统管理员</el-radio>
          <el-radio label="2">监管者</el-radio>
          <el-radio label="3">数据提供者</el-radio>
          <el-radio label="4">数据请求者</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="submit('registerForm')" type="primary" style="width:100%">注册</el-button>
        <router-link to="/login">
          <el-button type="primary" style="width:100%">返回登陆</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "Register",
    data() {
      let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
      const validatePhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('号码不能为空!!'))
        }
        setTimeout(() => {
          if (!phoneReg.test(value)) {
            callback(new Error('格式有误'))
          } else {
            callback()
          }
        }, 1000)
      };
      let emailReg =
        /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      const validateEmail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('邮箱不能为空!'))
        }
        setTimeout(() => {
          if (!emailReg.test(value)) {
            callback(new Error('格式有误'))
          } else {
            callback()
          }
        }, 1000)
      };
      return {
        register_form: {
          name: '',
          nickname: '',
          password: '',
          phone: '',
          email: '',
          role: '1'
        },
        rules: {
          name: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
            {
              min: 3,
              max: 10,
              message: '长度在3到10个字符',
              trigger: 'blur'
            }
          ],
          nickname: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
            {
              min: 3,
              max: 10,
              message: '长度在3到10个字符',
              trigger: 'blur'
            }
          ],
          password: [{
            required: true,
            message: '请输入用户密码',
            trigger: 'blur'
          },
            {
              min: 8,
              max: 20,
              message: '密码不得低于8位',
              trigger: 'blur'
            }
          ],
          phone: [{
            required: true,
            message: '请输入电话号码',
            trigger: 'blur'
          },
            {
              validator: validatePhone,
              trigger: 'change'
            }
          ],
          email: [{
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
            {
              validator: validateEmail,
              trigger: 'change'
            }
          ]
        }
      }
    },
    methods: {
      submit(form) {
        this.$http.post();
      }
    }
  }
</script>

<style scoped>
  #register {
    border-radius: 5px;
    background-clip: padding-box;
    width: 350px;
    margin: 180px auto;
    background-color: #FFFFFF;
    padding: 35px 35px 15px 35px;
    box-shadow: 0px 0px 25px #cac6c6;
  }

  body {
    background-image: url(../assets/login_bg.jpg);
    background-repeat: no-repeat;
  }
</style>
