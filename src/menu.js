var menus = [
  {
    action: "home",
    title: "首页",
    path:"/index",
    items: [
      { title: "统计", path: "/dashboard" }
      ]
  },
  {
    action: "apps",
    title: "管理1",
    path:"/test1",
    items: [
      { title: "管理1-1", path: "/test1-1" },
      { title: "管理1-2", path: "/test1-2" },
      { title: "管理1-3", path: "/test1-3" },
    ]
  },
  {
    action: "people",
    title: "管理2",
    path:"/test2",
    items: [
      { title: "管理2-1", path: "/test2-1" },
      { title: "管理2-2", path: "/test2-2" }
    ]
  },
  {
    action: "settings",
    title: "权限管理",
    path:"/authority",
    items: [
      { title: "权限管理", path: "/list" },
      { title: "角色管理", path: "/role" },
      { title: "人员管理", path: "/member" }
    ]
  }
]

export default menus;
