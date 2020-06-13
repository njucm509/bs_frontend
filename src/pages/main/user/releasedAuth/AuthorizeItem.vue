<template>
  <v-form v-model="valid" ref="myForm">
    <el-select v-model="item.applyUserId" multiple placeholder="请选择授权用户" style="width: 100%">
      <el-option
        v-for="item in users"
        :key="item.value"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>

    <div>
      <auth-check-box v-for="(field,index) in item.usedFields" :content="field.name" :auth.sync="field.auth"
                      :key="index"/>
    </div>

    <v-layout class="my-4" row>
      <v-spacer/>
      <v-btn :disabled="!valid" @click="submit">提交</v-btn>
      <!--      <v-btn @click="clear">重置</v-btn>-->
    </v-layout>
  </v-form>

</template>

<script>

  import authorizeCheckBox from "../../../../components/base/authorizeCheckBox";

  export default {
    name: "AuthorizeItem",
    components: {
      'auth-check-box': authorizeCheckBox
    },
    props: {
      item: {
        type: Object
      }
    },
    data() {
      return {
        valid: false,
        users: [],
      }
    },
    methods: {
      getUser() {
        this.$http.get('/user/list').then(res => {
          this.users = res.data;
        })
      },
      submit() {
        console.log(this.item);
        this.$http.post('/data/release/apply/create', this.item).then(res => {
          this.$message.success('授权成功');
          this.$emit('closeWindow');
        }).catch();
      }
    },
    mounted() {
      this.getUser();
    }
  }
</script>

<style scoped>

</style>
