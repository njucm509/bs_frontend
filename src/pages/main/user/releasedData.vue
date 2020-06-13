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
        <td class="text-xs-center">
          <v-btn @click="getUser(props.item.applyUser)">{{ props.item.applyUser.nickname }}</v-btn>
        </td>
        <td class="text-xs-center">
          <v-btn @click="getUser(props.item.handleUser)">{{ props.item.handleUser.nickname }}</v-btn>
        </td>
        <td class="text-xs-center">
          <v-btn @click="getReleased(props.item.released)">{{ props.item.released.releasedData }}</v-btn>
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

  import userItem from '../../admin/user/UserItem'
  import ReleasedDataItem from "./released/ReleasedDataItem";

  export default {
    name: "releasedData",
    components: {
      'user-item': userItem,
      'released-data-item': ReleasedDataItem,
    },
    data() {
      return {
        showReleasedData: false,
        showReleasedDataItem: [],
        released_data_headers: [],
        released_data_fields: [],
        pagination: {},
        showUser: false,
        showUserItem: {},
        isEdit: false,
        isDetail: false,
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
          text: '申请者',
          align: 'center',
          sortable: false,
          value: 'applyUserId',
        }, {
          text: '授权者',
          align: 'center',
          sortable: false,
          value: 'handleUserId',
        }, {
          text: '数据发布表',
          align: 'center',
          sortable: false,
          value: 'releasedId',
        },]
      };
    },
    methods: {
      getData() {
        this.$http.get('/data/release/apply/page', {
          params: {
            key: this.search, // 搜索条件
            page: this.pagination.page, // 当前页
            rows: this.pagination.rowsPerPage, // 每页大小
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending, // 是否降序
            userId: this.user.id,
            applyOrHandle: 0,
            status: 1,
          }
        }).then(res => {
          this.items = res.data.items;
          this.totalItems = res.data.total;
          console.log(res);
        });
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
            console.log(res);
            this.showReleasedDataItem = res.data;
          }
        });
        this.showReleasedData = true;
      },
      refresh() {
        this.getData();
      },
      closeWindow() {
        this.showUser = false;
        this.showReleasedData = false;
      },
      detail(id) {
        this.$http.get('/release/handleForm/' + id).then(res => {
          this.showHandleFormItem = res.data;
          console.log(this.showHandleFormItem);
          this.showHandleForm = true;
        }).catch();
      },
    },
    mounted() {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.getData();
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
