// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import config from './config'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import './assets/material.css'
import './http';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import uploader from 'vue-simple-uploader'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(uploader)

// 设置主题
Vue.use(Vuetify, { theme: config.theme})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
