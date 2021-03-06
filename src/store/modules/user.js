/** Created by guangqiang on 2018-09-27 17:32:35 */
import { postFetch, getFetch } from '@/network/request/HttpExtension'
import { API_URL, APP_ID } from '@/constants/hostConfig'

const state = {
  userInfo: {}
}

const mutations = {
  changeUserInfoMut(state, info) {
    getApp().globalData.userInfo = info;
    state.userInfo = info
  }
}

const actions = {
  updateDefaultAddress({ state, commit }, { wechat }) {
    var params = { 'wechat': wechat }
    postFetch('/wechat/updateDefaultAddress', wechat, false).then(response => {
      var user = response.result || {}
      commit('changeUserInfoMut', user)
      wx.navigateBack({ delta: 1 })
    })
  },
  wxLocation({ state, commit }) { //获取用户的当前设置
    const _this = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      //  _this.goAddress();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              wx.openLocation({
                latitude: res.latitude,
                longitude: res.longitude,
                scale: 18,
                success: function (res) {
                  wx.chooseLocation({
                    success: function (res) {
                      console.log(res)
                    }
                  })
                }
              })
            }
          })
        }
        else {
          // console.log('授权成功')
          //调用wx.getLocation的API
          wx.showToast({
            title: '授权成功A',
            icon: 'success',
            duration: 1000
          })
          wx.chooseLocation({
            success: function (res) {
              console.log(res)
            }
          })
        }
      }
    })
  },
  wxLocation2({ state, commit }) {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.openLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 18,
          success: function (res) {
            wx.chooseLocation({
              success: function (res) {
                console.log(res)
              }
            })
          }
        })
      }
    })
  },

  uploadImg({ state, commit }, { goodsModel }) {
    var path = `${API_URL}`
    goodsModel.goodsPrice = goodsModel.min_price
    if (goodsModel.wechat) {
      var sessionId = wx.getStorageSync('sessionId')
      wx.uploadFile({
        url: path + '/goods/upload', //仅为示例，非真实的接口地址
        filePath: goodsModel.picture,
        name: 'file',
        header: {
          'Content-Type': 'application/json',
          'sessionId': sessionId
        },
        formData: goodsModel,
        success: function (res) {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            update: true,
          });
          wx.navigateBack({ delta: 1 })
        },
        fail: function (res) {
          
        }
      })
    } else {
      postFetch('/goods/upload2', goodsModel, true).then(response => {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
          update: true,
        });
        wx.navigateBack({ delta: 1 })
      })
    }
  },
  getPhoneNumber({ state, commit }, { target }) {
    getFetch('/wechat/userPhone', target, false).then(response => { })
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