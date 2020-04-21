<template>
  <div>
    test1-1
  </div>
</template>

<script>
  export default {
    name: 'record',
    data() {
      return {
        userList: []
      }
    },
    methods: {
      getData() {
        this.$http.get('/log/list').then(res => {
          console.log(res)
        })
      }
    },
    mounted() {
      this.getData();
    }
  }
</script>

<style>
</style>
