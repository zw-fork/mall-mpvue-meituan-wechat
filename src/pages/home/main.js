/** Created by guangqiang on 2018-09-14 20:16:03 */
import Vue from 'vue'
import App from '.'
import store from '@/store'

const app = new Vue({
    store,
    ...App
  })
app.$mount()




