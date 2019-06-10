<template>
  <div class="container">
    <div class="header-c">
      <div class="tab-c">
        <div class="left" :style="{'background-color': tabIndex === 0 ? '#fff' : '#F8F8F8', 'font-weight': tabIndex === 0 ? 'bold' : ''}" @click="deliveryClick">小区配送</div>
      </div>
      <div class="delivery" v-if="tabIndex === 0">
        <div class="address-c" @click="addressClick(currentOrder.shopInfo.communityId)">
          <i class="icon mt-location-s"></i>
          <div class="address">
             <span class="address-info" v-if="!userInfo.addressModel.house_number || userInfo.addressModel.communityId != currentOrder.shopInfo.communityId">请添加配送地址...</span>
            <span class="address-info" v-if="userInfo.addressModel.house_number && userInfo.addressModel.communityId == currentOrder.shopInfo.communityId">{{userInfo.addressModel.address}} {{userInfo.addressModel.house_number}}</span>
            <span class="user-info" v-if="userInfo.addressModel.name && userInfo.addressModel.communityId == currentOrder.shopInfo.communityId">{{userInfo.addressModel.name}} {{userInfo.addressModel.gender == 1? '先生' : '女士'}}  {{userInfo.addressModel.phone}}</span>
          </div>
          <i class="icon iconfont iconright" :style="{fontSize: 32 + 'rpx'}"></i>
        </div>
      </div>
    </div>
    <div class="item-list">
      <div class="section">
        <img :src="currentOrder.shopInfo.pic_url" >
        <span @click="goShop">{{currentOrder.shopInfo.shopName}}</span>
        <i class="icon iconfont iconright" style="display: inline"></i>
      </div>
      <div class="list">
        <div class="item" v-for="(item, index) in currentOrder.itemList" :key="index">
          <img :src="path + item.picture">
          <div class="item-r">
            <div class="r-t">
              <span>{{item.name}}</span>
              <span>￥{{item.totalPrice}}</span>
            </div>
            <span>x{{item.sequence}}</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="delivery-cast">
          <span>配送费</span>
          <span>￥{{deliveryFee}}</span>
        </div>
        <sep-line></sep-line> 
        <div class="totle-price">
          <span class="m">小计</span>
          <span class="r">￥{{realFee}}</span>
        </div>
      </div>
    </div>
    <div class="bottom-c">
      <div class="b-mid" @click="remarkClick">
        <span class="mid-l">备注</span>
        <div class="mid-r">
          <span>{{currentOrder.remark? currentOrder.remark:'请输入口味、偏好等要求'}}</span>
          <i class="icon iconfont iconright"></i>
        </div>
      </div>
    </div>
    <button class="pay-btn" open-type="getPhoneNumber" @getphonenumber="bindPhoneNumber">
      <div class="top">
        <span class="s-l">微信支付</span>
        <span class="s-m">￥{{realFee}}</span>
      </div>
    </button>
  </div>
</template>

<script>
import sepLine from "@/components/sep-line";
import {orderData} from './data'
import {openLocation} from '@/utils/wxapi'
import {mapState, mapMutations, mapActions, mapGetters} from "vuex"
import {GOODS_URL_PREFIX} from '@/constants/hostConfig'

export default {
  data() {
    return {
      order : {},
      itemData: {},
      addressInfo: {},
      itemList: [],
      tabIndex: 0
    }
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    ...mapState("submitOrder", ["currentOrder"]),
    path() {
      return `${GOODS_URL_PREFIX}`
    },
    deliveryFee() {
      return this.currentOrder.shopInfo.support_pay
    },
    realFee() {
      var totalPrice = 0 
      this.currentOrder.itemList.map(item => totalPrice += parseFloat(item.totalPrice))
      return (parseFloat(totalPrice) +  this.currentOrder.shopInfo.support_pay).toFixed(2)
    }
  },
  components: {
    sepLine
  },
  methods: {
    ...mapActions("submitOrder", ["postOrderDataAction", "getOrderDataAction"]),
    ...mapActions("user", ["updateDefaultAddress", "getPhoneNumber"]),
    bindPhoneNumber(e) {
      var target = e.target
      target.openid = this.userInfo.openid
      this.getPhoneNumber({target})
      
    },
    addressClick(communityId) {
      wx.navigateTo({url: '/pages/addressList/main?communityId=' + communityId})
    },
    redPacketClick() {
      wx.navigateTo({url: '/pages/redPacket/main'})
    },
    couponClick() {
      wx.navigateTo({url: '/pages/couponList/main'})
    },
    remarkClick() {
      wx.navigateTo({url: '/pages/remark/main'})
    },
    goShop() {
      var shopId = this.currentOrder.shopInfo.shopId
      wx.navigateTo({
          url: '/pages/shoppingCart/main?shopId=' + shopId
      })
    },
    deliveryClick() {
      this.tabIndex = 0;
    },
    pickClick() {
      this.tabIndex = 1;
    },
    protocol() {
      wx.navigateTo({url: '/pages/pickProtocol/main'})
    },
    openMap() {
      wx.getLocation({
        type: 'gcj02',
        success (res) {
          const latitude = res.latitude
          const longitude = res.longitude
          wx.openLocation({
            latitude,
            longitude,
            scale: 28
          })
        }
      })
    },
    payClick() {
      if (this.userInfo.addressModel.address) {
        this.currentOrder.deliveryFee = this.deliveryFee
        this.currentOrder.addressInfo = this.userInfo.addressModel
        this.currentOrder.realFee = this.realFee
        this.currentOrder.uid = this.userInfo.openid
        var wechat = {}
        wechat.openid = this.userInfo.openid
        wechat.addressModel = {}
        wechat.addressModel.id = this.userInfo.addressModel.id
        this.postOrderDataAction({order : this.currentOrder})
      } else {
        wx.showToast({
        title: '请填写配送地址!',
        icon: 'none',
        duration: 1500
      })
      }  
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  background-color: #F9F9F9;
  .header-c {
    display: flex;
    flex-direction: column;
    margin: 20rpx;
    background-color: white;
    .tab-c {
      display: flex;
      height: 88rpx;
      align-items: center;
      background-color: white;
      .left {
        align-items: center;
        justify-content: center;
        display: flex;
        flex: 1;
        font-size: 32rpx;
        color: $textBlack-color;
        height: 88rpx;
      }
      .right {
        @extend .left;
        background-color: $page-bgcolor;
      }
    }
    .delivery {
      display: flex;
      background-color: white;
      flex-direction: column;
      .address-c {
        display: flex;
        background-color: white;
        padding: 20rpx 0;
        i {
          font-size: 36rpx;
          margin: 20rpx;
          color: #434343;
        }
        .address {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          flex: 1;
          .address-info {
            font-size: 32rpx;
            color: $textBlack-color;
          }
          .user-info {
            font-size: 24rpx;
            color: $textDarkGray-color;
          }
        }
      }
      .line-sp {
        height: 2rpx;
        background-color: $spLine-color;
        flex: 1;
        margin: 0 20rpx;
      }
      .delivery-time {
        display: flex;
        align-items: center;
        background-color: white;
        padding: 0 20rpx;
        i {
          font-size: 28rpx;
          color: $textBlack-color;
        }
        .content {
          display: flex;
          align-items: center;
          flex: 1;
          margin: 20rpx;
          .c-l {
            font-size: 32rpx;
            color: $textBlack-color;
          }
          .c-r {
            font-size: 24rpx;
            color: #5584E2;
            margin-left: 20rpx;
          }
        }
      }
    }
    .pick {
      display: flex;
      flex-direction: column;
      background-color: white;
      padding: 30rpx;
      .title {
        font-size: 28rpx;
        color: $textBlack-color;
      }
      .address {
        font-size: 36rpx;
        color: $textBlack-color;
        font-weight: bold;
        margin-top: 10rpx;
      }
      .map {
        display: flex;
        align-items: center;
        margin-top: 20rpx;
        .distance {
          font-size: 28rpx;
          color: #000;
        }
        .line {
          width: 2rpx;
          height: 20rpx;
          background-color: $textGray-color;
          margin: 0 16rpx;
        }
        .btn {
          font-size: 28rpx;
          color: #2F84E9;
        }
      }
      .time {
        display: flex;
        align-items: center;
        border-top: 2rpx solid $spLine-color;
        border-bottom: 2rpx solid $spLine-color;
        margin: 30rpx 0;
        height: 140rpx;
        .l {
          display: flex;
          flex-direction: column;
          flex: 1;
          .l-t {
            font-size: 24rpx;
            color: $textDarkGray-color;
          }
          .l-b {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 10rpx;
            span {
              font-size: 24rpx;
              color: #000;
            }
            i {
              font-size: 28rpx;
              color: $textGray-color;
              margin-left: 10rpx;
            }
          }
        }
        .line {
          width: 2rpx;
          height: 100rpx;
          background-color: $spLine-color;
        }
        .r {
          display: flex;
          flex-direction: column;
          flex: 1;
          margin-left: 30rpx;
          .r-t {
            font-size: 24rpx;
            color: $textDarkGray-color;
          }
          .r-b {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 10rpx;
            span {
              font-size: 24rpx;
              color: #000;
            }
            i {
              font-size: 28rpx;
              color: $textGray-color;
              margin-left: 10rpx;
            }
          }
        }
      }
      .protocol {
        display: flex;
        align-items: center;
        i {
          font-size: 36rpx;
          color: $theme-color;
        }
        span {
          font-size: 28rpx;
          color: $textBlack-color;
          margin-left: 30rpx;
        }
        text {
          font-size: 28rpx;
          color: #626381;
        }
      }
    }
  }
  .item-list {
    display: flex;
    flex-direction: column;
    margin: 0 20rpx;
    background-color: white;
    .section {
      display: flex;
      align-items: center;
      align-items: center;
      height: 88rpx;
      padding: 0 20rpx;
      img {
        width: 40rpx;
        height: 40rpx;
        border-radius: 20rpx;
      }
      span {
        font-size: 28rpx;
        color: $textDarkGray-color;
        flex: 1;
        margin-left: 20rpx;
      }
      text {
        color: $textBlack-color;
        font-size: 20rpx;
        padding: 3rpx 6rpx;
        border: 2rpx solid $textBlack-color;
      }
    }
    .list {
      display: flex;
      flex-direction: column;
      background-color: white;
      .item {
        display: flex;
        height: 120rpx;
        flex: 1;
        background-color: $page-bgcolor;
        margin-bottom: 10rpx;
        padding-top: 20rpx;
        img {
          width: 100rpx;
          height: 100rpx;
          margin-left: 20rpx;
        }
        .item-r {
          display: flex;
          flex: 1;
          flex-direction: column;
          margin: 0 20rpx;
          .r-t {
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
              font-size: 28rpx;
              color: $textBlack-color;
            }
          }
          span {
            font-size: 20rpx;
              color: $textDarkGray-color;
          }
        }
      }
    }
    .footer {
      display: flex;
      flex-direction: column;
      background-color: white;
      .fold {
        display: flex;
        align-self: center;
        align-items: center;
        justify-content: center;
        padding: 6rpx;
        margin-top: 30rpx;
        border: 2rpx solid $spLine-color;
        i {
          font-size: 24rpx;
          color: $textDarkGray-color;
        }
        span {
          font-size: 20rpx;
          color: $textDarkGray-color;
          margin-right: 6rpx;
        }
      }
      .package-cast {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20rpx;
        span {
          font-size: 28rpx;
          color: $textBlack-color;
        }
      }
      .delivery-cast {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20rpx;
        span {
          font-size: 28rpx;
          color: $textBlack-color;
        }
      }
      .discount {
        display: flex;
        margin: 20rpx;
        flex-direction: column;
        .item {
          display: flex;
          align-items: center;
          margin-top: 10rpx;
          img {
            width: 30rpx;
            height: 30rpx;
          }
          .name {
            font-size: 28rpx;
            color: $textDarkGray-color;
            flex: 1;
            margin-left: 10rpx;
          }
          .info {
            font-size: 28rpx;
            color: $mtRed-color;
          }
        }
      }
      .red-packet {
        display: flex;
        align-content: center;
        margin: 20rpx;
        justify-content: space-between;
        .l {
          font-size: 28rpx;
          color: $textBlack-color;
        }
        .r {
          display: flex;
          align-items: center;
          span {
            font-size: 24rpx;
            color: $mtRed-color;
          }
          i {
            font-size: 28rpx;
            margin-left: 10rpx;
            color: $textGray-color;
          }
        }
      }
      .coupon {
        display: flex;
        align-content: center;
        margin: 20rpx;
        justify-content: space-between;
        .l {
          font-size: 28rpx;
          color: $textBlack-color;
        }
        .r {
          display: flex;
          align-items: center;
          span {
            font-size: 24rpx;
            color: $mtRed-color;
          }
          i {
            font-size: 28rpx;
            margin-left: 10rpx;
            color: $textGray-color;
          }
        }
      }
      .totle-price {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 20rpx;
        .l {
          font-size: 24rpx;
          color: $textDarkGray-color;
        }
        .m {
          font-size: 28rpx;
          color: $textBlack-color;
          margin: 0 20rpx;
        }
        .r {
          font-size: 28rpx;
          color: $mtRed-color;
        }
      }
    }
  }
  .privacy-c {
    display: flex;
    flex-direction: column;
    height: 160rpx;
    background-color: white;
    margin: 20rpx;
    justify-content: center;
    .top {
      display: flex;
      align-items: center;
      margin: 0 20rpx;
      .t-l {
        display: flex;
        align-items: center;
        flex: 1;
        span {
          font-size: 28rpx;
          color: $textBlack-color;
          margin: 0 10rpx;
        }
      }
    }
    span {
      font-size: 20rpx;
      color: $textDarkGray-color;
      margin: 0 20rpx;
    }
  }
  .bottom-c {
    display: flex;
    background-color: white;
    margin: 20rpx;
    margin-top: 0;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 186rpx;
    .b-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 88rpx;
      margin: 0 20rpx;
      border-bottom: 2rpx solid $spLine-color;
      span {
        font-size: 28rpx;
        color: $textBlack-color;
      }
    }
    .b-mid {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 88rpx;
      margin: 0 20rpx;
      border-bottom: 2rpx solid $spLine-color;
      .mid-l {
        font-size: 28rpx;
        color: $textBlack-color;
      }
      .mid-r {
        display: flex;
        align-items: center;
        span {
          font-size: 28rpx;
          color: $textDarkGray-color;
        }
        i {
          font-size: 28rpx;
          color: $textGray-color;
          margin-left: 10rpx;
        }
      }
    }
    .b-btm {
      display: flex;
      background-color: white;
      margin: 20rpx;
      align-items: center;
      .b-l {
        font-size: 28rpx;
        color: $textBlack-color;
        flex: 1;
      }
      .b-r {
        display: flex;
        align-items: center;
        margin: 0 20rpx;
        margin-right: 0;
        .s-l {
          font-size: 24rpx;
          color: #00CB91;
          margin: 0 10rpx;
        }
        .picker {
          div {
            display: flex;
            align-items: center;
            .s-r {
              font-size: 28rpx;
              color: $textDarkGray-color;
              margin-right: 10rpx;
              flex: 1;
            }
          }
        }
      }
    }
  }
  .pay-btn {
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100rpx;
    background-color: #4EAA31;
    justify-content: center;
    .top {
      display: flex;
      height: 50rpx;
      align-items: center;
      margin-top:20rpx;
      .s-l {
        font-size: 32rpx;
        color: white;
      }
      .s-m {
        font-size: 36rpx;
        color: white;
        font-weight: bold;
        margin: 0 20rpx;
      }
      .s-r {
        font-size: 24rpx;
        color: white;
      }
    }
  }
}
</style>
