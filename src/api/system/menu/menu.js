import request from '@/axios/request';

export function getList() {
    return request({
        url: '/SysUser/getRouters',
        method: 'get'
    })
}

export function treeselect() {
    return request({
        url: '/SysMenu/treeselect',
        method: 'get'
    })
}