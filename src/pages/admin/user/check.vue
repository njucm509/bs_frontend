<template>
  <v-card>
    <v-card-title>
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
        <td class="text-xs-center">{{ props.item.nickname }}</td>
        <td class="text-xs-center">{{ props.item.phone}}</td>
        <td class="text-xs-center">{{ props.item.email}}</td>
        <td class="text-xs-center">{{ props.item.ip}}</td>
        <td class="text-xs-center">{{ props.item.role}}</td>
        <td class="text-xs-center">{{ props.item.createdAt }}</td>
        <td class="text-xs-center">{{ props.item.updatedAt }}</td>
        <td class="text-xs-center">{{ props.item.flag == 0 ? '否':'是' }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="check(props.item)">
            通过
          </v-btn>
          <v-btn icon @click="delete(props.item)">
            <i class="el-icon-delete"/>
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  export default {
    name: 'check',
    data() {
      return {
        pagination: {},
        search: '',
        totalItems: 0,
        loading: false,
        headers: [{
          text: '编号',
          align: 'center',
          sortable: true,
          value: 'id',
        }, {
          text: '账号',
          align: 'center',
          sortable: true,
          value: 'name',
        }, {
          text: '真实姓名',
          align: 'center',
          sortable: true,
          value: 'nickname',
        }, {
          text: '手机号',
          align: 'center',
          sortable: false,
          value: 'phone',
        }, {
          text: '邮箱',
          align: 'center',
          sortable: false,
          value: 'email',
        }, {
          text: '角色',
          align: 'center',
          sortable: true,
          value: 'role',
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
          text: '是否验证',
          align: 'center',
          sortable: true,
          value: 'flag',
        },
        ],
        items: [],
        oldItem: {},
      }
    },
    methods: {
      getData() {
        let url = "/user/page";
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
      delete(oldItem) {
      },
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
    }
  }

</script>

<style>
</style>
