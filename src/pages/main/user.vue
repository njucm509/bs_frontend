<template>
  <div class="container">
    <div id="left" class="col-xs-2 col-sm-2">
      <ul class="nav nav-tabs nav-stacked">
        <li><strong>个人设置</strong></li>
        <li v-for="item in navList" :key="item.id" :class="{ active: item.isActive }"
            @click="changeActive(item)">
          <router-link :to="item.path">{{item.text}}</router-link>
        </li>
      </ul>
    </div>
    <div class="col-xs-10 col-sm-10" style="text-align: left">
      <router-view/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "user",
    data() {
      return {
        navList: [
          {text: '我的信息', path: 'info', isActive: true},
          {text: '我的数据', path: 'data', isActive: false},
          {text: '我的任务', path: 'task', isActive: false},
          {text: '我的记录', path: 'record', isActive: false},
          {text: '我的权限', path: 'permission', isActive: false},
        ],
      }
    },
    methods: {
      /* changeActive: (data) => (console.log(this.navList))
      * 箭头函数的this指向为当前对象
      * */
      changeActive: function (data) {
        this.navList.forEach((obj) => (obj.isActive = false))
        data.isActive = !data.isActive
      },
    }
  }
</script>

<style scoped>
  #left li {
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
    border-left: 1px solid lightgray;
    border-right: 1px solid lightgray;
    font-weight: 600;
    color: #0366d6;
  }
</style>
