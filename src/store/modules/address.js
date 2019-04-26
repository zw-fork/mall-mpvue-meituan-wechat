/** Created by guangqiang on 2018-09-27 17:32:35 */
import {formatYMD} from '@/utils/formatTime'
import {_array} from '@/utils/arrayExtension'
import {shoppingCart} from '@/pages/shoppingCart/data'
import {deepClone} from '@/utils/deepClone'
import {getFetch} from '@/network/request/HttpExtension'
const state = {
  myAddress: []
}

const mutations = {
  changeMyAddressDataMut(state, info) {
    state.myAddress = info
  }
}

const actions = {
  getAddressDataAction({state, commit}) {
    getFetch('/address/1', {}, false).then(response => {
      var addressList = response.result.list || {}
      commit('changeMyAddressDataMut', addressList)
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