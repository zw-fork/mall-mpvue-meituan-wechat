/** Created by guangqiang on 2018-09-27 17:32:35 */
import {getFetch,postFetch} from '@/network/request/HttpExtension'
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
    getFetch('/address', {}, false).then(response => {
      var addressList = response.result.list || {}
      commit('changeMyAddressDataMut', addressList)
    })
  },
  deleteUserAddressDataAction({state, commit}, {addressId}) {
    debugger
    getFetch('/address/delete/' + addressId, {}, false).then(response => {
      for (var index in state.myAddress) {
        if (addressId == state.myAddress[index].id) {
          state.myAddress.splice(index,1)
          break;
        }
      }
    })
  },
  saveOrUpdateAddress({state, commit}, {addressModel}) {
    postFetch('/address/save', addressModel, false).then(response => {
      getFetch('/address', {}, false).then(response => {
        var addressList = response.result.list || {}
        commit('changeMyAddressDataMut', addressList)
        wx.navigateBack()
      })
    })
  },
}

const getters = {

}

export default {
  state,
  mutations,
  actions,
  getters
}