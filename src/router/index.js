import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function route(path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: () => import('../pages' + file)
  }
}

const router = new Router({
  mode: 'history',
  routes: [
    route("/login", '/Login', "Login"),
    route("/register", '/Register', "Register"),
    {
      path: '/admin',
      component: () => import('../pages/admin/Home'),
      redirect: '/admin/index/dashboard',
      children: [
        route("index/dashboard", "/admin/Dashboard", "Dashboard"),
        route("user/check", '/admin/user/check', "userCheck"),
        route("user/list", '/admin/user/list', "userList"),
        route("authority/list", '/admin/authority/list', "List"),
        route("authority/member", '/admin/authority/member', "member"),
        route("authority/role", '/admin/authority/role', "role"),
        route("log/record", '/admin/log/record', "logRecord"),
      ]
    },
    {
      path: '/',
      component: () => import('../pages/index'),
      redirect: 'index',
      children: [
        route("index", "/main/index", "index"),
        route("index/release", "/main/release", "release"),
        route("index/encrypt", "/main/encrypt", "encrypt"),
        route("index/search", "/main/search", "search"),
        {
          path: 'index/user',
          component: () => import('../pages/main/user'),
          redirect: 'index/user/info',
          children: [
            route("info", "/main/info/info", "info"),
            route("data", "/main/info/data", "data"),
            route("task", "/main/info/task", "task"),
            route("record", "/main/info/record", "record"),
            route("permission", "/main/info/permission", "permission"),
          ]
        },
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login' || to.path == '/register') {
    next()
  } else if (to.path == '/index') {
    // if (sessionStorage.getItem('user')){
    next();
    // }else {
    //   next({
    //     path:'login'
    //   })
    // }
  } else {
    next();
  }
})
export default router
