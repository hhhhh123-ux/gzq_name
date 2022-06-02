import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import '@/icons';
import * as lodash from 'lodash';
/* 全局lodash */
Vue.prototype.$baseLodash = lodash
/* 全局事件总线 */
Vue.prototype.$baseEventBus = new Vue()
Vue.use(ElementUI);
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});