/** Created by guangqiang on 2018-09-28 23:17:03 */
import {formatYMD} from '@/utils/formatTime'
import {_array} from '@/utils/arrayExtension'
import {shoppingCart} from '@/pages/shoppingCart/data'
import {deepClone} from '@/utils/deepClone'
import {getFetch, postFetch} from '@/network/request/HttpExtension'
const state = {
  result: {},
  order: {
    shopInfo: {},
    OrderItemModel: []
  },
  currentOrder: {

  }
}

const mutations = {
  changeUserDataMut(state, info) {
    state.user = info
  },
  changeOrderDataMut(state, info) {
    state.result = info
  },
  currentOrderDataMut(state, info) {
    state.currentOrder = info
  },
  currentOrderRemarkDataMut(state, info) {
    state.currentOrder.remark = info
  }
}

const actions = {
  getUserDataAction({state, commit}) {
    getFetch('/wechat/oE7971YVuGnNbxnL3Fc-26Y5SdLA1231', {}, false).then(response => {
      var user = response.result || {}
      commit('changeUserDataMut', user)
    })
  }, 
  getOrderDataAction({state, commit}) {
    getFetch('/order/oE7971YVuGnNbxnL3Fc-26Y5SdLA1231', {}, false).then(response => {
      var result = response.result || {}
      commit('changeOrderDataMut', result)
    })
  },
  postOrderDataAction({state, commit}, {order}) {
    var params = {'order': order}  
    postFetch('/order/oE7971YVuGnNbxnL3Fc-26Y5SdLA1231', order, false).then(response => {
        var user = response.result || {}
        commit('changeUserDataMut', user)
      })
  },
  showOrderDetailAction({state, commit}, {order}) {
    commit('currentOrderDataMut', order)
    wx.navigateTo({url: '/pages/orderDetail/main'})
  },
  createOrderDetailAction({state, commit}, {order}) {
    commit('currentOrderDataMut', order)
    wx.navigateTo({url: '/pages/submitOrder/main'})
  },
  addRemarkDataAction({state, commit}, {remark}) {
    commit('currentOrderRemarkDataMut', remark)
    wx.navigateTo({url: '/pages/submitOrder/main'})
  }
 // this.getCategoryMenuDataAction({categoryId, index})
}

const getters = {

}

export default {
  state,
  mutations,
  actions,
  getters
}