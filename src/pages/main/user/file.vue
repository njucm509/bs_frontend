<template>
  <div>
    <v-card
      class="col-xs-10 col-sm-10 col-md-10 col-lg-10"
      color=" lighten-1"
      :height="fileUploadHeight"
    >
      <v-upload ref="fileUp" :options="options" :auto="auto" :attrs="attrs" @onFileSuccess="onFileSuccess"></v-upload>
      <v-spacer></v-spacer>
    </v-card>
    <v-card class="col-xs-10 col-sm-10 col-md-10 col-lg-10">
      <v-card-title>
        <v-flex xs3>
          <v-text-field label="输入文件名搜索" v-model.lazy="search" append-icon="search" hide-details></v-text-field>
        </v-flex>
      </v-card-title>
      <v-data-table :headers="headers" :items="items" :pagination.sync="pagination" :total-items="totalItems"
                    :loading="loading"
                    class="elevation-1">
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.createdAt }}</td>
          <td class="text-xs-center">{{ props.item.updatedAt }}</td>
          <td class="justify-center layout px-0">
            <v-btn type="primary" @click="down(props.item)">下载</v-btn>
            <v-btn icon @click="remove(props.item)">
              <i class="el-icon-delete"/>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
  import vUpload from '../../../components/form/Upload'
  import config from "../../../config";

  export default {
    name: "vFile",
    components: {
      'v-upload': vUpload,
    },
    data() {
      return {
        user: {},
        fileUploadHeight: '140px',
        options: {
          target: config.uploadFile,
          testChunks: false
        },
        auto: false,
        attrs: {
          // 接受的文件类型，形如['.png', '.jpg', '.jpeg', '.gif', '.bmp'...] 这里我封装了一下
          // accept: ACCEPT_CONFIG.getAll()
        },
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
            desc: this.pagination.descending, // 是否降序
            userId: this.user.id
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
      down(file) {
        console.log(file);
      },
      onFileSuccess(rootFile, file, response, chunk) {
        this.$http.post('/data/file/create', {
          name: rootFile[0].file.name,
          userId: this.user.id,
        }).then(res => {
          console.log(res);
          if (res.status === 200) {
            this.fileUploadHeight = Number(this.fileUploadHeight.substring(0, this.fileUploadHeight.length - 2)) + Number(50);
            this.fileUploadHeight += 'px';
            this.getData();
          }
        })
      },
      remove(file) {
        console.log(file);
        this.$http.post('/data/file/delete', file).then(res => {
          console.log(res);
          if (res.data == true) {
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
      this.user = JSON.parse(sessionStorage.getItem('user'));
    }
  }
</script>

<style scoped>

</style>
