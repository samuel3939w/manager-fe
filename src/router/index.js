import { createWebHashHistory, createRouter } from "vue-router";
import Home from "./../components/Home.vue";

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
        component: () => import("../views/Welcome.vue"),
      },
    ],
  },
  {
    name: "login",
    path: "/login",
    meta: {
      title: "登入頁",
    },
    component: () => import("../views/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
