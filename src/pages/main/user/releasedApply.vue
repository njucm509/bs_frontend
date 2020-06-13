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
          <v-btn icon @click="apply(props.item)">
            申请
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

    <v-data-table :headers="check_headers" :items="check_items" :pagination.sync="check_pagination"
                  :total-items="check_totalItems"
                  :loading="check_loading"
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">
          <v-btn @click="getUser(props.item.applyUser)">{{ props.item.applyUser.nickname }}</v-btn>
        </td>
        <td class="text-xs-center">
          <v-btn @click="getUser(props.item.handleUser)">{{ props.item.handleUser.nickname }}</v-btn>
        </td>
        <td class="text-xs-center">
          <v-btn @click="getReleased(props.item.released)" v-if="props.item.status===1">{{
            props.item.released.releasedData }}
          </v-btn>
          <span v-else>{{props.item.released.id}}</span>
        </td>
        <td class="text-xs-center" :class="{weiyz:props.item.status===0,yiyz:props.item.status===1}">{{
          props.item.status === 0 ?'待批准':'已通过' }}
        </td>
      </template>
    </v-data-table>

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

    <v-dialog max-width="1200" v-model="showReleasedData" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>发布数据信息</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height:800px">
          <released-data-item @close="closeWindow" :data="showReleasedDataItem" :headers="released_data_headers"
                              :fields="released_data_fields"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>

  import handleFormItem from './releasedAuth/HandleFormItem';
  import userItem from '../../admin/user/UserItem'
  import ReleasedDataItem from "./released/ReleasedDataItem";

  export default {
    name: "releasedApply",
    components: {
      'handle-form-item': handleFormItem,
      'user-item': userItem,
      'released-data-item': ReleasedDataItem,
    },
    data() {
      return {
        pagination: {},
        showUser: false,
        showUserItem: {},
        showReleasedData: false,
        showReleasedDataItem: [],
        released_data_headers: [],
        released_data_fields: [],
        isEdit: false,
        isDetail: false,
        check_pagination: {},
        showHandleForm: false,
        showHandleFormItem: {},
        search: '',
        check_search: '',
        totalItems: 0,
        check_totalItems: 0,
        user: {},
        loading: false,
        check_loading: false,
        items: [],
        check_items: [],
        check_headers: [{
          text: '编号',
          align: 'center',
          sortable: true,
          value: 'id',
        }, {
          text: '申请人',
          align: 'center',
          sortable: false,
          value: 'applyUserId',
        }, {
          text: '处理人',
          align: 'center',
          sortable: false,
          value: 'handleUserId',
        }, {
          text: '数据发布表',
          align: 'center',
          sortable: false,
          value: 'releasedId',
        }, {
          text: '审核状态',
          align: 'center',
          sortable: false,
          value: 'status',
        },],
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
      getCheckData() {
        this.$http.get('/data/release/apply/page', {
          params: {
            key: this.check_search, // 搜索条件
            page: this.check_pagination.page, // 当前页
            rows: this.check_pagination.rowsPerPage, // 每页大小
            sortBy: this.check_pagination.sortBy, // 排序字段
            desc: this.check_pagination.descending, // 是否降序
            userId: this.user.id,
            applyOrHandle: 0,
          }
        }).then(res => {
          this.check_items = res.data.items;
          this.check_totalItems = res.data.total;
          console.log(res);
        });
      },
      refresh() {
        this.getData();
        this.getCheckData();
      },
      closeWindow() {
        this.showHandleForm = false;
        this.showUser = false;
        this.showReleasedData = false;
      },
      getUser(user) {
        console.log(user);
        this.showUser = true;
        this.isDetail = true;
        this.showUserItem = user;
        this.showUserItem.password = '';
      },
      getReleased(released) {
        this.released_data_fields = released.usedFields;
        this.released_data_headers = [];
        for (let i = 0; i < released.usedFields.length; i++) {
          this.released_data_headers.push({
            text: released.usedFields[i].name,
            align: 'center',
            sortable: false,
            value: released.usedFields[i].sysName,
          });
        }
        this.$http.post('/data/file/released', released).then(res => {
          if (res.status === 200) {
            this.showReleasedDataItem = res.data;
          }
        });
        this.showReleasedData = true;
      },
      detail(id) {
        this.$http.get('/release/handleForm/' + id).then(res => {
          this.showHandleFormItem = res.data;
          this.showHandleForm = true;
        }).catch();
      },
      apply(released) {
        released.applyUserId = [this.user.id]
        console.log(released);
        this.$http.post('/data/release/apply/create', released).then(res => {
          if (res.data === true) {
            this.$message.success('申请成功！');
            this.getCheckData();
          } else {
            this.$message.warning('请勿重复申请！')
          }
        });
      }
    },
    mounted() {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.refresh();
    }
  }
</script>

<style scoped>
  .weiyz {
    color: red;
  }

  .yiyz {
    color: green;
  }
</style>
