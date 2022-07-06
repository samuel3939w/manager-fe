import { createWebHashHistory, createRouter } from "vue-router";
import Home from "./../components/Home.vue";
import Welcome from "./../components/Welcome.vue";
import Login from "./../components/Login.vue";

const routes = [
  {
    name: "home",
    path: "/",
    meta: {
      title: "首頁",
    },
    component: Home,
    redirect: '/welcome',
    children: [
      {
        name: "welcome",
        path: "/welcome",
        meta: {
          title: "歡迎頁",
        },
        component: Welcome,
      },
      {
        name: "login",
        path: "/login",
        meta: {
          title: "登入頁",
        },
        component: Login,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;