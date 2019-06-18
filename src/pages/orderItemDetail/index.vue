<template>
  <div class="container">
    <div class="header-c">
      <div class="delivery">
        <div class="address-c">
          <span class="address-info"
                v-if="orderByShopIdDetail.status==0">已取消</span>
          <span class="address-info"
                v-else-if="orderByShopIdDetail.status==1">未支付</span>
          <span class="address-info"
                v-else-if="orderByShopIdDetail.refundStatus==1">等待退款{{goodsStatus}}</span>
          <span class="address-info"
                v-else-if="orderByShopIdDetail.refundStatus==2">退款成功</span>
          <span class="address-info"
                v-else-if="orderByShopIdDetail.status==2">已支付，等待商家配送</span>
          <span class="address-info"
                v-else-if="orderByShopIdDetail.status==3">配送中</span>
          <span class="address-info"
                v-else-if="orderByShopIdDetail.status==4">已完成</span>
          <span class="address-info"
                v-else>其他</span>
        </div>
        <div class="line-sp"></div>
        <div class="delivery-time">
          <span class="c-l">{{orderByShopIdDetail.remark}}</span>
        </div>
        <div class="bottom-a">
          <div class="btn"
               v-if="orderByShopIdDetail.status==2 && orderByShopIdDetail.refundStatus!=2"
               @click="updateStatus(3)">
            <span>配送</span>
          </div>
          <div class="btn"
               v-if="orderByShopIdDetail.status==3"
               @click="updateStatus(4)">
            <span>完成</span>
          </div>
          <div class="btn"
               @click="refund"
               v-if="orderByShopIdDetail.refundStatus!=2">
            <span>退款</span>
          </div>
          <div class="btn"
               @click="updateStatus(orderByShopIdDetail.status, 3)"
               v-if="orderByShopIdDetail.refundStatus==1">
            <span>拒绝退款</span>
          </div>
        </div>
      </div>
    </div>
    <div class="item-list">
      <div class="section"
           @click="headerClick(orderByShopIdDetail, false)">
        <img :src="orderByShopIdDetail.shopInfo.pic_url">
        <span>{{orderByShopIdDetail.shopInfo.shopName}}</span>
        <i class="icon iconfont iconright"
           style="display: inline"></i>
      </div>
      <div class="list">
        <div class="item"
             v-for="(item, index) in foodList"
             :key="index">
          <img :src="path + item.picture">
          <div class="item-r">
            <div class="r-t">
              <span>{{item.name}}</span>
              <span>￥{{item.min_price * item.sequence}}</span>
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

    <div class="header-c">
      <div class="delivery order_detail_style">
        <div class="address-c">
          <span>配送信息</span>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p class="item_left"
             style="word-break:keep-all; display: inline">送达时间：</p>
          <div class="item_right"
               style="display: inline">
            <p>尽快送达</p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p class="item_left"
             style="word-break:keep-all;">送货地址：</p>
          <div class="item_right"
               v-if="orderByShopIdDetail.addressInfo">
            <p>{{orderByShopIdDetail.addressInfo.address}}</p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p class="item_left"
             style="word-break:keep-all;">顾客姓名：</p>
          <div class="item_right"
               v-if="orderByShopIdDetail.addressInfo">
            <p>{{orderByShopIdDetail.addressInfo.name}}</p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div class="item_style"
             @click="clickCall">
          <p class="item_left"
             style="word-break:keep-all;">顾客电话：</p>
          <div class="item_right"
               v-if="orderByShopIdDetail.addressInfo">
            <p>{{orderByShopIdDetail.addressInfo.phone}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="header-c">
      <div class="delivery order_detail_style">
        <div class="address-c">
          <span>订单信息</span>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p class="item_left"
             style="word-break:keep-all; display: inline">订单号：</p>
          <div class="item_right"
               style="display: inline">
            <p>{{orderByShopIdDetail.number}}</p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p class="item_left"
             style="word-break:keep-all; display: inline">支付方式：</p>
          <div class="item_right"
               style="display: inline">
            <p>{{orderByShopIdDetail.paymentType === 1 ? '在线支付' : '其他'}} </p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p class="item_left"
             style="word-break:keep-all; display: inline">下单时间：</p>
          <div class="item_right"
               style="display: inline">
            <p>{{orderByShopIdDetail.createTime}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sepLine from '@/components/sep-line';
import { openLocation } from '@/utils/wxapi';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import { getFetch, postFetch } from '@/network/request/HttpExtension';
import { GOODS_URL_PREFIX } from '@/constants/hostConfig';

export default {
  data() {
    return {
      foodList: [],
      tabIndex: 0
    };
  },
  computed: {
    ...mapState('user', ['userInfo']),
    ...mapState('submitOrder', ['orderByShopIdDetail']),
    path() {
      return `${GOODS_URL_PREFIX}`;
    },
    deliveryFee() {
      return this.orderByShopIdDetail.deliveryFee;
    },
    realFee() {
      return this.orderByShopIdDetail.realFee;
    },
    goodsStatus() {
      if (this.orderByShopIdDetail.status == 2) {
        return ' - 新订单';
      } else if (this.orderByShopIdDetail.status == 3) {
        return ' - 配送中';
      } else if (this.orderByShopIdDetail.status == 4) {
        return ' - 已完成';
      }
      return '';
    }
  },
  components: {
    sepLine
  },
  methods: {
    ...mapActions('submitOrder', ['getOrderByIdAction', 'refundDataAction']),
    refund() {
      var that = this;
      wx.showModal({
        content: '确定对当前订单进行退款处理？',
        confirmColor: '#FFC24A',
        success: function(res) {
          if (res.confirm) {
            that.refundDataAction({
              orderNo: that.orderByShopIdDetail.number,
              refundDesc: '不想要了!',
              // refundFee: that.orderByShopIdDetail.realFee * 100
              refundFee: 1
            });
          } else if (res.cancel) {
          }
        }
      });
    },
    refusal() {
      var order = this.orderByShopIdDetail;
      wx.showModal({
        content: '确定取消对当前订单进行的退款申请？',
        confirmColor: '#FFC24A',
        success: function(res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      });
    },
    clickCall() {
      var tel = this.orderByShopIdDetail.addressInfo.phone;
      var telList = [tel];
      wx.showActionSheet({
        title: '顾客电话',
        itemList: telList,
        success(res) {
          wx.makePhoneCall({ phoneNumber: telList[res.tapIndex] + '' });
        }
      });
    },
    updateStatus(status, refundStatus) {
      var refund = {};
      if (refundStatus) {
        refund.refundStatus = refundStatus;
      }
      getFetch(
        '/order/updateStatus/' + this.orderByShopIdDetail.number + '/' + status,
        refund,
        false
      ).then(response => {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
          status: status
        });
        wx.navigateBack({ delta: 1 });
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
          url: '/pages/shoppingCart/main?shopId=' + shopId + '&update=' + update
        });
      }
    },
    addressClick() {
      wx.navigateTo({ url: '/pages/addressList/main' });
    },
    redPacketClick() {
      wx.navigateTo({ url: '/pages/redPacket/main' });
    },
    couponClick() {
      wx.navigateTo({ url: '/pages/couponList/main' });
    },
    remarkClick() {
      wx.navigateTo({ url: '/pages/remark/main' });
    },
    deliveryClick() {
      this.tabIndex = 0;
    },
    pickClick() {
      this.tabIndex = 1;
    },
    protocol() {
      wx.navigateTo({ url: '/pages/pickProtocol/main' });
    },
    openMap() {
      wx.getLocation({
        type: 'gcj02',
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
    this.foodList = this.orderByShopIdDetail.itemList;
    this.shopInfo = this.orderByShopIdDetail.shopInfo;
  }
};
</script>

<style lang="scss" scoped>
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
        font-weight: bold;
        font-size: 36rpx;
        background-color: white;
        padding: 0 20rpx;
        margin: 20rpx;
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
