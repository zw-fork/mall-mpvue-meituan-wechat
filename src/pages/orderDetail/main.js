/** Created by guangqiang on 2018-09-19 20:13:22 */

import Vue from 'vue'
import App from './index'

import store from '@/store'

const app = new Vue({
  store,
  ...App
})
app.$mount()