<template id="dialog">
  <div class="modalMask" v-if="isModel">
    <div class="modalDialog">
      <div class="modalContent">
        <p class="contentTip">应用需进行微信授权!</p>    
      </div>
      <div class="modalFooter">
        <button style="width:100%; margin:0 auto;" class="btnConfirm" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">确定</button>
      </div>
    </div>
  </div>
</template>

<script>

import { getCityLocation,getOpenidWechat,getUserInfoWechat } from "@/action/action";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

 export default {
  data() {
    return {
      shopId: undefined,
      isModel: false,
      motto: "Hello World",
      userInfo: {}
    };
  },
  methods: {
    ...mapActions("user", ["getUserInfo", "wxLogin"]),

    bindGetUserInfo: function(e) {
      var that = this
      if (e.target.userInfo){
        this.isModel = false
        that.wxLogin({shopId: that.shopId})
      }
    },
    login() {
      this.wxLogin({shopId: this.shopId})
    },
    clickHandle(msg, ev) {
      console.log("clickHandle:", msg, ev);
    },
  },
  onLoad(options) 
  {
    this.shopId=options.shopId;
    var addWorker = options.addWorker;
    var that = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          that.wxLogin({shopId: that.shopId, 'addWorker' : addWorker})
        } 
        else {
          that.isModel = true
        }
      }
    })
  }
};
</script>

<style lang="scss" scoped>
.modalMask {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: #000;
      opacity: 0.5;
      overflow: hidden;
      z-index: 9000;
      color: #fff;
    }
    .modalDialog {
      box-sizing: border-box;
      width: 260px;
      // height: 330px;
      overflow: hidden;
      position: fixed;
      top: 60%;
      left: 0;
      z-index: 9999;
      background: #fff;
      margin: -180px 120rpx;
      border-radius: 8px;
      .modalContent {
        box-sizing: border-box;
        display: flex;
        padding: 20px 23px;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .contentTip{
          text-align: center;
          font-size: 20px;
          color: #333333;
        }
      }
      .modalFooter {
        display: flex;
        height: 50px;
        border-top: 1px solid #E5E5E5;
        line-height: 50px;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      .btnConfirm {
        font-size: 20px;
        color: #508CEE;
      }
    }

</style>
