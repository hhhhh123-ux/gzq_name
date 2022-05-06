import request from '@/axios/request';

// 获取验证码
export function getCodeImg() {
    return request({
      url: '/login/code',
      method: 'get',
      timeout: 20000,
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