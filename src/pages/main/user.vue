<template>
  <div class="container">
    <div id="left" class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
      <ul class="nav nav-tabs nav-stacked">
        <li><strong>个人设置</strong></li>
        <li v-for="item in navList" :key="item.id" :class="{ active: item.isActive }"
            @click="changeActive(item)" v-if="checkRole(item.role)">
          <router-link :to="item.path">{{item.text}}</router-link>
        </li>
      </ul>
    </div>
    <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10" style="text-align: left">
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
          {text: '我的信息', path: 'info', isActive: true, role: [1, 2, 3, 4]},
          {text: '我的数据', path: 'data', isActive: false, role: [1, 2, 3]},
          {text: '我的文件', path: 'file', isActive: false, role: [1, 2, 3]},
          {text: '我的任务', path: 'task', isActive: false, role: [1, 2, 3]},
          {text: '我的记录', path: 'record', isActive: false, role: [1, 2, 3, 4]},
          {text: '我的权限', path: 'permission', isActive: false, role: [1, 2, 3, 4]},
          {text: '我发布的数据', path: 'released', isActive: false, role: [1, 2, 3]},
          {text: '可查询的数据', path: 'releasedData', isActive: false, role: [1, 2, 3, 4]},
          {text: '发布数据权限授予', path: 'releasedAuth', isActive: false, role: [1, 2, 3]},
          {text: '发布数据权限审核', path: 'releasedCheck', isActive: false, role: [1, 2, 3]},
          {text: '发布数据权限申请', path: 'releasedApply', isActive: false, role: [1, 2, 3, 4]},
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
      checkRole(role) {
        let userRole = JSON.parse(sessionStorage.getItem('user')).roleId;

        if (!(role instanceof Array) || !(userRole instanceof Array) || ((role.length < userRole.length))) {
          return false;
        }

        let roleStr = role.toString();

        let flag = false;

        for (let i = 0; i < userRole.length; i++) {
          if (roleStr.indexOf(userRole[i]) >= 0) {
            flag = true;
          }
        }

        return flag;
      },
      mounted() {
        // this.user = JSON.parse(sessionStorage.getItem('user'));
      }
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

  .nav-tabs > li:hover .dropdown-menu {
    display: block;
  }
</style>
