// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import MintUI from 'mint-ui'
import router from './router';

// 引入MintUI
import 'mint-ui/lib/style.css'
Vue.use(MintUI);
// 引入rem
// import rem from './assets/js/rem.js'
// Vue.use(rem);


//页面地址配置
import urlConfig from '@/api/url.config.js';
//设置全局baseUrl
Vue.prototype.baseApiUrl = urlConfig.baseApiUrl;
Vue.prototype.basePageUrl = urlConfig.basePageUrl;

import apiUrl from '@/api/url.js';
Vue.prototype.$http = apiUrl;


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
