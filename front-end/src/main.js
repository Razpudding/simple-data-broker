import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from './router'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
