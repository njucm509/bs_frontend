<template>
  <v-form v-model="valid" ref="myForm">
    <v-text-field v-model="item.name" label="权限名：" required :rules="nameRules"/>
    <v-text-field v-model="item.slug" label="系统别名：" required :rules="nameRules"/>
    <v-text-field v-model="item.descriptions" label="权限描述："/>
    <v-layout class="my-4" row>
      <v-spacer/>
      <v-btn :disabled="!valid" @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear">重置</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
  export default {
    name: "PermissionItem",
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
          slug: '',
          descriptions: '',
          createdAt: '',
          updatedAt: '',
        },
        nameRules: [
          v => !!v || "名称不能为空",
        ],
      };
    },
    methods: {
      submit() {
        if (this.isEdit) {
          let url = '/auth/permission/update';
        } else {
          let url = '/auth/permission/create';
        }
        this.$http.post('/auth/permission/create', this.item).then(res => {
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
          slug: '',
          descriptions: '',
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
              slug: '',
              descriptions: '',
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
