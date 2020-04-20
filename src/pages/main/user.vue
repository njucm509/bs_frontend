<template>
  <div class="row">
    <div id="left" class="col-xs-2 col-sm-2">
      <ul class="nav nav-tabs nav-stacked">
        <li class="active"><a href="#">我的信息</a></li>
        <li><a href="#">我的数据</a></li>
        <li><a href="#">我的任务</a></li>
        <li><a href="#">我的记录</a></li>
        <li><a href="#">我的权限</a></li>
      </ul>
    </div>
    <div style="background-color:#000;"></div>
  </div>
</template>

<script>
  export default {
    name: "info",
    data() {
      return {
        navList: [
          {text: '我的信息', path: '/index', isActive: true},
          {text: '我的数据', path: '/index/release', isActive: false},
          {text: '我的任务', path: '/index/encrypt', isActive: false},
          {text: '我的记录', path: '/index/search', isActive: false},
          {text: '我的权限', path: '/index/user/me', isActive: false},
        ],
      }
    }
  }
</script>

<style scoped>
  #left li {
    border-bottom: 1px solid lightgray;
    border-left: 1px solid lightgray;
    border-right: 1px solid lightgray;
  }
</style>
