<template>
  <v-form v-model="valid" ref="myForm">
    <v-text-field v-model="item.name" label="角色名：" required :rules="nameRules"/>
    <v-text-field v-model="item.slug" label="系统别名：" required :rules="nameRules"/>
    <v-text-field v-model="item.descriptions" label="角色描述："/>
    <v-switch v-model="isRoot" label="是否根角色"/>
    <div v-if="isRoot === false">选择父角色:</div>
    <el-select v-if="isRoot === false" v-model="item.parentId" style="width: 100%">
      <el-option
        v-for="item in rootRoles"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <br>
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
      root: {
        type: Boolean
      },
      permission: {},
      fields: {},
    },
    data() {
      return {
        roles: {},
        isRoot: true,
        rootRoles: [],
        valid: false,
        permissions: this.permission,
        item: {
          id: '',
          name: '',
          slug: '',
          parentId: 1,
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
          parentId: 1,
          descriptions: '',
          permissionId: [],
          fieldId: [],
          createdAt: '',
          updatedAt: '',
        }
      },
      getRootRole() {
        this.$http.get('/auth/role/root/list').then(res => {
          this.rootRoles = res.data;
        })
      }
    },
    watch: {
      oldItem: { // 监控item的变化
        handler(val) {
          if (val.parentId != 0) {
            this.isRoot = false;
          }
          if (val) {
            // 注意不要直接复制，否则这边的修改会影响到父组件的数据，copy属性即可
            this.item = JSON.parse(JSON.stringify(val));
          } else {
            // 为空，初始化brand
            this.item = {
              id: '',
              name: '',
              slug: '',
              parentId: 1,
              descriptions: '',
              permissionId: [],
              fieldId: [],
              createdAt: '',
              updatedAt: '',
            };
          }
        },
        deep: true
      },
      isRoot: {
        handler(isRoot) {
          if (!isRoot) {
            this.getRootRole();
          }
        }
      }
    },
    mounted() {
      this.roles = JSON.parse(sessionStorage.getItem('roles'));
    }
  }
</script>

<style scoped>

</style>
