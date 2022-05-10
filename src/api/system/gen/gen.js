import request from '@/axios/request';


export function allList(data) {
    return request({
      url: '/gen/list',
      method: 'post',
      data: data,
    })
  }

export function generator(data) {
    return request({
        url: '/gen/generator',
        method: 'post',
        data: data,
    })
}

