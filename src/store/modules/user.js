/** Created by guangqiang on 2018-09-27 17:32:35 */
import {postFetch} from '@/network/request/HttpExtension'
import { getUserInfoWechat } from "@/action/action";

const state = {
  userInfo: {
  }
}

const mutations = {
  changeUserInfoMut(state, info) {
    state.userInfo = info
  }
}

const actions = {
  getUserInfo({state, commit}, {jsonData}) {
    getUserInfoWechat(jsonData).then(response => { 
      commit('changeUserInfoMut', response.result)
      if (jsonData.shopId) {
        wx.redirectTo({
          url: '/pages/shoppingCart/main?shopId=' + jsonData.shopId
        })
      } else {
        wx.switchTab({
          url: '/pages/home/main'
        })
      }
    })
  },
  updateDefaultAddress({state, commit}, {wechat}) {
    var params = {'wechat': wechat}  
    postFetch('/wechat/updateDefaultAddress', wechat, false).then(response => {
        var user = response.result || {}
        commit('changeUserInfoMut', user)
        wx.navigateBack({delta: 1})
    })
  },
  wxLogin({state, commit}, {shopId}) {
    wx.login({
      success: function (res_login) {
        if (res_login.code){
            wx.getUserInfo({
              success:function(res){
                console.log(res)
                var jsonData = {
                  code: res_login.code,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  shopId: shopId
                };
                getUserInfoWechat(jsonData).then(response => { 
                  commit('changeUserInfoMut', response.result)
                  if (jsonData.shopId) {
                    wx.redirectTo({
                      url: '/pages/shoppingCart/main?shopId=' + jsonData.shopId
                    })
                  } else {
                    wx.switchTab({
                      url: '/pages/home/main'
                    })
                  }
                })
              }
            })
        }
      }
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