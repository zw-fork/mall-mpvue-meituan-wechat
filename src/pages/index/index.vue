<template id="dialog">
  <div class="container">
  </div>
</template>

<script>
import {
  getCityLocation,
  getOpenidWechat
} from "@/action/action";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      shopId: undefined,
      motto: "Hello World",
      userInfo: {},
      isModel: undefined
    };
  },
  methods: {
    ...mapActions("user", ["getUserInfo", "wxLogin"]),

    bindGetUserInfo: function(e) {
      var that = this;
      if (e.target.userInfo) {
        this.isModel = false;
        that.wxLogin({ shopId: that.shopId });
      }
    },
    login() {
      this.wxLogin({ shopId: this.shopId });
    },
    clickHandle(msg, ev) {
      console.log("clickHandle:", msg, ev);
    }
  },
  onLoad(options) {
    if (options.scene) {
      wx.redirectTo({
          url: "/pages/shoppingCart/main?shopId=" + options.scene
      });
    } else {
      wx.switchTab({
        url: '/pages/home/main'
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
.login-box {
  width: 100%;
  height: auto;
  overflow: hidden;
  margin-top: 200rpx;
}

.wx-login-btn {
  margin: 60rpx 0 40rpx 0;
  height: 96rpx;
  line-height: 96rpx;
  font-size: 30rpx;
  border-radius: 6rpx;
  width: 90%;
  color: #fff;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: flex;
  bottom: 0;
  left: 0;
  padding: 0;
  margin-left: 5%;
  text-align: center;
  /* padding-left: -5rpx; */
  border-top-left-radius: 50rpx;
  border-bottom-left-radius: 50rpx;
  border-top-right-radius: 50rpx;
  border-bottom-right-radius: 50rpx;
  letter-spacing: 3rpx;
}

.account-login-btn {
  width: 90%;
  margin: 0 auto;
  color: #fff;
  font-size: 30rpx;
  height: 96rpx;
  line-height: 96rpx;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: flex;
  bottom: 0;
  left: 0;
  border-radius: 0;
  padding: 0;
  margin-left: 5%;
  text-align: center;
  /* padding-left: -5rpx; */
  border-top-left-radius: 50rpx;
  border-bottom-left-radius: 50rpx;
  border-top-right-radius: 50rpx;
  border-bottom-right-radius: 50rpx;
  letter-spacing: 3rpx;
  background-image: linear-gradient(to right, #9a9ba1 0%, #9a9ba1 100%);
}
</style>
