import request from '@/axios/request';

export function getList() {
    return request({
        url: '/SysUser/getRouters',
        method: 'get'
    })
}