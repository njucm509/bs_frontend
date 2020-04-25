<template>
  <div>
    <v-card class="col-xs-10 col-sm-10 col-md-10 col-lg-10">
      <v-card-title><h2>个人信息</h2></v-card-title>
      <v-form v-model="valid" ref="myForm">
        <v-text-field v-model="item.name" label="账号：" disabled/>
        <v-text-field v-model="item.nickname" label="真实姓名：" required/>
        <v-text-field v-model="item.email" label="邮箱：" required/>
        <v-text-field v-model="item.phone" label="电话：" required/>
        <div>
          角色:
          <v-btn v-for="roleId in item.roleId" :key="roleId">
            {{roles[roleId].name}}
          </v-btn>
        </div>
        <v-text-field v-model="item.createdAt" label="创建时间：" disabled/>
        <v-text-field v-model="item.updatedAt" label="上次更新时间：" disabled/>
        <v-layout class="my-4" row>
          <v-spacer/>
          <v-btn @click="submit">修改</v-btn>
          <v-btn @click="clear">重置</v-btn>
        </v-layout>
      </v-form>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: "info",
    data() {
      return {
        valid: false,
        item: {},
        roles: {},
        nameRules: [
          // v => !!v || "名称不能为空",
        ],
        pwdRules: [
          // v => !!v || "密码不能为空",
          // v => v.length > 4 || "密码至少5位"
        ]
      };
    },
    methods: {
      submit() {
        console.log(this.item);
        this.$confirm('是否修改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/user/update', this.item).then(res => {
            sessionStorage.setItem('user', JSON.stringify(this.item));
            this.item = JSON.parse(sessionStorage.getItem('user'));
          })
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
        }).catch(() => {
        });
      },
      clear() {
        this.item.nickname = '';
        this.item.email = '';
        this.item.phone = '';
      }
    },
    mounted() {
      this.item = JSON.parse(sessionStorage.getItem('user'));
      this.roles = JSON.parse(sessionStorage.getItem('roles'));
    }
  }
</script>

<style scoped>
  /*h2 {*/
  /*  position: relative;*/
  /*  top: -20px;*/
  /*  left: -20px;*/
  /*}*/
</style>
