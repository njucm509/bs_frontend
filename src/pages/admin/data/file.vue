<template>
  <v-card>
    <v-card-title>
      <v-btn color="primary" @click="add">上传文件</v-btn>
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
        <td class="text-xs-center">{{ props.item.userId }}</td>
        <td class="text-xs-center">{{ props.item.createdAt }}</td>
        <td class="text-xs-center">{{ props.item.updatedAt }}</td>
        <td class="justify-center layout px-0">
<!--          <v-btn icon @click="edit(props.item)">-->
<!--            <i class="el-icon-edit"/>-->
<!--          </v-btn>-->
<!--          <v-btn icon @click="down(props.item)">-->
<!--            <i class="el-icon-edit"/>-->
<!--          </v-btn>-->
          <v-btn icon @click="remove(props.item)">
            <i class="el-icon-delete"/>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-dialog max-width="500" v-model="show" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>{{isEdit ? '修改' : '新增'}}用户</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height:400px">
          <file-item @close="closeWindow" :oldItem="oldItem" :isEdit="isEdit"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import FieldItem from "./FieldItem";

  export default {
    name: 'file',
    components: {
      'file-item': FieldItem
    },
    data() {
      return {
        roles: {},
        pagination: {},
        search: '',
        show: false,
        isEdit: false,
        totalItems: 0,
        loading: false,
        headers: [{
          text: '编号',
          align: 'center',
          sortable: true,
          value: 'id',
        }, {
          text: '文件名',
          align: 'center',
          sortable: true,
          value: 'name',
        }, {
          text: '用户id',
          align: 'center',
          sortable: true,
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
        let url = "/data/file/page";
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
      },
      add() {
        this.show = true;
        this.isEdit = false;
        this.oldItem = null;
      },
      down() {
        this.$http.get('').then(res => {
          console.log(res);
          let blob = new Blob([res.data]);
          let link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'user.csv';
          link.click();
        });
      },
      edit(oldItem) {
        this.isEdit = true;
        this.oldItem = oldItem;
        this.show = true;
      },
      remove(file) {
        console.log(file);
        this.$http.post('/data/file/delete', file).then(res => {
          console.log(res);
          if (res.data === true) {
            this.getData();
          }
        });
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

<style>
</style>
