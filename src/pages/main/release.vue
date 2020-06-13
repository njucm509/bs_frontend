<template>
  <v-card>
    <v-card-text>
      <release-item :step="step" ref="release" :headers="headers" :data="items" :fields="fields" :loading="loading"
                    :totalItems="totalItems" :handleForm="handleForm" :result="result"
                    :result_loading="result_loading" :releaseDate="releaseDate" :uploadData="uploadData"
                    @getData="getData" @clearData="clearData"
      />
    </v-card-text>
    <v-card-actions class="elevation-10">
      <v-flex class="xs3 mx-auto">
        <v-btn @click="previous" :disabled="step === 1">上一步</v-btn>
        <v-btn @click="next" :disabled="step === 4">下一步</v-btn>
      </v-flex>
    </v-card-actions>
  </v-card>
</template>

<script>
  import ReleaseItem from "./release/ReleaseItem";

  export default {
    name: "release",
    components: {
      'release-item': ReleaseItem
    },
    data() {
      return {
        step: 1,
        user: {},
        fields: [],
        headers: [],
        items: [],
        loading: true,
        result_loading: true,
        totalItems: 0,
        handleForm: {
          fields: [],
          ageLevel: '10',
          sim: '0.7',
          mode: 'k',
          k: 3,
          userId: 0,
        },
        result: {
          headers: [],
          data: [],
        },
        releaseDate: '',
        uploadData: [],
        curData: [],
      }
    },
    methods: {
      previous() {
        if (this.step > 1) {
          this.step--
        }
      },
      next() {
        if (this.items.length == 0) {
          alert('请先去个人中心上传数据');
          return;
        }
        if (this.step < 4 && this.$refs.release.$refs.basic.validate()) {
          this.step++;
        }
      },
      getFields() {
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
      },
      getData(data) {
        let url = "/data/file/data";

        this.curData = this.uploadData.filter((d) => {
          return data.indexOf(d.id) !== -1;
        });

        this.$http.post(url, {
          id: this.user.id,
          date: this.curData
        }).then(res => {
          this.items = res.data;
          this.loading = false;
        }).catch((err) => {
          console.log(err)
        });
      },
      clearData() {
        this.items = [];
      },
      getUploadRecord() {
        this.$http.get('/data/record/upload/user/' + this.user.id).then(res => {
          console.log(res);
          this.uploadData = res.data;
        }).catch();
      }
    },
    watch: {
      uploadData: {
        handler(data) {
          if (data.length > 0) {
            console.log(data);
            this.getFields();
          }
        }
      },
      // curData: {
      //   handler(data) {
      //     if (data.length > 0) {
      //       console.log('xxx');
      //       // this.getData();
      //     }
      //   }
      // },
      step: {
        handler(step) {
          if (step === 4) {
            this.result.headers = [];
            for (let i = 0; i < this.handleForm.fields.length; i++) {
              if (this.handleForm.fields[i].typeId == 1) {
                continue;
              }

              this.result.headers.push({
                text: this.handleForm.fields[i].name,
                align: 'center',
                sortable: false,
                value: this.handleForm.fields[i].sysName,
              });
            }
            this.handleForm.userId = this.user.id;
            this.handleForm.curData = this.curData;

            this.handleForm.id = '';
            this.$http.post('/release/anonymous', this.handleForm).then(res => {
              console.log(res)
              this.handleForm.id = res.data.handleFormId
              this.releaseDate = res.data.curDate + '';

              if (res.status === 200) {
                this.$http.post('/data/file/data', {
                  id: this.user.id,
                  type: 1,
                  date: [{uploadDate: this.releaseDate}],
                  fields: this.handleForm.fields
                }).then(res2 => {
                  this.result.data = res2.data;
                  this.result_loading = false;
                });
              }
            }).catch();
            // this.result_loading = true;
          }
        }
      }
    },
    mounted() {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.getUploadRecord();
    }
  }
</script>

<style scoped>

</style>
