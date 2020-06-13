<template>
  <div id="base">
    <el-input style="display: inline-block;width: 200px" v-model="content" :disabled="true"/>
    <el-select style="display: inline-block" v-model="curAuth" placeholder="请选择权限" :disabled="check">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: "authorizeCheckBox",
    data() {
      return {
        options: [{
          value: '0',
          label: '不可读'
        },
          {
            value: '1',
            label: '可读'
          },
        ],
        curAuth: this.auth,
        check: false,
      }
    },
    props: ['content', 'auth',],
    watch: {
      'auth': function (newVal, oldVal) {
        this.curAuth = newVal;
      },
      'curAuth': function (newVal, oldVal) {
        this.$emit("update:auth", newVal);
      },
    }
  }
</script>

<style scoped>

</style>
