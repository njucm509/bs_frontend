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
        route("test1/test1-1", '/admin/test1/test1-1', "test1-1"),
        route("test1/test1-2", '/admin/test1/test1-2', "test1-2"),
        route("test1/test1-3", '/admin/test1/test1-3', "test1-3"),
        route("test2/test2-1", '/admin/test2/test2-1', "test2-1"),
        route("test2/test2-2", '/admin/test2/test2-2', "test2-2"),
        route("authority/list", '/admin/authority/list', "List"),
        route("authority/member", '/admin/authority/member', "member"),
        route("authority/role", '/admin/authority/role', "role")
      ]
    },
    route("/index", "/index", "index"),
    {
      path: '/',
      redirect: '/index',
    },
  ]
})

// router.beforeEach((to, from, next) => {
//   if (to.path=='/login'||to.path=='/register'){
//     next()
//   }else{
//     if (sessionStorage.getItem('user')){
//       next()
//     }else {
//       next({
//         path:'login'
//       })
//     }
//   }
// })
export default router
