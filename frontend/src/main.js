import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import App from './App'
import store from './config/store'
import router from './config/router'

import './config/axios'
import './config/bootstrap'
import './config/msgs'
import './config/mq'

Vue.config.productionTip = false


new Vue({
  router: router,
  store: store,
  render: h => h(App)
}).$mount('#app')