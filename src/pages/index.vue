<template>
  <div id="index">
    <div id="header">
      <div class="nav nav-tabs" style="display: inline-block;float: none;" id="left">
        <li role="presentation" v-for="item in navList" :key="item.id" :class="{ active: item.isActive }"
            @click="changeActive(item)">
          <router-link :to="item.path">{{item.text}}</router-link>
        </li>
      </div>
      <div class="nav nav-tabs" id="right">
        <li role="presentation" class="dropdown" id="info" v-if="this.user.id != null">
          <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true"
             aria-expanded="false">
            {{this.user.name}} <span class="caret"></span>
          </a>
          <ul class="dropdown-menu">
            <li id="logout"><a @click="logout" style="cursor: pointer">退出登录</a></li>
          </ul>
        </li>
        <li role="presentation" id="login"><a href="/login" v-if="this.show">登陆</a></li>
        <li role="presentation" id="register"><a href="/register" v-if="this.show">注册</a></li>
        <li role="presentation" id="admin"><a href="/admin" v-if="this.user.id != null">进入管理员界面</a></li>
      </div>
    </div>
    <div id="content" class="col-xs-8 col-sm-8">
      <router-view/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        navList: [
          {text: '首页', path: '/index', isActive: true},
          {text: '数据发布', path: '/index/release', isActive: false},
          {text: '数据加密', path: '/index/encrypt', isActive: false},
          {text: '加密搜索', path: '/index/search', isActive: false},
          {text: '个人中心', path: '/index/user/me', isActive: false},
        ],
        user: {},
        show: true
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
      logout() {
        alert('退出');
      }
    }
  }
</script>

<style scoped>
  #index {
  }

  #header {
    text-align: center;
    border: 1px solid white;
    box-shadow: 1px 1px 1px darkgray;
  }

  #info, #admin, #login, #register {
    float: right;
  }

  #content {
    float: none;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  #header #left {
    border-bottom: 0px solid #000;
  }

  #header #right {
    display: inline-block;
    float: right;
    border-bottom: 0px solid #000;
  }

  li {
    padding: 5px;
  }

  li::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    border-bottom: 1px solid gray;
  }

  li:hover::before {
    width: 100%;
  }

  a {
    color: black
  }
</style>
