<template>
  <v-form v-model="valid" ref="myForm">
    <v-text-field v-model="item.name" label="角色名：" required :rules="nameRules"/>
    <v-text-field v-model="item.slug" label="系统别名：" required :rules="nameRules"/>
    <v-text-field v-model="item.descriptions" label="角色描述："/>
    权限:
    <!--    <v-btn v-if="isEdit" v-for="id in item.permissionId" :key="id">-->
    <!--      {{permissions[id].name}}-->
    <el-select v-if="isEdit" v-model="item.permissionId" multiple placeholder="请选择" style="width: 100%">
      <el-option
        v-for="item in permission"
        :key="item.value"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <!--    </v-btn>-->
    <el-select v-if="!isEdit" v-model="item.permissionId" multiple placeholder="请选择" style="width: 100%"
               :disabled="isEdit">
      <el-option
        v-for="item in permission"
        :key="item.value"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    字段:
    <el-select v-if="isEdit" v-model="item.fieldId" multiple placeholder="请选择" style="width: 100%">
      <el-option
        v-for="item in fields"
        :key="item.value"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <!--    </v-btn>-->
    <el-select v-if="!isEdit" v-model="item.fieldId" multiple placeholder="请选择" style="width: 100%"
               :disabled="isEdit">
      <el-option
        v-for="item in fields"
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
    name: "RoleItem",
    props: {
      oldItem: {
        type: Object
      },
      isEdit: {
        type: Boolean
      },
      permission: {},
      fields: {},
    },
    data() {
      return {
        roles: {},
        valid: false,
        permissions: this.permission,
        item: {
          id: '',
          name: '',
          slug: '',
          descriptions: '',
          permissionId: [],
          fieldId: [],
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
        let url = '/auth/role/create';
        if (this.isEdit) {
          url = '/auth/role/update';
        }
        console.log(this.item);
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
          slug: '',
          descriptions: '',
          permissionId: [],
          fieldId: [],
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
              permissionId: [],
              fieldId: [],
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
