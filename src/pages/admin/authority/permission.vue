<template>
  <v-card>
    <v-card-title>
      <v-btn color="primary" @click="add">新增权限</v-btn>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :pagination.sync="pagination" :total-items="totalItems"
                  :loading="loading"
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.descriptions }}</td>
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
          <v-toolbar-title>{{isEdit ? '修改' : '新增'}}权限</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height:400px">
          <permission-item @close="closeWindow" :oldItem="oldItem" :isEdit="isEdit"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import permissionItem from "./PermissionItem";

  export default {
    components: {
      'permission-item': permissionItem,
    },
    data() {
      return {
        roles: {},
        pagination: {
          rowsPerPage: 10
        },
        search: '',
        totalItems: 0,
        show: false,
        isEdit: false,
        loading: false,
        headers: [{
          text: '编号',
          align: 'center',
          sortable: true,
          value: 'id',
        }, {
          text: '权限名',
          align: 'center',
          sortable: true,
          value: 'name',
        }, {
          text: '描述',
          align: 'center',
          sortable: false,
          value: 'descriptions',
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
        let url = "/auth/permission/list";
        this.$http.get(url).then(res => {
          this.items = res.data;
          this.totalItems = res.data.length;
          this.loading = false;
        }).catch((err) => {
          console.log(err)
        });
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
      },
      closeWindow() {
        this.getData();
        this.show = false;
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
      this.roles = JSON.parse(sessionStorage.getItem('roles'));
    }
  }

</script>

<style scoped>
</style>
