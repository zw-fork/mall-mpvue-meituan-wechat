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
    type: -1,
    datas: []
  },
  currentOrder: {

  },
  orderDetail: {

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
  orderDetailDataMut(state, info) {
    state.orderDetail = info
  },
  currentOrderRemarkDataMut(state, info) {
    state.currentOrder.remark = info
  },
  changeOrderByIdDataMut(state, info) {
    state.orderDetail = info
  }
}

const actions = {
  getUserDataAction({state, commit}, {uid}) {
    getFetch('/wechat/' + uid, {}, false).then(response => {
      var user = response.result || {}
      commit('changeUserDataMut', user)
    })
  }, 
  getOrderDataAction({state, commit}, {uid, data}) {
    wx.showLoading({title: '加载中...', mask: true})
    getFetch('/order/' + uid, data, false).then(response => {
      var result = response.result || {}
      commit('changeOrderDataMut', result)
      wx.hideLoading()
    })
  },
  getOrderByIdAction({state, commit}, {uid, data}) {
    wx.showLoading({title: '加载中...', mask: true})
    getFetch('/order/' + uid + '/' + data.number, data, false).then(response => {
      var result = response.result || {}
      commit('changeOrderByIdDataMut', result)
      wx.hideLoading()
      wx.navigateTo({url: '/pages/shoppingCart/main?shopId=' + data.shopId + '&update=true'})
    })
  },
  updateOrderStatusAction({state, commit}, {order}) {
    wx.showLoading({title: '加载中...', mask: true})
    postFetch('/order/' + order.id + '/' + order.status, {}, false).then(response => {
      getFetch('/order/' + order.uid, {'page' : 1}, false).then(response => {
        var result = response.result || {}
        commit('changeOrderDataMut', result)
      }) 
      wx.hideLoading()
    })
  },
  postOrderDataAction({state, commit}, {order}) {
    var params = {'order': order}  
    postFetch('/order/' + order.uid, order, false).then(response => {
        var user = response.result || {}
        this.state.shoppingCart.shopInfo = {}
        state.orderDetail = {
          shopInfo : {}
        }
        commit('changeUserDataMut', user)
        getFetch('/order/' + order.uid, {'page' : 1}, false).then(response => {
          var result = response.result || {}
          commit('changeOrderDataMut', result)
        })          
        wx.switchTab({url: '/pages/orderList/main'})
      })
  },
  showOrderDetailAction({state, commit}, {order}) {
    commit('orderDetailDataMut', order)
    wx.navigateTo({url: '/pages/orderDetail/main'})
  },
  createOrderDetailAction({state, commit}, {order}) {
    order.remark = state.currentOrder.remark
    commit('currentOrderDataMut', order)
    wx.navigateTo({url: '/pages/submitOrder/main'})
  },
  addRemarkDataAction({state, commit}, {remark}) {
    commit('currentOrderRemarkDataMut', remark)
   // wx.navigateTo({url: '/pages/submitOrder/main'})
    wx.navigateBack()
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