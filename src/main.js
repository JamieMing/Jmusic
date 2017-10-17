// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './common/stylus/index.styl'
import VueLazyLoad from 'vue-lazyload'
import Vuebar from 'vuebar';
Vue.use(Vuebar);
Vue.config.productionTip = true
Vue.use(VueLazyLoad, {
  loading: require('./common/image/default.jpg')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
