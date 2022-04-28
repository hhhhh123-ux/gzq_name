import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      name: "Home",
      redirect: "/Home",
    },
    {
      path: "/Home",
      name: "Home",
      component: () => import("@/views/Home"),
      children: [
        {
          path: "/gen",
          name: "gen",
          component: () => import("@/views/Gen/Gen"),
        },
        {
          path: "/swagger",
          name: "gen",
          component: () => import("@/views/Gen/Swagger"),
        },
        {
          path: "/druid",
          name: "druid",
          component: () => import("@/views/System/druid"),
        },
      ],
    },
    {
      path: "/Login",
      name: "login",
      component: () => import("@/views/Login/Login"),
    },
    {
      path: "/system",
      name: "System",
      component: () => import("@/views/System/System"),
      children: [
        {
          path: "/gen",
          name: "gen",
          component: () => import("@/views/Gen/Gen"),
        },
      ],
    },
  ],
});

// 解决路由重复单击错误
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
