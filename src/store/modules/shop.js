/** Created by guangqiang on 2018-09-27 17:32:35 */
import {getFetch, postFetch} from '@/network/request/HttpExtension'
const state = {
  shopList : []
}

const mutations = {
  changeShopListDataMut(state, info) {
    state.shopList = info
  }
}

const actions = {
  getShopListDataAction({state, commit}, {communityId}) {
    wx.showLoading({title: '加载中...', mask: true})
    getFetch('/shop/list/' + communityId, {}, false).then(response => {
      commit('changeShopListDataMut', response.result.list)
      wx.hideLoading()
      wx.switchTab({
        url: '/pages/home/main'
      })
    })
  },
  createCategory({state, commit}, {category}) {
    postFetch('/category/' + category.shopId, category, false).then(response => {
      return response.result
    })
  },
  createShop({state, commit}, {shop}) {
    postFetch('/shop', shop, false).then(response => {
      return response.result
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