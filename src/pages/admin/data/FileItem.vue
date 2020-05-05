<template>
  <v-form v-model="valid" ref="myForm">
    <v-text-field v-model="item.name" label="账号：" required :rules="accountRules"/>
    <v-text-field v-model="item.nickname" label="真实姓名：" required :rules="nameRules"/>
    <v-text-field v-model="item.password" label="密码：" required :rules="pwdRules"/>
    <v-text-field v-model="item.phone" label="手机号：" required/>
    <v-text-field v-model="item.email" label="邮箱：" required/>
    角色:
    <!--    <v-btn v-if="isEdit" v-for="roleId in item.roleId" :key="roleId">-->
    <!--      {{roles[roleId].name}}-->
    <el-select v-if="isEdit" v-model="item.roleId" multiple placeholder="请选择" style="width: 100%">
      <el-option
        v-for="item in roles"
        :key="item.value"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <!--    </v-btn>-->
    <el-select v-if="!isEdit" v-model="item.roleId" multiple placeholder="请选择" style="width: 100%" :disabled="isEdit">
      <el-option
        v-for="item in roles"
        :key="item.value"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <v-layout class="my-4" row>
      <v-spacer/>
      <v-btn :disabled="!valid" @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear">重置</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
  export default {
    name: "FileItem",
    props: {
      oldItem: {
        type: Object
      },
      isEdit: {
        type: Boolean
      }
    },
    data() {
      return {
        roles: {},
        valid: false,
        item: {
          id: '',
          name: '',
          nickname: '',
          password: '',
          phone: '',
          email: '',
          roleId: [],
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
        if (this.isEdit) {
          let url = '/user/update';
        } else {
          let url = '/user/create';
        }
        this.$http.post(url, this.item).then(res => {
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
          nickname: '',
          password: '',
          phone: '',
          email: '',
          roleId: [],
          createdAt: '',
          updatedAt: '',
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
              nickname: '',
              password: '',
              phone: '',
              email: '',
              roleId: [],
              createdAt: '',
              updatedAt: '',
            }
          }
        },
        deep: true
      }
    },
    mounted() {
      this.roles = JSON.parse(sessionStorage.getItem('roles'));
    }
  }
</script>

<style scoped>

</style>
