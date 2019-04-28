/** Created by guangqiang on 2018-09-27 17:32:35 */
import {formatYMD} from '@/utils/formatTime'
import {_array} from '@/utils/arrayExtension'
import {shoppingCart} from '@/pages/shoppingCart/data'
import {deepClone} from '@/utils/deepClone'
import {getFetch} from '@/network/request/HttpExtension'
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
      wx.switchTab({
        url: '/pages/home/main'
      })
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