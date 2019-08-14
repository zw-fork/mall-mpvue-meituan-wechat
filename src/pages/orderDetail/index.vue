<template>
  <div class="container">
    <div class="header-c">
      <div class="delivery">
        <div class="address-c">
          <span class="address-info" v-if="orderDetail.status==0">已取消</span>
          <span class="address-info" v-else-if="orderDetail.status==1">未支付</span>
          <div v-else-if="orderDetail.refundStatus==1">
            <span class="address-info">等待退款</span>
            <p class="address-info1" v-if="orderDetail.refundExplain">退款原因：{{orderDetail.refundExplain}}</p>
          </div>        
          <span class="address-info" v-else-if="orderDetail.refundStatus==2">退款成功</span>
          <span class="address-info" v-else-if="orderDetail.status==2">已支付，等待商家配送</span>
          <span class="address-info" v-else-if="orderDetail.status==3">配送中</span>
          <span class="address-info" v-else-if="orderDetail.status==4">已完成</span>
          <span class="address-info" v-else>其他</span>
        </div>
        <div class="line-sp"></div>
        <div class="delivery-time">
          <span class="c-l">{{orderDetail.remark}}</span>
        </div>
        <div class="bottom-a">
          <div class="btn" v-if="orderDetail.refundStatus==1" @click="updateStatus(null, null, 0)">
            <span>取消退款</span>
          </div>
          <div class="btn" @click="headerClick(orderDetail, true)">
            <span>再来一单</span>
          </div>
        </div>
        <div class="modalFooter">
          <div class="btnCancel" @tap="clickCallShop">联系商家</div>
          <div
            class="btnConfirm"
            @click.stop="clickCallDelivery"
            v-if="orderDetail.deliveryStatus==2"
          >联系配送员</div>
        </div>
      </div>
    </div>
    <div class="item-list">
      <div class="section" @click="headerClick(orderDetail, false)">
        <i style="font-size:40rpx;color:#d81e06;" class="shop-logo icon iconfont icondianpu2"></i>
        <span>{{orderDetail.shopInfo.shopName}}</span>
        <i class="icon iconfont iconright" style="display: inline"></i>
      </div>
      <div class="line-sp"></div>
      <div class="list">
        <div class="item" v-for="(item, index) in foodList" :key="index">
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
        <!-- <div class="delivery-cast">
          <span>备注</span>
          <span class="line-clamp1" style="width:80%;margin-top:10rpx;">{{orderDetail.remark}}</span>
        </div>
        <sep-line></sep-line>-->
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

    <div class="header-c">
      <div class="delivery order_detail_style">
        <div class="address-c">
          <span>配送信息</span>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p class="item_left" style="word-break:keep-all; display: inline">送达时间：</p>
          <div class="item_right" style="display: inline">
            <p>尽快送达</p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p class="item_left" style="word-break:keep-all;">送货地址：</p>
          <div class="item_right" v-if="orderDetail.addressInfo">
            <p>{{orderDetail.addressInfo.address}}</p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p class="item_left" style="word-break:keep-all;">顾客姓名：</p>
          <div class="item_right" v-if="orderDetail.addressInfo">
            <p>{{orderDetail.addressInfo.name}}</p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div class="item_style" @click="clickCall">
          <p class="item_left" style="word-break:keep-all;">顾客电话：</p>
          <div class="item_right" v-if="orderDetail.addressInfo">
            <p>{{orderDetail.addressInfo.phone}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="header-c">
      <div class="delivery order_detail_style">
        <div class="address-c">
          <span>订单信息{{test(999)}}</span>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p class="item_left" style="word-break:keep-all; display: inline">订单号：</p>
          <div class="item_right" style="display: inline">
            <p>{{orderDetail.number}}</p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p class="item_left" style="word-break:keep-all; display: inline">支付方式：</p>
          <div class="item_right" style="display: inline">
            <p>{{orderDetail.paymentType === 1 ? '在线支付' : '其他'}}</p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p class="item_left" style="word-break:keep-all; display: inline">下单时间：</p>
          <div class="item_right" style="display: inline">
            <p>{{orderDetail.createTime}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sepLine from "@/components/sep-line";
import { openLocation } from "@/utils/wxapi";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { GOODS_URL_PREFIX } from "@/constants/hostConfig";
import { getFetch, postFetch } from "@/network/request/HttpExtension";

export default {
  data() {
    return {
      foodList: [],
      tabIndex: 0
    };
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    ...mapState("submitOrder", ["orderDetail"]),
    test() {
      return function(value) {
        return value + "aaa";
      };
    },
    path() {
      return `${GOODS_URL_PREFIX}`;
    },
    deliveryFee() {
      return this.orderDetail.deliveryFee;
    },
    realFee() {
      return this.orderDetail.realFee;
    }
  },
  components: {
    sepLine
  },
  methods: {
    ...mapActions("submitOrder", ["getOrderByIdAction"]),
    updateStatus(status, deliveryStatus, refundStatus) {
      var refund = {};
      if (status || status == 0) {
        refund.status = status;
      }
      if (deliveryStatus || deliveryStatus == 0) {
        refund.deliveryStatus = deliveryStatus;
      }
      if (refundStatus || refundStatus == 0) {
        refund.refundStatus = refundStatus;
      }
      getFetch(
        "/order/updateStatus/" + this.orderDetail.number,
        refund,
        false
      ).then(response => {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
          status: refund
        });
        wx.navigateBack({ delta: 1 });
      });
    },
    clickCall() {
      var tel = this.orderDetail.addressInfo.phone;
      var telList = [tel];
      wx.showActionSheet({
        title: "顾客电话",
        itemList: telList,
        success(res) {
          wx.makePhoneCall({ phoneNumber: telList[res.tapIndex] + "" });
        }
      });
    },
    clickCallShop() {
      var tel = this.orderDetail.shopInfo.tel;
      wx.showActionSheet({
        title: "商家电话",
        itemList: tel,
        success(res) {
          wx.makePhoneCall({ phoneNumber: tel[res.tapIndex] + "" });
        }
      });
    },
    clickCallDelivery() {
      var tel = this.orderDetail.deliveryTel;
      wx.showActionSheet({
        title: "商家电话",
        itemList: [tel],
        success(res) {
          wx.makePhoneCall({ phoneNumber: tel + "" });
        }
      });
    },
    headerClick(item, flag) {
      var update = false;
      if (flag) {
        update = true;
        var openid = this.userInfo.openid;
        this.getOrderByIdAction({ uid: openid, data: item });
      } else {
        var shopId = item.shopId;
        wx.navigateTo({
          url: "/pages/shoppingCart/main?shopId=" + shopId + "&update=" + update
        });
      }
    },
    addressClick() {
      wx.navigateTo({ url: "/pages/addressList/main" });
    },
    redPacketClick() {
      wx.navigateTo({ url: "/pages/redPacket/main" });
    },
    couponClick() {
      wx.navigateTo({ url: "/pages/couponList/main" });
    },
    remarkClick() {
      wx.navigateTo({ url: "/pages/remark/main" });
    },
    deliveryClick() {
      this.tabIndex = 0;
    },
    pickClick() {
      this.tabIndex = 1;
    },
    protocol() {
      wx.navigateTo({ url: "/pages/pickProtocol/main" });
    },
    openMap() {
      wx.getLocation({
        type: "gcj02",
        success(res) {
          const latitude = res.latitude;
          const longitude = res.longitude;
          wx.openLocation({
            latitude,
            longitude,
            scale: 28
          });
        }
      });
    }
  },
  mounted() {
    this.foodList = this.orderDetail.itemList;
    this.shopInfo = this.orderDetail.shopInfo;
  }
};
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

.btnCancel {
  width: 50%;
  font-size: 30rpx;
  color: #333;
  text-align: center;
  border-right: 1rpx solid #e5e5e5;
}

.btnConfirm {
  font-size: 30rpx;
  width: 50%;
  color: #333;
  text-align: center;
}

.centerdiv {
  float: left;
  width: 50px;
  border-right: 1px dashed black;
  padding-bottom: 1600px;
  /*关键*/
  margin-bottom: -1600px;
  /*关键*/
}

.line-clamp1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.order_detail_style {
  background-color: #fff;
  font-size: 28rpx;

  .item_style {
    margin-left: 20rpx;
    display: flex;
    padding: 10rpx;
  }
}

.bottom-a {
  display: flex;
  align-items: center;
  background-color: white;

  .btn {
    display: flex;
    border: 2rpx solid $blue-color;
    margin: 20rpx;
    border-radius: 4rpx;

    span {
      font-size: 26rpx;
      color: $blue-color;
      margin: 6rpx 10rpx;
    }
  }
}

.contact {
  display: flex;
  align-items: center;
  background-color: #f4f4f4;

  .btn {
    display: flex;
    border: 2rpx solid $blue-color;
    margin: 20rpx;
    border-radius: 4rpx;

    span {
      font-size: 26rpx;
      color: $blue-color;
      margin: 6rpx 10rpx;
    }
  }
}

.line-sp {
  height: 2rpx;
  background-color: $spLine-color;
  flex: 1;
  margin: 0 20rpx;
}

.container {
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;

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
        padding: 0 20rpx;
        margin: 20rpx;

        .address-info {
            font-weight: bold;
            font-size: 36rpx;
            color: $textBlack-color;
        }

        .address-info1 {
            font-size: 28rpx;
            color: $textBlack-color;
        }

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


          .user-info {
            font-size: 24rpx;
            color: $textDarkGray-color;
          }
        }
      }

      text {
        color: $textBlack-color;
        font-size: 20rpx;
        padding: 3rpx 6rpx;
        border: 2rpx solid $textBlack-color;
      }

      .delivery-time {
        display: flex;
        align-items: center;
        background-color: white;
        padding: 0 20rpx;
        margin: 20rpx;
        font-size: 28rpx;

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
            color: #5584e2;
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
          color: #2f84e9;
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
        margin: 0rpx 20rpx;

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
          color: #00cb91;
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
    background-color: #4eaa31;
    justify-content: center;

    .top {
      display: flex;
      height: 50rpx;
      align-items: center;
      margin-top: 20rpx;

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