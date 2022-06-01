import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg组件
// import * as Icons from "@element-plus/icons-vue"; //导入所有element icon图标
// // register globally
// Object.keys(Icons).forEach((key) => {
// 	Vue.component('svg-icon', Icons[key]); // JS中用这行
//     // app.component(key, Icons[key as keyof typeof Icons]);// TS中用这行
// });
Vue.component('svg-icon', SvgIcon)
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)