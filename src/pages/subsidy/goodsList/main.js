/** Created by guangqiang on 2018-09-18 20:01:30 */
import Vue from 'vue'
import App from './index'
import store from '@/store'

const app = new Vue({
  store,
  ...App
})
app.$mount()