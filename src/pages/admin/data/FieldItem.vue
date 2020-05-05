<template>
  <v-form v-model="valid" ref="myForm">
    <v-text-field v-model="item.name" label="字段名：" required :rules="nameRules"/>
    <v-text-field v-model="item.sysName" label="系统名：" required :rules="nameRules"/>
    字段类型:
    <el-select v-model="item.type" placeholder="请选择" style="width: 100%">
      <el-option
        v-for="item in this.fieldType"
        :key="item.name"
        :label="item.name"
        :value="item.name">
      </el-option>
    </el-select>
    <v-textarea v-model="item.descriptions" label="字段描述：" required/>
    <v-switch v-model="item.status" :label="item.status == 1?'启用':'禁止'" required/>
    <v-layout class="my-4" row>
      <v-spacer/>
      <v-btn :disabled="!valid" @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear">重置</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
  export default {
    name: "FieldItem",
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
        user: '',
        roles: {},
        fieldType: [
          {name: "字符串"},
          {name: "数字"},
          {name: "文本"},
        ],
        valid: false,
        item: {
          id: '',
          name: '',
          sysName: '',
          type: '',
          descriptions: '',
          status: '1',
          userId: '',
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
          let url = '/data/field/update';
        } else {
          let url = '/data/field/create';
        }
        this.item.id = this.user.id;
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
          sysName: '',
          type: '',
          descriptions: '',
          status: '1',
          userId: '',
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
              sysName: '',
              type: '',
              descriptions: '',
              status: '1',
              userId: '',
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
      this.user = JSON.parse(sessionStorage.getItem('user'));
    }
  }
</script>

<style scoped>

</style>
