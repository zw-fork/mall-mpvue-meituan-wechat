/** Created by guangqiang on 2018-09-17 23:39:29 */
import Vue from 'vue'
import App from './index'
import store from '@/store'

const app = new Vue({
    store,
    ...App
  })
app.$mount()