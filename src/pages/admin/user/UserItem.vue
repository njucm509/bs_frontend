<template>
  <v-form v-model="valid" ref="myForm">
    <v-text-field v-model="item.name" label="账号：" required :rules="accountRules"/>
    <v-text-field v-model="item.nickname" label="真实姓名：" required :rules="nameRules"/>
    <v-text-field v-model="item.password" label="密码：" required :rules="pwdRules"/>
    <v-text-field v-model="item.phone" label="手机号：" required/>
    <v-text-field v-model="item.email" label="邮箱：" required/>
    <v-switch v-model="item.role" :label="item.role==1?'管理员':'普通用户'" disabled/>
    <v-layout class="my-4" row>
      <v-spacer/>
      <v-btn :disabled="!valid" @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear">重置</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
  export default {
    name: "UserItem",
    props: {
      oldItem: {
        type: Object
      },
    },
    data() {
      return {
        valid: false,
        item: {
          id: '',
          name: '',
          nickname: '',
          password: '',
          phone: '',
          email: '',
          role: '',
          createdAt: '',
          updatedAt: '',
        },
        nameRules: [
          v => !!v || "名称不能为空",
        ],
        accountRules: [
          v => !!v || "账号不能为空",
          v => v.length > 4 || "账号至少5位"
        ],
        pwdRules: [
          v => !!v || "密码不能为空",
          v => v.length > 4 || "密码至少5位"
        ]
      };
    },
    methods: {
      submit() {
        this.$http.post('/user/create', this.item).then(res => {
          console.log(res)
          this.$message.success('提交成功!');
          this.$emit('close');
          this.clear();
        });
      },
      clear() {
        this.item = {
          id: '',
          name: '',
          account: '',
          pwd: '',
          role: '',
          createAt: '',
          updateAt: '',
        }
      }
    },
    watch: {
      oldItem: { // 监控item的变化
        handler(val) {
          if (val) {
            // 注意不要直接复制，否则这边的修改会影响到父组件的数据，copy属性即可
            this.item = JSON.parse(JSON.stringify(val));
          } else {
            // 为空，初始化brand
            this.item = {
              id: '',
              name: '',
              account: '',
              password: '',
              role: '',
              createAt: '',
              updateAt: '',
            }
          }
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

</style>
