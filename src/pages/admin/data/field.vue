<template>
  <v-card>
    <v-card-title>
      <v-btn color="primary" @click="add">新增字段</v-btn>
      <v-btn @click="init">数据库初始化</v-btn>
      <v-btn @click="dropAll">删除初始化数据库</v-btn>
      <v-spacer/>
      <v-flex xs3>
        <v-text-field label="输入关键字搜索" v-model.lazy="search" append-icon="search" hide-details></v-text-field>
      </v-flex>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :pagination.sync="pagination" :total-items="totalItems"
                  :loading="loading"
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.sysName }}</td>
        <td class="text-xs-center">{{ props.item.type }}</td>
        <td class="text-xs-center">{{ props.item.typeId }}</td>
        <td class="text-xs-center">{{ props.item.descriptions }}</td>
        <td class="text-xs-center" :class="{jz:props.item.status==0,qy:props.item.status==1}">{{ props.item.status == 1
          ? '启用':'禁止'}}
        </td>
        <td class="text-xs-center">
          <v-btn @click="detail(props.item.userId)">{{ props.item.userId}}</v-btn>
        </td>
        <td class="text-xs-center">{{ props.item.createdAt }}</td>
        <td class="text-xs-center">{{ props.item.updatedAt }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="edit(props.item)">
            <i class="el-icon-edit"/>
          </v-btn>
          <v-btn icon @click="delete(props.item)">
            <i class="el-icon-delete"/>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-dialog max-width="500" v-model="show" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>{{isEdit ? '修改' : '新增'}}字段</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height:400px">
          <field-item @close="closeWindow" :oldItem="oldItem" :isEdit="isEdit" :type="type"/>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog max-width="500" v-model="showUser" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>用户详情</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height:400px">
          <user-item @close="closeWindow" :oldItem="showUserItem" :isEdit="!isDetail" :isDetail="isDetail"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import FieldItem from "./FieldItem";
  import UserItem from "../user/UserItem";

  export default {
    name: 'field',
    components: {
      'field-item': FieldItem,
      'user-item': UserItem
    },
    data() {
      return {
        roles: {},
        pagination: {},
        search: '',
        show: false,
        showUser: false,
        showUserItem: {},
        isEdit: false,
        isDetail: false,
        totalItems: 0,
        loading: false,
        type: [],
        headers: [{
          text: '编号',
          align: 'center',
          sortable: true,
          value: 'id',
        }, {
          text: '字段名',
          align: 'center',
          sortable: true,
          value: 'name',
        }, {
          text: '系统名',
          align: 'center',
          sortable: true,
          value: 'sysName',
        }, {
          text: '类型',
          align: 'center',
          sortable: true,
          value: 'type',
        }, {
          text: '属性类别',
          align: 'center',
          sortable: false,
          value: 'typeId',
        }, {
          text: '描述信息',
          align: 'center',
          sortable: true,
          value: 'descriptions',
        }, {
          text: '状态',
          align: 'center',
          sortable: false,
          value: 'status',
        }, {
          text: '所属用户id',
          align: 'center',
          sortable: false,
          value: 'userId',
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
        let url = "/data/field/page";
        this.$http.get(url, {
          params: {
            key: this.search, // 搜索条件
            page: this.pagination.page, // 当前页
            rows: this.pagination.rowsPerPage, // 每页大小
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending // 是否降序
          }
        }).then(res => {
          this.items = res.data.items;
          this.totalItems = res.data.total;
          this.loading = false;
        }).catch((err) => {
          console.log(err)
        });
        this.$http.get('/data/field/type').then(res => {
          this.type = res.data;
        }).catch();
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
      detail(id) {
        this.showUser = true;
        this.isDetail = true;
        this.$http.get('/user/detail/' + id).then(res => {
          if (res.status != 200) {
            alert('该用户不存在!');
          }
          this.showUserItem = res.data;
          this.showUserItem.password = '';
        }).catch();
      },
      delete(oldItem) {
      },
      dropAll() {
        this.$http.get('/data/field/drop').then(res => {
          if (res.status === 200) {
            this.$message.success('删除成功');
          }
        });
      },
      closeWindow() {
        this.getData();
        this.show = false;
        this.showUser = false;
      },
      init() {
        this.$http.get('/data/field/init').then(res => {
          if (res.status === 200) {
            this.$message.success('数据库初始化成功');
          }
        }).catch(err => {
        })
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
  .qy {
    color: green;
  }

  .jz {
    color: red;
  }
</style>
