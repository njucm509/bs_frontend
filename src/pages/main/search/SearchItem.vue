<template>
  <v-stepper v-model="step">
    <v-stepper-header style="color: black">
      <v-stepper-step :complete="step > 1" step="1">文件同态</v-stepper-step>
      <v-divider/>
      <v-stepper-step step="2">列同态</v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-layout row>
          <v-flex xs6>
            <v-card
              class="px-4"
              color=" lighten-1"
              height="400px"
              style="text-align: left"
            >
              <v-card-title>同态加密</v-card-title>
              <v-upload ref="fileUp" :options="this.options" :auto="this.auto" :attrs="this.attrs"
                        @onFileSuccess="onFileSuccess"></v-upload>
              <v-spacer></v-spacer>
              <el-select v-model="encAlgId" placeholder="请选择">
                <el-option v-for="(enc,index) in encAlgList" :key="index" :label="enc.name" :value="enc.id"
                           :disabled="enc.name != '同态加密'"/>
              </el-select>
              <v-btn @click="enc">加密</v-btn>
            </v-card>

            <!--          <v-data-table :headers="headers" :items="data" :pagination.sync="pagination" :total-items="totalItems"-->
            <!--                        :loading="loading"-->
            <!--                        class="elevation-1">-->
            <!--            <template slot="items" slot-scope="props">-->
            <!--              <td class="text-xs-center" v-for="(field,id) in fields" :key="id">{{ props.item[field.sysName] }}</td>-->
            <!--            </template>-->
            <!--          </v-data-table>-->
          </v-flex>
          <v-flex xs6>
            <v-card>
              <v-card-title>
                <v-btn @click="refresh">查询全部文件</v-btn>
                <v-spacer/>
                <v-flex xs3>
                  <v-text-field label="请输入关键词" v-model="searchByHE"/>
                </v-flex>
                <v-btn @click="encSearch">检索</v-btn>
              </v-card-title>
              <v-data-table :headers="headers" :items="items"
                            :loading="loading" :pagination.sync="pagination" :total-items="totalItems"
                            class="elevation-1">
                <template slot="items" slot-scope="props">
                  <td class="text-xs-center">{{ props.item.id }}</td>
                  <td class="text-xs-center">{{ props.item.name }}</td>
                  <td class="justify-center layout px-0">
                    <v-btn icon @click="deleteFile(props.item)">
                      <i class="el-icon-delete"/>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>

            </v-card>

          </v-flex>
        </v-layout>
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-card>
          <v-card-title>
            <v-spacer/>
          </v-card-title>
          xxx
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>

</template>

<script>
  import vUpload from "../../../components/form/Upload";
  import config from "../../../config";

  export default {
    name: "SearchItem",
    components: {
      'v-upload': vUpload,
    },
    props: {
      step: {
        type: Number,
        default: 1
      },
    },
    data() {
      return {
        options: {
          target: config.uploadFile,
          testChunks: false
        },
        auto: false,
        attrs: {
          // 接受的文件类型，形如['.png', '.jpg', '.jpeg', '.gif', '.bmp'...] 这里我封装了一下
          // accept: ACCEPT_CONFIG.getAll()
        },
        fileList: [],
        filename: '',
        fileId: 0,
        encAlgList: [],
        encAlgId: 6,
        user: {},
        headers: [{
          text: '编号',
          align: 'center',
          sortable: true,
          value: 'id',
        }, {
          text: '文件名',
          align: 'center',
          sortable: true,
          value: 'filename',
        },
        ],
        items: [],
        loading: true,
        searchByHE: '',
        search: '',
        pagination: {},
        totalItems: 0,
      }
    },
    methods: {
      onFileSuccess(rootFile, file, response, chunk) {
        this.filename = rootFile[0].file.name;

        this.$http.post('/data/file/create', {
          name: rootFile[0].file.name,
          userId: this.user.id,
          encAlgId: this.encAlgId
        }).then(res => {
          console.log(res);
          if (res.status === 200) {
            this.fileId = res.data;
            // this.fileUploadHeight = Number(this.fileUploadHeight.substring(0, this.fileUploadHeight.length - 2)) + Number(50);
            // this.fileUploadHeight += 'px';
            this.refresh();
          }
        })
      },
      refresh() {
        this.$http.get('/data/file/page', {
          params: {
            key: this.search, // 搜索条件
            page: this.pagination.page, // 当前页
            rows: this.pagination.rowsPerPage, // 每页大小
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending, // 是否降序
            userId: this.user.id,
            enc: 1,
          }
        }).then(res => {
          this.totalItems = res.data.total;
          this.items = res.data.items;
          console.log(res);
        })
      },
      enc() {
        this.$http.get('/encrypt/he?id=' + this.user.id + '&fileId=' + this.fileId + '&filename=' + this.filename).then(res => {
          console.log(res);
          if (res.data === true) {
            this.$message.success('加密成功!')
          }
        });
      },
      encSearch() {
        this.refresh();
        console.log(this.searchByHE);
        this.$http.get('/encrypt/search?key=' + this.searchByHE).then(res => {
          this.items.filter((item) => {
            return res.data.indexOf(item.name) > 0;
          })
          console.log(res.data);
        });
      },
      deleteFile(item) {
        console.log(item)
      },
      getEncAlg() {
        this.$http.get('/encrypt/alg/list').then(res => {
          this.encAlgList = res.data;
          console.log(res);
        })
      }
    },
    mounted() {
      this.getEncAlg();
      this.user = JSON.parse(sessionStorage.getItem('user'));
    }
  }
</script>

<style scoped>

</style>
