const menus = [
  {
    action: "home",
    title: "首页",
    path: "/index",
    items: [
      {title: "统计", path: "/dashboard"}
    ]
  },
  {
    action: "people",
    title: "用户管理",
    path: "/user",
    items: [
      {title: "用户审核", path: "/check"},
      {title: "用户列表", path: "/list"}
    ]
  },
  {
    action: "apps",
    title: "数据中心",
    path: "/data",
    items: [
      {title: "数据信息", path: "/info"},
    ]
  },
  {
    action: "settings",
    title: "权限管理",
    path: "/authority",
    items: [
      {title: "权限管理", path: "/list"},
      {title: "角色管理", path: "/role"},
      {title: "人员管理", path: "/member"}
    ]
  },
  {
    action: "apps",
    title: "日志记录",
    path: "/log",
    items: [
      {title: "操作记录", path: "/record"},
    ]
  },
];

export default menus;
