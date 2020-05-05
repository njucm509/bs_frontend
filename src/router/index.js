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
        route("data/info", '/admin/data/info', "dataInfo"),
        route("data/field", '/admin/data/field', "dataField"),
        route("data/file", '/admin/data/file', "dataFile"),
        route("user/check", '/admin/user/check', "userCheck"),
        route("user/list", '/admin/user/list', "userList"),
        route("authority/permission", '/admin/authority/permission', "permissionList"),
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
            route("info", "/main/user/info", "info"),
            route("data", "/main/user/data", "data"),
            route("task", "/main/user/task", "task"),
            route("record", "/main/user/record", "record"),
            route("permission", "/main/user/permission", "permission"),
          ]
        },
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login' || to.path == '/register') {
    if (sessionStorage.getItem('user')) {
      next({
        path: "/"
      });
    } else {
      next();
    }
  } else if (to.path.startsWith('/index/') || to.path.startsWith('/admin')) {
    if (sessionStorage.getItem('user')) {
      next();
    } else {
      next({
        path: 'login'
      })
    }
  } else {
    next();
  }
})
export default router
