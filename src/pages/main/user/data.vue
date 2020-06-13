<template>
  <div>
    <v-card class="col-xs-10 col-sm-10 col-md-10 col-lg-10">
      <v-card-title>
        <v-btn @click="exportFieldsCSV">导出字段(csv)</v-btn>
        <v-btn @click="exportFieldsEXCEL" disabled>导出字段(excel)</v-btn>
        <v-spacer/>
        <v-flex xs3>
          <v-text-field label="搜索字段" v-model.lazy="search" append-icon="search" hide-details></v-text-field>
        </v-flex>
      </v-card-title>
      <v-data-table :headers="fieldHeader" :items="fieldItems" :pagination.sync="fieldPagination"
                    :total-items="totalFields"
                    :loading="fieldLoading"
                    class="elevation-1">
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.sysName }}</td>
          <td class="text-xs-center">{{ props.item.type }}</td>
          <td class="text-xs-center">{{ props.item.typeId }}</td>
          <td class="text-xs-center">{{ props.item.descriptions|subStr }}</td>
          <td class="text-xs-center" :class="{jz:props.item.status==0,qy:props.item.status==1}">{{ props.item.status ==
            1
            ? '启用':'禁止'}}
          </td>
          <td class="text-xs-center">{{ props.item.userId}}</td>
          <td class="text-xs-center">{{ props.item.createdAt }}</td>
          <td class="text-xs-center">{{ props.item.updatedAt }}</td>
          <td class="justify-center layout px-0">
            <!--            <v-btn icon @click="edit(props.item)">-->
            <!--              <i class="el-icon-edit"/>-->
            <!--            </v-btn>-->
            <v-btn icon @click="delete(props.item)">
              <i class="el-icon-delete"/>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <v-card class="col-xs-10 col-sm-10 col-md-10 col-lg-10">
      <v-card-title>
        <v-flex xs3>
          <!--          <v-text-field label="输入文件名搜索" v-model.lazy="search" append-icon="search" hide-details></v-text-field>-->
        </v-flex>
      </v-card-title>
      <v-data-table :headers="headers" :items="items" :pagination.sync="pagination" :total-items="totalItems"
                    :loading="loading"
                    class="elevation-1">
        <template slot="items" slot-scope="props">
          <td class="text-xs-center" v-for="(field,id) in fields" :key="id">{{ props.item[field.sysName] }}</td>
          <!--          <td class="justify-center layout px-0">-->
          <!--            <v-btn type="primary" @click="down(props.item)">下载</v-btn>-->
          <!--            <v-btn icon @click="remove(props.item)">-->
          <!--              <i class="el-icon-delete"/>-->
          <!--            </v-btn>-->
          <!--          </td>-->
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
  import vUpload from '../../../components/form/Upload'
  import config from "../../../config";

  export default {
    name: "vData",
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
        pagination: {
          rowsPerPage: 10
        },
        fieldPagination: {},
        totalFields: 0,
        fieldLoading: false,
        search: '',
        show: false,
        isEdit: false,
        totalItems: 0,
        loading: false,
        fieldHeader: [{
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
          text: '属性分类',
          align: 'center',
          sortable: true,
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
          text: '属性类别',
          align: 'center',
          sortable: false,
          value: 'typeId',
        }, {
          text: '用户id',
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
        headers: [],
        items: [],
        fieldItems: [],
        oldItem: {},
        fields: {},
      }
    },
    methods: {
      getData() {
        let url = "/data/file/data/" + this.user.id;
        this.$http.get(url).then(res => {
          this.items = res.data;
          // this.totalItems = res.data.length;
          this.loading = false;
        }).catch((err) => {
          console.log(err)
        });
      },
      getField() {
        this.$http.get('/data/field/page', {
          params: {
            key: this.search, // 搜索条件
            page: this.fieldPagination.page, // 当前页
            rows: this.fieldPagination.rowsPerPage, // 每页大小
            sortBy: this.fieldPagination.sortBy, // 排序字段
            desc: this.fieldPagination.descending, // 是否降序
            userId: this.user.id
          }
        }).then(res => {
          this.fieldItems = res.data.items;
          this.totalFields = res.data.total;
          this.fieldLoading = false;
        }).catch(err => {

        })
      },
      exportFieldsCSV() {
        this.$http.get('/data/field/export/csv/' + this.user.id).then(res => {
          let blob = new Blob([res.data]);
          let link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'field.csv';
          link.click();
        });
      },
      exportFieldsEXCEL() {
        this.$http.get('/data/field/export/excel/' + this.user.id).then(res => {
          console.log(res);
          let blob = new Blob([res.data]);
          let link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'field.xls';
          link.click();
        });
      },
      down(file) {
        console.log(file);
      },
      onFileSuccess(rootFile, file, response, chunk) {
        this.$http.post('/data/file/create', {
          name: rootFile[0].file.name,
          userId: this.user.id,
        }).then(res => {
          if (res.data == true) {
            this.fileUploadHeight = Number(this.fileUploadHeight.substring(0, this.fileUploadHeight.length - 2)) + Number(50);
            this.fileUploadHeight += 'px';
            this.getData();
          }
        })
      },
      remove(file) {
        this.$http.post('/data/file/delete', file).then(res => {
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
          // this.getData();
        }
      },
      fieldPagination: { // 监视pagination属性的变化
        deep: true, // deep为true，会监视pagination的属性及属性中的对象属性变化
        handler() {
          // 变化后的回调函数，这里我们再次调用getDataFromServer即可
          this.getField();
        }
      },
      search: { // 监视搜索字段
        handler() {
          this.getField();
        }
      }
    },
    filters:{
      subStr(str) {
        if (str) {
          return str.substring(1, 10);
        } else {
          return '';
        }
      }
    },
    mounted() {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.$http.get('/data/field/all/' + this.user.id).then(res => {
        this.fields = res.data;
        for (let i = 0; i < this.fields.length; i++) {
          this.headers.push({
            text: this.fields[i].name,
            align: 'center',
            sortable: false,
            value: this.fields[i].sysName,
          });
        }
      }).catch();
      this.getData();
      this.getField();
    }
  }
</script>

<style scoped>

</style>
