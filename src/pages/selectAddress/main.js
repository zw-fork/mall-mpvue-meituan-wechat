/** Created by guangqiang on 2018-09-19 10:21:37 */
import Vue from 'vue'
import App from './index'
import store from '@/store'

const app = new Vue({
    store,
    ...App
  })
app.$mount()