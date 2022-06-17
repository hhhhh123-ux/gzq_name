import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css' 
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