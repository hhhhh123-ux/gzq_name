import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex);
const modules = {}
const files = require.context('./modules', false, /\.js$/)
files.keys().forEach((key) => {
    modules[key.replace(/(modules|\/|\.|js)/g, '')] = {
        ...files(key).default,
        namespaced: true,
    }
})
const store = new Vuex.Store({
    modules,
})
// const store = new Vuex.Store({
//
//     state: {
//         // 存储token
//         Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : ''
//     },
//     mutations: {
//         // 修改token，并将token存入localStorage
//         changeLogin(state, user) {
//             state.Authorization = user.Authorization;
//             console.log("user=="+user);
//             localStorage.setItem('Authorization', user.Authorization);
//             let token = localStorage.getItem('Authorization');
//             console.log("token=="+token);
//         }
//     }
// });

export default store

