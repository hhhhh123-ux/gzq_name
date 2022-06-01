import { router } from '@/router'
import { getList } from '@/api/system/menu/menu' // 获取路由的接口方法
import Layout from '@/vab/layouts'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}
const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = router.concat(routes) //动态路由与和镜态公共路由结合
        // console.log('state.routes',state.routes)
    }
}
/**
 * 把后台返回菜单组装成routes要求的格式
 * @param {*} routes
 */
export function getAsyncRoutes(routes) {
    const res = []
    const keys = ['path', 'name', 'children', 'redirect','meta', 'hidden']
    routes.forEach(item => {
        const newItem = {}
        if (item.component) {
            if (item.component === 'Layout') {
                newItem.component = Layout
            } else {
                newItem.component = loadView(item.component);
            }
        }
        for (const key in item) {
            if (keys.includes(key)) {
                newItem[key] = item[key]
            }
        }
        if (newItem.children && newItem.children.length) {
            newItem.children = getAsyncRoutes(item.children)
        }
        res.push(newItem)
    })
    return res
}
export const loadView = (view) => {
    return (resolve) => require([`@/views/${view}`], resolve)
}
export function filterAsyncRoutes(routes, roles) {
    const res = []
    routes.forEach(route => {
        const tmp = { ...route }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })
    return res
}
const state = {
    routes: [],
    addRoutes: []
}
const actions = {
    // eslint-disable-next-line no-unused-vars
    generateRoutes({ commit }, roles) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async resolve => {
            let accessedRoutes
            // 请求接口 获取动态路由
            const routes = await getList() // 获取到动态路由接口
            if(routes.code == 200){
                if(routes.data.length > 0){
                    const asyncRoutes = getAsyncRoutes(routes.data) // 对路由格式进行处理
                    accessedRoutes = asyncRoutes
                    commit('SET_ROUTES', asyncRoutes)
                    resolve(accessedRoutes)
                }else{
                    MessageBox.confirm('暂无菜单', '暂无菜单', {
                        confirmButtonText: '重新登录',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        store.dispatch('user/resetToken').then(() => {
                            location.reload()
                        })
                    })
                }
            }else{
                console.log('过期')
                MessageBox.confirm('是否重新登录？', '当前无登录用户信息', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            }
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

//
// const whiteList = ['/login'] // no redirect whitelist
// router.beforeEach(async(to, from, next) => {
//     // start progress bar
//     NProgress.start()
//     // set page title
//     //document.title = getPageTitle(to.meta.title)
//     // determine whether the user has logged in
//     const hasToken = getToken()
//     if (hasToken) {
//         if (to.path === '/login') {
//             // if is logged in, redirect to the home page
//             next({ path: '/' })
//             NProgress.done()
//         } else {
//             //判断获取来的动态路由的数据是否有数据
//             const hasGetUserInfo = store.getters.roles && store.getters.roles.length > 0
//             if (hasGetUserInfo) {
//                 next()
//             } else {
//                 try {
//                     // get user info
//                     // await store.dispatch('user/getInfo')
//                     //调用获取动态的接口
//                     const {data} = await store.dispatch('user/getInfo')
//                     // 在这里获取异步路由
//                     const accessRoutes = await store.dispatch('permission/generateRoutes', data)
//                     // 调用router.addRoutes方法,将异步路由添加进去
//                     router.addRoutes(accessRoutes)
//                     // 在这动态添加最后的通配路由，确保先有动态路由、再有通配路由，解决动态路由刷新会跳转到404问题
//                     let lastRou = [{ path: '*', redirect: '/404' }]
//                     router.addRoutes(lastRou)
//                     next({ ...to, replace: true })
//                 } catch (error) {
//                     // remove token and go to login page to re-login
//                     await store.dispatch('user/resetToken')
//                     Message.error(error || 'Has Error')
//                     next(`/login?redirect=${to.path}`)
//                     NProgress.done()
//                 }
//             }
//         }
//     } else {
//         /* has no token*/
//         if (whiteList.indexOf(to.path) !== -1) {
//             // in the free login whitelist, go directly
//             next()
//         } else {
//             // other pages that do not have permission to access are redirected to the login page.
//             next(`/login?redirect=${to.path}`)
//             NProgress.done()
//         }
//     }
// })
//
// router.afterEach(() => {
//     // finish progress bar
//     NProgress.done()
// })



