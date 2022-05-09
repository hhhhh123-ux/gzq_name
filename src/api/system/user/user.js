import request from '@/axios/request';

// 获取验证码
export function getCodeImg() {
    return request({
      url: '/login/code',
      method: 'get',
      timeout: 100,
    })
  }

// 获取验证码
export function login(data) {
    return request({
        url: '/login/login',
        method: 'post',
        data: data
    })
}
// 登出
export function logOut() {
    return request({
        url: '/login/logout',
        method: 'get',
        timeout: 200,
    })
}
// 获取当前用户
export function userInfo() {
    return request({
        url: '/SysUser/userInfo',
        method: 'get'
    })
}