/** Created by guangqiang on 2018-09-27 17:32:35 */
import { getFetch, postFetch } from '@/network/request/HttpExtension'
import { API_URL } from '@/constants/hostConfig'

const state = {
  shopList: []
}

const mutations = {
  changeShopListDataMut(state, info) {
    state.shopList = info
  }
}

const actions = {
  getShopListDataAction({ state, commit }, { communityId }) {
    wx.showLoading({ title: '加载中...', mask: true })
    getFetch('/shop/list/' + communityId, {}, false).then(response => {
      commit('changeShopListDataMut', response.result.list)
      wx.hideLoading()
      wx.switchTab({
        url: '/pages/home/main'
      })
    })
  },
  createCategory({ state, commit }, { category }) {
    postFetch('/category/' + category.shopId, category, false).then(response => {
      return response.result
    })
  },
  createShop({ state, commit }, { shop }) {
    var path = `${API_URL}`
    if (shop.wechat) {
      var sessionId = wx.getStorageSync('sessionId')
      wx.uploadFile({
        url: path + '/shop/upload', //仅为示例，非真实的接口地址
        filePath: shop.pic_url,
        name: 'file',
        header: {
          'Content-Type': 'application/json',
          'sessionId': sessionId
        },
        formData: {'shop' : JSON.stringify(shop)},
        success: function (res) {
          wx.navigateBack({ delta: 1 })
        }
      })
    } else {
      postFetch('/shop', shop, false).then(response => {
        wx.switchTab({
          url: '/pages/me/main'
        })
      })
    }
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