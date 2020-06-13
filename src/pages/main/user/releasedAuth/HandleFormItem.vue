<template>
  <v-form v-model="valid" ref="myForm">
    <v-text-field v-model="item.id" label="编号：" disabled/>
    <v-text-field v-model="item.mode" label="匿名方法：" disabled/>
    <v-text-field v-model="item.sim" label="相似度：" disabled/>
    <v-text-field v-model="item.ageLevel" label="年龄泛化：" disabled/>
    <v-text-field v-model="item.k" label="k值：" disabled/>
    处理状态:
    <v-btn v-if="item.status == 0" style="color: red" disabled>未处理</v-btn>
    <v-btn v-else style="color: green" disabled>已处理</v-btn>
    <br>
    字段信息:
    <v-btn v-for="(field,index) in item.usedFields" :key="index" disabled>{{field.name}}</v-btn>
  </v-form>
</template>

<script>
  export default {
    name: "HandleFormItem",
    props: {
      item: {
        type: Object
      },
    },
    data() {
      return {
        valid: false,
      }
    },
    filters: {
      part(value) {
        console.log(value);
      }
    }
  }
</script>

<style scoped>

</style>
