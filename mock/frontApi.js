// 这里模仿后台返回的菜单数据

const menuData = [
  // 首页
  {
      path: "/dashboard",
      icon: "form",
      name: "dashboard",
      component: "./Dashboard/Analysis",
      authority: ["admin", "user"]
  },
  // forms
  {
    path: "/form",
    icon: "form",
    name: "form",
    component: "./Forms/BasicForm",
    authority: ["abc"]
    // routes: [
    //   {
    //     path: "/form/basic-form",
    //     name: "basicform",
    //   }
    //   // {
    //   //     path: '/form/monitor',
    //   //     name: 'monitor',
    //   //     component: './Forms/BasicForm',
    //   // },
    // ]
  },
  // 账号管理
  {
    path: "/accountManage",
    icon: "solution",
    name: "AccountManage",
    component: "./AccountManage/AccountManage",
    authority: ["admin", "user"]
  },
  // Banner管理
  {
    path: "/bannerManage",
    icon: "form",
    name: "bannerManage",
    component: "./Forms/BannerManage",
    authority: ["admin", "user"]
  },

  {
    component: "404"
  }
];

const buttonAuth = {
  "/form/basic-form/submit": "true"
};

const userInfo ={
  name : '张三',
  code : '0001',
  avatar:"https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
  authority : ["admin", "user"],
}

const getDynamicMenu = {
  menuData,
  buttonAuth
};

const getUserInfo = {
  userInfo
};

function genResponse (data,res) {
  return {
    respCode:"0000",
    respMsg:"查询成功",
    data,
  }
}


// 抛出接口
export default {

  "GET /frontApi/getDynamicMenu": genResponse(getDynamicMenu),
  "GET /frontApi/getUserInfo":genResponse(getUserInfo)
};
