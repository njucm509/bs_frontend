<template>
  <v-stepper v-model="step">
    <v-stepper-header style="color: black">
      <v-stepper-step :complete="step > 1" step="1">选择数据</v-stepper-step>
      <v-divider/>
      <v-stepper-step :complete="step > 2" step="2">处理方式</v-stepper-step>
      <v-divider/>
      <v-stepper-step :complete="step > 3" step="3">确认处理</v-stepper-step>
      <v-divider/>
      <v-stepper-step step="4">处理结果</v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card class="xs10 mx-auto">
          <v-card-title>
            <el-select v-model="cur" multiple placeholder="请选择需要处理的数据" style="width: 30%">
              <el-option
                v-for="item in uploadData"
                :key="item.id"
                :label="item.uploadLines+'===='+item.uploadDate"
                :value="item.id">
              </el-option>
            </el-select>
            <v-spacer/>
          </v-card-title>
          <v-data-table :headers="headers" :items="data" :pagination.sync="pagination" :total-items="totalItems"
                        :loading="loading"
                        class="elevation-1">
            <template slot="items" slot-scope="props">
              <td class="text-xs-center" v-for="(field,id) in fields" :key="id">{{ props.item[field.sysName] }}</td>
            </template>
          </v-data-table>
        </v-card>
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-card>
          <el-form :model="handleForm" ref="basic" style="text-align: left">
            <el-form-item label="需求属性">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAll">全选</el-checkbox>
              <el-checkbox-group v-model="handleForm.fields" @change="handleChange">
                <el-checkbox v-for="(value,index) in fields" :label="value" :key="index" :disabled="judge(value)"
                             :checked="judge(value)">{{value.name}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="年龄泛化" required>
              <el-select v-model="handleForm.ageLevel" placeholder="请选择" style="display: inline-block">
                <el-option v-for="(item,index) in ageLevels" :key="index" :label="item" :value="item"/>
              </el-select>
              <input type="file" style="display: inline-block"/>
              <!--              <el-upload-->
              <!--                action="https://jsonplaceholder.typicode.com/posts/"-->
              <!--                :on-preview="handlePreview"-->
              <!--                :on-remove="handleRemove"-->
              <!--                :before-remove="beforeRemove"-->
              <!--                multiple-->
              <!--                :limit="3"-->
              <!--                :on-exceed="handleExceed"-->
              <!--                :file-list="fileList">-->
              <!--                <el-button size="small" type="primary">点击上传</el-button>-->
              <!--                <div slot="tip" class="el-upload__tip">请上传泛化树配置文件</div>-->
              <!--              </el-upload>-->
            </el-form-item>
            <el-form-item label="相似度" required>
              <el-select v-model="handleForm.sim" placeholder="请选择">
                <el-option v-for="s in sims" :key="s" :label="s" :value="s"/>
              </el-select>
            </el-form-item>
            <el-form-item label="匿名方式">
              <el-radio v-model="handleForm.mode" label=k>k匿名</el-radio>
              <el-radio v-model="handleForm.mode" label=l>l多样性</el-radio>
              <el-radio v-model="handleForm.mode" label=t>t逼近</el-radio>
            </el-form-item>
            <el-form-item label="k：" required v-if="handleForm.mode=='k'">
              <el-select v-model="handleForm.k" placeholder="请选择k值">
                <el-option label="3" value="3"/>
                <el-option label="4" value="4"/>
                <el-option label="5" value="5"/>
                <el-option label="6" value="6"/>
                <el-option label="7" value="7"/>
                <el-option label="8" value="8"/>
              </el-select>
            </el-form-item>
          </el-form>
        </v-card>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-card class="my-2">
          <v-form style="text-align: left">
            <div>
              选择的属性:
              <v-btn v-for="(field,index) in handleForm.fields" :key="index">
                {{field.name}}
              </v-btn>
            </div>
            <v-text-field v-model="handleForm.ageLevel" label="年龄泛化等级：" disabled/>
            <v-text-field v-model="handleForm.sim" label="语义相似度：" disabled/>
            <v-text-field v-model="handleForm.mode" label="匿名方式：" disabled/>
            <v-text-field v-model="handleForm.k" label="k值：" disabled/>
          </v-form>
        </v-card>
      </v-stepper-content>
      <v-stepper-content step="4">
        <v-card class="xs10 mx-auto">
          <v-card-title>
            <v-btn @click="export2csv">导出数据(csv)</v-btn>
            <v-spacer/>
            <v-btn @click="release2all">确认发布</v-btn>
          </v-card-title>
          <v-data-table :headers="result.headers" :items="result.data" :pagination.sync="result_pagination"
                        :total-items="totalItems"
                        :loading="result_loading"
                        class="elevation-1">
            <template slot="items" slot-scope="props">
              <td class="text-xs-center" v-for="(field,id) in handleForm.fields.filter((value) => value.typeId!==1)"
                  :key="id">{{ props.item[field.sysName] }}
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  import field from "../../admin/data/field";
  import vUpload from "../../../components/form/Upload";

  const ageLevels = [5, 10, 20];
  const sims = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];

  export default {
    name: "ReleaseItem",
    components: {
      'v-upload': vUpload,
    },
    props: {
      step: {
        type: Number,
        default: 1
      },
      headers: {
        type: Array,
      },
      loading: {
        type: Boolean,
      },
      result_loading: {
        type: Boolean,
      },
      fields: {
        type: Array,
      },
      totalItems: {
        type: Number,
      },
      data: {
        type: Array
      },
      handleForm: {
        type: Object
      },
      result: {
        type: Object
      },
      releaseDate: {
        type: String
      },
      uploadData: {
        type: Array
      },
    },
    data() {
      return {
        checkAll: false,
        isIndeterminate: true,
        pagination: {
          rowsPerPage: 10
        },
        result_pagination: {
          rowsPerPage: 10
        },
        ageLevels,
        sims,
        cur: [],
        fileList: [],
      };
    },
    watch: {
      cur: {
        handler(data) {
          if (data.length > 0) {
            this.$emit('getData', data);
          } else {
            this.$emit('clearData');
          }
        }
      }
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      judge(value) {
        if (value.sysName === 'AGE') {
          return true;
        }
      },
      handleChange(value) {
      },
      handleCheckAll() {
        this.handleForm.fields = this.checkAll ? this.fields : this.fields.filter((field) => {
          return field.sysName === 'AGE';
        });
        this.isIndeterminate = false;
      },
      onFileSuccess(rootFile, file, response, chunk) {
      },
      export2csv() {

      },
      release2all() {
        this.handleForm.fields = this.handleForm.fields.filter(field => field.typeId !== 1);

        console.log(this.handleForm.fields);

        this.$http.post("release/all", {
          form: this.handleForm,
          releaseDate: this.releaseDate
        }).then(res => {
          if (res.data === -1) {
            this.$message.warning('该内容已发布！');
          } else {
            this.$message.success('发布成功! ');
          }
          console.log(res);
        });
      }
    },
    mounted() {
    }
  };
</script>

<style scoped>
</style>
