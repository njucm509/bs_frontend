<template>
  <div>
    test1-1
  </div>
</template>

<script>
    export default {
        data() {
            return {
                userList: []
            }
        },
        methods: {
            getData() {
                this.$http.get('/user/list').then(res => {
                    console.log(res)
                    sessionStorage.setItem('user','')
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
