<template>
  <v-card>
    <v-card-title>
      <v-btn color="primary" @click="add">新增角色</v-btn>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :pagination.sync="pagination" :total-items="totalItems"
                  :loading="loading"
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.descriptions }}</td>
        <td class="text-xs-center">{{ props.item.parentId == 0 ? '根权限': roles[props.item.parentId].name}}</td>
        <td class="text-xs-center">
          <v-btn @click="permissionDetail(props.item.permissionId)">权限详情</v-btn>
        </td>
        <td class="text-xs-center">
          <v-btn @click="fieldDetail(props.item.fieldId)">字段详情</v-btn>
        </td>
        <td class="text-xs-center">{{ props.item.createdAt }}</td>
        <td class="text-xs-center">{{ props.item.updatedAt }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="edit(props.item)">
            <i class="el-icon-edit"/>
          </v-btn>
          <v-btn icon @click="delete(props.item)" style="color: red">
            <i class="el-icon-delete"/>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-dialog max-width="500" v-model="show" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>{{isEdit ? '修改' : '新增'}}角色</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height:800px">
          <role-item @close="closeWindow" :oldItem="oldItem" :isEdit="isEdit" :permission="permission"
                     :fields="fields"/>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog max-width="500" v-model="showFieldDetail" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>字段详情</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height:400px">
          <v-btn v-for="id in showFieldDetailItem" :key="id">
            {{fields[id].name}}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog max-width="300" v-model="showPermissionDetail" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>权限详情</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height:400px">
          <v-btn v-for="id in showPermissionDetailItem" :key="id" style="display: inline-block">
            {{permission[id].name}}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import roleItem from "./RoleItem";

  export default {
    components: {
      'role-item': roleItem,
    },
    data() {
      return {
        roles: {},
        permission: {},
        fields: {},
        pagination: {
          rowsPerPage: 10
        },
        search: '',
        totalItems: 0,
        showFieldDetail: false,
        showFieldDetailItem: [],
        showPermissionDetail: false,
        showPermissionDetailItem: [],
        show: false,
        isEdit: false,
        loading: false,
        headers: [{
          text: '编号',
          align: 'center',
          sortable: true,
          value: 'id',
        }, {
          text: '角色名',
          align: 'center',
          sortable: true,
          value: 'name',
        }, {
          text: '描述',
          align: 'center',
          sortable: false,
          value: 'descriptions',
        }, {
          text: '父权限',
          align: 'center',
          sortable: false,
          value: 'parentId',
        }, {
          text: '权限',
          align: 'center',
          sortable: false,
          value: 'permissionId',
        }, {
          text: '字段',
          align: 'center',
          sortable: false,
          value: 'fieldId',
        }, {
          text: '创建时间',
          align: 'center',
          sortable: true,
          value: 'createdAt',
        }, {
          text: '更新时间',
          align: 'center',
          sortable: true,
          value: 'updatedAt',
        }, {
          text: '操作',
          align: 'center',
          sortable: false,
        },
        ],
        items: [],
        oldItem: {},
      }
    },
    methods: {
      getData() {
        this.$http.get('/auth/role/page', {
          params: {
            key: this.search, // 搜索条件
            page: this.pagination.page, // 当前页
            rows: this.pagination.rowsPerPage, // 每页大小
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending // 是否降序
          }
        }).then(res => {
          this.items = res.data.items;
          console.log(this.items);
          this.totalItems = res.data.total;
          this.loading = false;
        })
      },
      add() {
        this.show = true;
        this.isEdit = false;
        this.oldItem = null;
      },
      edit(oldItem) {
        this.isEdit = true;
        this.oldItem = oldItem;
        this.show = true;
      },
      delete(oldItem) {
        this.$http.post('/auth/role/delete/' + oldItem.id).then(res => {
          console.log(res);
        })
      },
      closeWindow() {
        this.getData();
        this.show = false;
        this.showFieldDetail = false;
        this.showPermissionDetail = false;
      },
      fieldDetail(fieldId) {
        this.showFieldDetailItem = fieldId;
        this.showFieldDetail = true;
      },
      permissionDetail(permissionId) {
        this.showPermissionDetailItem = permissionId;
        this.showPermissionDetail = true;
      }
    },
    watch: {
      pagination: { // 监视pagination属性的变化
        deep: true, // deep为true，会监视pagination的属性及属性中的对象属性变化
        handler() {
          // 变化后的回调函数，这里我们再次调用getDataFromServer即可
          this.getData();
        }
      },
      search: { // 监视搜索字段
        handler() {
          this.getData();
        }
      }
    },
    mounted() {
      this.getData();
      let url = "/auth/permission/list";
      this.$http.get(url).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.permission[i + 1] = res.data[i];
        }
        this.loading = false;
      }).catch((err) => {
        console.log(err)
      });
      url = "/data/field/list";
      this.$http.get(url).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.fields[i + 1] = res.data[i];
        }
      }).catch();
      this.roles = JSON.parse(sessionStorage.getItem('roles'));
    }
  }

</script>

<style scoped>
</style>
