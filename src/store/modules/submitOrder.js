/** Created by guangqiang on 2018-09-28 23:17:03 */
import { getFetch, postFetch } from '@/network/request/HttpExtension'
import responseCode from '@/constants/responseCode'

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
  orderItemList: {
    page: 1,
    type: -1,
    datas: []
  },
  currentOrder: {

  },
  orderDetail: {

  },
  orderByShopIdDetail: {

  }
}

const mutations = {
  changeOrderDataMut(state, info) {
    state.orderList.datas = info.list
    state.orderList.page = info.nextPage
  },
  changeOrderItemDataMut(state, info) {
    state.orderItemList.datas = info.list
    state.orderItemList.page = info.nextPage
  },
  currentOrderDataMut(state, info) {
    state.currentOrder = info
    state.currentOrder.shopInfo.addressModel = info.shopInfo.addressModel || {}
  },
  orderDetailDataMut(state, info) {
    state.orderDetail = info
  },
  orderByShopIdDetailDataMut(state, info) {
    state.orderByShopIdDetail = info
  },
  currentOrderRemarkDataMut(state, info) {
    state.currentOrder.remark = info
  },
  changeOrderByIdDataMut(state, info) {
    state.orderDetail = info
  }
}

const actions = {
  getUserDataAction({ state, commit }, { uid }) {
    getFetch('/wechat/' + uid, {}, false).then(response => {
      var user = response.result || {}
      commit('changeUserDataMut', user)
    })
  },
  getOrderItemDataAction({ state, commit }, { uid, data }) {
    wx.showLoading({ title: '加载中...', mask: true })
    getFetch('/order', data, false).then(response => {
      var result = response.result || {}
      commit('changeOrderItemDataMut', result)
      wx.hideLoading()
    })
  },
  getOrderByIdAction({ state, commit }, {data }) {
    wx.showLoading({ title: '加载中...', mask: true })
    getFetch('/order/copy/' + data.number, data, false).then(response => {
      var result = response.result || {}
      commit('changeOrderByIdDataMut', result)
    //  wx.setStorageSync("cartList", result)
      wx.hideLoading()
      wx.navigateTo({ url: '/pages/shoppingCart/main?shopId=' + data.shopId + '&update=true' })
    })
  },
  updateOrderStatusAction({ state, commit }, { order, status, selectStatus, refundStatus }) {
    wx.showLoading({ title: '加载中...', mask: true })
    var data = { 'page': 1, 'status': selectStatus }
    var refund = {};
    if (!selectStatus) {
      data = { 'page': 1 }
    }
    if (refundStatus) {
      refund.refundStatus = refundStatus
    }
    refund.status = status
    refund.openid = order.uid
    if (order.status == 1 && status == 2) {
      getFetch('/wxPay/unifiedOrder/' + order.number, { shopName: order.shopInfo.communityName + '-' + order.shopInfo.shopName }, false).then(response => {
        if (response.code == 200) {
          wx.requestPayment({
            timeStamp: response.result.timeStamp,
            nonceStr: response.result.nonceStr,
            package: response.result.packages,
            signType: response.result.signType,
            paySign: response.result.paySign,
            success(res) {
              wx.showToast({
                title: '支付成功!',
                icon: 'success',
                duration: 3000
              })
              getFetch('/order/updateStatus/' + order.number, { status: 2 }, false).then(response => {
                getFetch('/order', {}, false).then(response => {
                  var result = response.result || {}
                  commit('changeOrderDataMut', result)
                  wx.hideLoading()
                })
              })
            },
            fail(res) {
              wx.hideLoading()
            }
          })
        } else if (response.code == responseCode.ORDERPAID_ERROR_CODE) {
          wx.showToast({
            title: response.message,
            icon: 'none',
            duration: 2000
          })
          getFetch('/order/updateStatus/' + order.number, { status: 2 }, false).then(response => {
            getFetch('/order', {}, false).then(response => {
              var result = response.result || {}
              commit('changeOrderDataMut', result)
              wx.hideLoading()
            })
          })
        }
      })
    } else {
      getFetch('/order/updateStatus/' + order.number, refund, false).then(response => {
        getFetch('/order', data, false).then(response => {
          var result = response.result || {}
          commit('changeOrderDataMut', result)
        })
        wx.hideLoading()
      })
    }
  },
  postOrderDataAction({ state, commit }, { order }) {
    wx.showLoading({ title: '加载中...', mask: true })
    postFetch('/order', order, false).then(response => {
      // 清空购物车缓存
      this.state.shoppingCart.shopInfo = {}
      state.orderDetail = {
        shopInfo: {}
      }
      var number = response.result.number
      getFetch('/wxPay/unifiedOrder/' + number, { shopName: order.shopInfo.wxAddress.name + '-' + order.shopInfo.shopName }, false).then(response => {
        wx.requestPayment({
          timeStamp: response.result.timeStamp,
          nonceStr: response.result.nonceStr,
          package: response.result.packages,
          signType: response.result.signType,
          paySign: response.result.paySign,
          success(res) {
            wx.showToast({
              title: '支付成功!',
              icon: 'success',
              duration: 3000
            })
            getFetch('/order/updateStatus/' + number, { status: 2 }, false).then(response => {
              getFetch('/order', {}, false).then(response => {
                var result = response.result || {}
                commit('changeOrderDataMut', result)
                wx.switchTab({ url: '/pages/orderList/main' })
              })
            })
          },
          fail(res) {
            wx.showToast({
              title: '取消支付!',
              icon: 'none',
              duration: 3000
            })
            getFetch('/order', { 'page': 1 }, false).then(response => {
              var result = response.result || {}
              commit('changeOrderDataMut', result)
            })
            wx.switchTab({ url: '/pages/orderList/main' })
          }
        })
        wx.hideLoading()
      })
    })
  },
  showOrderDetailAction({ state, commit }, { order }) {
    commit('orderDetailDataMut', order)
    wx.navigateTo({ url: '/pages/orderDetail/main' })
  },
  showOrderByShopIdDetailAction({ state, commit }, { order }) {
    commit('orderByShopIdDetailDataMut', order)
    wx.navigateTo({ url: '/pages/orderItemDetail/main' })
  },
  createOrderDetailAction({ state, commit }, { order }) {
    order.remark = state.currentOrder.remark
    commit('currentOrderDataMut', order)
    wx.navigateTo({ url: '/pages/submitOrder/main' })
  },
  addRemarkDataAction({ state, commit }, { remark }) {
    commit('currentOrderRemarkDataMut', remark)
    wx.navigateBack()
  },
  refundDataAction({ state, commit }, { orderNo, refundDesc, refundFee }) {
    getFetch('/wxPay/refund', { 'orderNo': orderNo, 'refundDesc': refundDesc, 'refundFee': refundFee }, false).then(response => {
      var result = response.result || {}
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        status: -1
      });
      wx.navigateBack({ delta: 1 });
    })
  }
}

const getters = {

}

export default {
  state,
  mutations,
  actions,
  getters
}