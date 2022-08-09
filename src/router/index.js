import { createWebHashHistory, createRouter, useRoute } from "vue-router";
import Home from "./../components/Home.vue";
import storage from "./../utils/storage";
import { permissionListApi } from "./../api";
import { generateRoute } from "../utils/utils";

const routes = [
  {
    name: "home",
    path: "/",
    meta: {
      title: "首頁",
    },
    component: Home,
    redirect: "/welcome",
    children: [
      {
        name: "welcome",
        path: "/welcome",
        meta: {
          title: "歡迎頁",
        },
        component: () => import("@/views/Welcome.vue"),
      },
      // {
      //   name: "user",
      //   path: "/system/user",
      //   meta: {
      //     title: "用戶管理",
      //   },
      //   component: () => import("@/views/User.vue"),
      // },
      // {
      //   name: "menu",
      //   path: "/system/menu",
      //   meta: {
      //     title: "菜單管理",
      //   },
      //   component: () => import("@/views/Menu.vue"),
      // },
      // {
      //   name: "role",
      //   path: "/system/role",
      //   meta: {
      //     title: "角色管理",
      //   },
      //   component: () => import("@/views/Role.vue"),
      // },
      // {
      //   name: "dept",
      //   path: "/system/dept",
      //   meta: {
      //     title: "部門管理",
      //   },
      //   component: () => import("@/views/Dept.vue"),
      // },
    ],
  },
  {
    name: "login",
    path: "/login",
    meta: {
      title: "登入頁",
    },
    component: () => import("@/views/Login.vue"),
  },
  {
    name: "404",
    path: "/404",
    meta: {
      title: "頁面不存在",
    },
    component: () => import("@/views/404.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  // 解決別的瀏覽器因為await loadAsyncRoutes()無法點選導航顯示頁面的問題
  strict: true,
  routes,
});

async function loadAsyncRoutes() {
  const userInfo = storage.getItem("userInfo") || {};
  if (userInfo.token) {
    try {
      const { menuList } = await permissionListApi();
      const routes = generateRoute(menuList);
      const modules = import.meta.glob("../views/*.vue");
      console.log("views", modules);
      routes.map((route) => {
        //const url=`./../views/${route.component}.vue`
        let url = `../views/${route.name}.vue`;
        //route.component = () => import(url);
        route.component = modules[url];
        router.addRoute("home", route);
      });
    } catch (error) {
      console.log(error.stack);
    }
  }
}

loadAsyncRoutes();

// 判斷當前地址是否可以訪問
// function checkPermission(path) {
//   const hasPermission = router
//     .getRoutes()
//     .filter((route) => route.path == path).length;
//   if (hasPermission) {
//     return true;
//   } else {
//     return false;
//   }
// }

// 導航守衛
router.beforeEach(async (to, from, next) => {
  if (to.name) {
    if (router.hasRoute(to.name)) {
      document.title = to.meta.title;
      next();
    } else {
      next("/404");
    }
  } else {
    await loadAsyncRoutes();
    let curRoute = router.getRoutes().filter((item) => item.path == to.path);
    if (curRoute?.length) {
      document.title = curRoute[0].meta.title;
      next({ ...to, replace: true });
    } else {
      next("/404");
    }
  }
});

// 導航守衛
// router.beforeEach((to, from, next) => {
//   if (router.hasRoute(to.name)) {
//     document.title = to.meta.title;
//     next();
//   } else {
//     next("/404");
//   }
// });

export default router;
