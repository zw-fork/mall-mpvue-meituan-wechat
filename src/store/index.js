/** Created by guangqiang on 2018-06-29 10:26:46 */

import Vue from 'vue'
import Vuex from 'vuex'
import shoppingCart from './modules/shoppingCart'
import address from './modules/address'
import user from './modules/user'
import submitOrder from './modules/submitOrder'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    shoppingCart: {
      namespaced: true,
      ...shoppingCart
    },
    address: {
      namespaced: true,
      ...address
    },
    user: {
      namespaced: true,
      ...user
    },
    submitOrder: {
      namespaced: true,
      ...submitOrder
    }
  }
})

export default store