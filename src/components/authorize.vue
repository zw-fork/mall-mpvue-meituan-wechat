<template>
  <div class="container" v-if="show">
      <div class='Popup' v-if="showPopup">
        <img :src='logo_url'/>
        <div class='title'>授权提醒</div>  
        <div class='tip'>请授权微信登录，以便为您提供更好的服务</div>
        <div class='bottom flex modalFooter'>
          <button style="background-color:#333" class='item grant on'  type="primary" lang="zh_CN" @click="closeLogin">取消</button>
          <button class='item grant on'  type="primary" open-type="getUserInfo" lang="zh_CN" @getuserinfo="bindGetUserInfo">登录</button>
        </div>
    </div>
    <div class='mask' v-if="show" catchtouchmove="true" bindtap='close'></div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { API_URL, APP_ID } from '@/constants/hostConfig'
import { getUserInfoWechat } from "@/action/action";
import { getFetch } from "@/network/request/HttpExtension";

export default {
  name: "authorize",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: 'abc'
    },
    price: {
      type: Number,
      default: null
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      shopId: undefined,
      showPopup: false
    };
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    ...mapState("shoppingCart", ["shopInfo"])
    },
  methods: {
    ...mapMutations("user", ["changeUserInfoMut"]),
    getUserInfo(shopId) {
      this.shopId = shopId;
      var that = this;
      if (this.userInfo.id) {
        this.showPopup = false;
        this.$emit('func',false)        
      } else {
       var d = new Promise(function (resolve, reject) {
      wx.getSetting({
        success: function(res) {
          if (res.authSetting["scope.userInfo"]) {
            that.login();
          } else {
            that.showPopup = true;
            that.$emit('func',true)
            resolve("err")
          }
        }
      });
      })
      return d;       
      }

  },
  login(){
          var that = this;
            wx.login({
          success: function (res_login) {
            if (res_login.code) {
              var appid = `${APP_ID}`
              wx.getUserInfo({
                success: function (res) {
                  var jsonData = {
                    code: res_login.code,
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    appid: appid
                  };
                  if (that.shopId) {
                    jsonData.shopId = that.shopId
                  }
                  getUserInfoWechat(jsonData).then(response => {
                    wx.setStorageSync("sessionId", response.result.token)
                    that.changeUserInfoMut(response.result)
                    if (that.shopInfo && that.shopInfo.wxAddress) {
                      getFetch("/address/defaultAddress",
                      { addressName: that.shopInfo.wxAddress.name }, true).then(response => {
                        that.showPopup = false;
                        that.shopInfo.addressModel = response.result || {}
                        that.$emit('func',false, that.shopInfo.addressModel)
                      }); 
                    } else {
                    that.$emit('func',false, {})
                    }
                  })
                }
              })
            }
          }
        })
  },
    bindGetUserInfo: function(e) {
      if (e.target.userInfo) {
        this.login();
      }
    },
    close() {
      this.show = false
    },
    closeLogin() {
      var page = getCurrentPages();
      if (page.length==1) {
        this.$emit('func',false)
      } else {
        wx.navigateBack({ delta: 1 })
      }
    }
  },
  onShow(options) {
    if (this.userInfo.id && this.showPopup) {
        this.showPopup = false;
        this.$emit('func',false)
    }
  }
}
</script>

<style lang="scss" scoped>
.modalFooter {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  height: 80rpx;
  border-top: 1rpx solid #e5e5e5;
  font-size: 26rpx;
  background-color: #f4f4f4;
  line-height: 80rpx;
}
.Popup{
  width:500rpx;
  background-color:#fff;
  position:fixed;
  top:50%;
  left:50%;
  margin-left:-250rpx;
  transform:translateY(-50%);
  z-index:1001;
}
.Popup img{width:150rpx;height:150rpx;margin:-67rpx auto 0 auto;display:block;border: 8rpx solid #fff;border-radius: 50%}
.Popup .title{font-size:28rpx;color:#000;text-align:center;margin-top: 30rpx}
.Popup .tip{font-size:22rpx;color:#555;padding:0 24rpx;margin-top:25rpx;}
.Popup .bottom .item{width:50%;height:80rpx;background-color:#eeeeee;text-align:center;line-height:80rpx;font-size:24rpx;color:#666;margin-top:54rpx;}
.Popup .bottom .item.on{width: 100%}
.Popup .bottom .item.grant{font-size:28rpx;color:#fff;font-weight:bold;background-color:#e93323;border-radius:0;padding:0;}
.mask{position:fixed;top:0;right:0;left:0;bottom:0;background-color:rgba(0,0,0,0.65);z-index:1000;}

.container {
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.15);
  position: absolute;
}
</style>
