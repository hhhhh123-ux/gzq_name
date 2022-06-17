import Vue from "vue";
import VueRouter from "vue-router";
import {
  loginInterception,
  recordRoute,
  routerMode,
} from "@/config/setting.config";
import store from "@/store";
import { Message } from "element-ui";
import "nprogress/nprogress.css";
import { publicPath } from "../config/cli.config";
export const asyncRoutes = [];
Vue.use(VueRouter);

export const constantRoutes = [
  {
    path: "/",
    name: "Home",
    redirect: "/Home",
  },

  {
    path: "/Home",
    name: "Home",
    component: () => import("@/vab/layouts/index"),
    meta: {
      hidden: true,
    },
    children: [{
      path: "/Index",
      name: "Index",
      meta: {
        hidden: true,
      },
      component: () => import("@/views/front/Index"),
    },
    {
      path: "/user",
      name: "user",
      meta: {
        hidden: true,
      },
      component: () => import("@/views/System/user/index"),
    }
    ],
  },
  {
    path: "/Login",
    name: "Login",
    meta: {
      hidden: true,
    },
    component: () => import("@/views/Login/Login"),
  },
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/403"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404"),
    meta: {
      hidden: true,
    },
  },
];

const router = createRouter();

const whiteList = ["/Login"]; // no redirect whitelist
//导航守卫
//使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach(async (to, from, next) => {
  // start progress bar

  const hasToken = localStorage.getItem("token");
  if (hasToken) {
    if (store.getters["routes/routes"].length) {
      if (to.path === "/Login") {
        // if is logged in, redirect to the home page
        next({ path: "/" });
        // NProgress.done()
      } else {
        console.log("to.path", to.path);
        console.log(
          "accessRoutes111111",
          await store.dispatch("routes/setRoutes", "all")
        );
        next();
      }
    } else {
      //判断获取来的动态路由的数据是否有数据
      const hasGetUserInfo =
        store.getters.roles && store.getters.roles.length > 0;
      if (hasGetUserInfo) {
        next();
      } else {
        try {

          // if (to.matched.length === 0) {
          //   // 如果未匹配到路由
          //   from.name ? next({ name: from.name }) : next("/"); // 如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
          // } else {
          //   next(); // 如果匹配到正确跳转
          // }
          // get user info
          // await store.dispatch('user/getInfo')
          //调用获取动态的接口
          // eslint-disable-next-line no-undef
          if (loginInterception) {
            console.log("data==", await store.dispatch("user/getUserInfo"));
            // eslint-disable-next-line no-empty
          } else {
          }
          // 在这里获取异步路由
          // eslint-disable-next-line no-undef
          console.log(
            "accessRoutes",
            await store.dispatch("routes/setRoutes", "all")
          );
          // 调用router.addRoutes方法,将异步路由添加进去
          // const {data} =await store.dispatch('routes/setRoutes', 'all')
          // router.addRoutes(data)
          // // 在这动态添加最后的通配路由，确保先有动态路由、再有通配路由，解决动态路由刷新会跳转到404问题
          // let lastRou = [{ path: '*', redirect: '/404' }]
          // router.addRoutes(lastRou)
          next();
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch("user/resetAll");
          Message.error(error || "Has Error");
          next(toLoginRoute(to.path));
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      console.log("/login?redirect=", to.path);
      next({ path: "/Login" });
    }
  }
});

/**
 * 获取当前跳转登录页的Route
 * @param currentPath 当前页面地址
 */
export function toLoginRoute(currentPath) {
  if (recordRoute && currentPath !== "/")
    return {
      path: "/Login",
      query: { redirect: currentPath },
      replace: true,
    };
  else return { path: "/Login", replace: true };
}

export function resetRouter(routes = constantRoutes) {
  routes.map((route) => {
    if (route.children) {
      route.children = fatteningRoutes(route.children);
    }
  });
  router.matcher = createRouter(routes).matcher;
}

function fatteningRoutes(routes) {
  return routes.flatMap((route) => {
    return route.children ? fatteningRoutes(route.children) : route;
  });
}

function createRouter(routes = constantRoutes) {
  const router123 = new VueRouter({
    base: publicPath,
    mode: routerMode,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes:[
      {
        path: "/",
        name: "Home",
        redirect: "/Home",
      },
    
      {
        path: "/Home",
        name: "Home",
        component: () => import("@/vab/layouts/index"),
        meta: {
          hidden: true,
        },
        children: [{
          path: "/Index",
          name: "Index",
          meta: {
            hidden: true,
          },
          component: () => import("@/views/front/Index"),
        },
        {
          path: "/user",
          name: "user",
          meta: {
            title: "用户管理",
            hidden: true,
          },
          component: () => import("@/views/System/user/index"),
        }
        ],
      },
      {
        path: "/Login",
        name: "Login",
        meta: {
          hidden: true,
        },
        component: () => import("@/views/Login/Login"),
      },
      {
        path: "/403",
        name: "403",
        component: () => import("@/views/403"),
        meta: {
          hidden: true,
        },
      },
      {
        path: "/404",
        name: "404",
        component: () => import("@/views/404"),
        meta: {
          hidden: true,
        },
      },
    ],
  });
  return router123;
}
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
export default router;
