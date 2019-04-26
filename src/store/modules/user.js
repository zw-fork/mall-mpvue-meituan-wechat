/** Created by guangqiang on 2018-09-27 17:32:35 */
import {formatYMD} from '@/utils/formatTime'
import {_array} from '@/utils/arrayExtension'
import {shoppingCart} from '@/pages/shoppingCart/data'
import {deepClone} from '@/utils/deepClone'
import {getFetch} from '@/network/request/HttpExtension'
const state = {
  user: {
    addressModel: {}
  }
}

const mutations = {
  changeUserDataMut(state, info) {
    state.user = info
  }
}

const actions = {
  getUserDataAction({state, commit}) {
    getFetch('/wechat/oE7971YVuGnNbxnL3Fc-26Y5SdLA1231', {}, false).then(response => {
      var user = response.result || {}
      commit('changeUserDataMut', user)
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