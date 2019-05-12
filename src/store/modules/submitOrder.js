/** Created by guangqiang on 2018-09-28 23:17:03 */
import {getFetch, postFetch} from '@/network/request/HttpExtension'
const state = {
  result: {},
  order: {
    shopInfo: {},
    OrderItemModel: []
  },
  orderList: {
    page: 1,
    datas: []
  },
  currentOrder: {

  }
}

const mutations = {
  changeUserDataMut(state, info) {
    state.user = info
  },
  changeOrderDataMut(state, info) {
    state.orderList.datas = info.list
    state.orderList.page = info.nextPage
  },
  currentOrderDataMut(state, info) {
    state.currentOrder = info
  },
  currentOrderRemarkDataMut(state, info) {
    state.currentOrder.remark = info
  }
}

const actions = {
  getUserDataAction({state, commit}, {uid}) {
    getFetch('/wechat/' + uid, {}, false).then(response => {
      var user = response.result || {}
      commit('changeUserDataMut', user)
    })
  }, 
  getOrderDataAction({state, commit}, {uid, page}) {
    getFetch('/order/' + uid, {'page' : page}, false).then(response => {
      var result = response.result || {}
      commit('changeOrderDataMut', result)
    })
  },
  postOrderDataAction({state, commit}, {order}) {
    var params = {'order': order}  
    postFetch('/order/' + order.uid, order, false).then(response => {
        var user = response.result || {}
        commit('changeUserDataMut', user)
        getFetch('/order/' + order.uid, {'page' : 1}, false).then(response => {
          var result = response.result || {}
          commit('changeOrderDataMut', result)
          this.state.shoppingCart.shopInfo = {}
          wx.switchTab({
            url: '/pages/orderList/main'
          })
        })
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