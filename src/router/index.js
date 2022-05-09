import Vue from "vue";
import VueRouter from "vue-router";
import { recordRoute } from '@/config/setting.config'
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "Login",
      redirect: "/Login",
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
//导航守卫
//使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    let token = localStorage.getItem('Authorization');

    if (token === null || token === '') {
      next('/login');
    } else {
      next();
    }
  }
});

/**
 * 获取当前跳转登录页的Route
 * @param currentPath 当前页面地址
 */
export function toLoginRoute(currentPath) {
  if (recordRoute && currentPath !== '/')
    return {
      path: '/login',
      query: { redirect: currentPath },
      replace: true,
    }
  else return { path: '/login', replace: true }
}

export default router