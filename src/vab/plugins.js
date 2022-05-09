

import Vue from 'vue'


/**
 * @description 表格高度
 * @param {*} formType
 */
Vue.prototype.$baseTableHeight = (formType) => {
    let height = window.innerHeight
    const paddingHeight = 291
    const formHeight = 60

    if ('number' === typeof formType) {
        height = height - paddingHeight - formHeight * formType
    } else {
        height = height - paddingHeight
    }
    return height
}