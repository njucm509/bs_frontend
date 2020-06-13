<template>
  <v-card>
    <v-card-title>
      <v-btn @click="refresh">刷新</v-btn>
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
        <td class="text-xs-center">{{ props.item.originData }}</td>
        <td class="text-xs-center">{{ props.item.releasedData }}</td>
        <td class="text-xs-center">
          <v-btn @click="detail(props.item.handleFormId)">{{ props.item.handleFormId}}</v-btn>
        </td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="">
            <i class="el-icon-delete"/>
          </v-btn>
          <v-btn icon @click="authorize(props.item)">
            授权
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <v-dialog max-width="500" v-model="showHandleForm" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>表单信息</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height:400px">
          <handle-form-item @close="closeWindow" :item="showHandleFormItem"/>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog max-width="800" v-model="showAuthorize" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>授权表单</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height:700px">
          <authorize-item @close="closeWindow" :item="showAuthorizeItem"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>

  import handleFormItem from './releasedAuth/HandleFormItem';
  import authorizeItem from './releasedAuth/AuthorizeItem';

  export default {
    name: "releasedAuth",
    components: {
      'handle-form-item': handleFormItem,
      'authorize-item': authorizeItem,
    },
    data() {
      return {
        pagination: {},
        showHandleForm: false,
        showHandleFormItem: {},
        showAuthorize: false,
        showAuthorizeItem: {},
        search: '',
        totalItems: 0,
        loading: false,
        items: [],
        headers: [{
          text: '编号',
          align: 'center',
          sortable: true,
          value: 'id',
        }, {
          text: '原始上传数据',
          align: 'center',
          sortable: false,
          value: 'originData',
        }, {
          text: '发布数据',
          align: 'center',
          sortable: false,
          value: 'releasedData',
        }, {
          text: '处理表单信息',
          align: 'center',
          sortable: false,
          value: 'handleFormId',
        }, {
          text: '操作',
          align: 'center',
        }]
      };
    },
    methods: {
      getData() {
        this.$http.get('/data/released/page', {
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
          console.log(res);
        });
      },
      refresh() {
        this.getData();
      },
      closeWindow() {
        this.showHandleForm = false;
        this.showAuthorize = false;
      },
      detail(id) {
        this.$http.get('/release/handleForm/' + id).then(res => {
          this.showHandleFormItem = res.data;
          console.log(this.showHandleFormItem);
          this.showHandleForm = true;
        }).catch();
      },
      authorize(released) {
        console.log(released);
        this.showAuthorize = true;
        released.usedFields.forEach(item => item.auth = '1');
        this.showAuthorizeItem = released;
      }
    },
    mounted() {
      this.getData();
    }
  }
</script>

<style scoped>

</style>
