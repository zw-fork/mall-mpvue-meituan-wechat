<template>
  <div class="container">
    <div class="header-c">
      <div class="delivery">
        <div class="address-c">
          <div v-if="orderByShopIdDetail.refundStatus==1">
            <span class="address-info">等待退款{{goodsStatus}}</span>
            <p
              class="address-info1"
              v-if="orderByShopIdDetail.refundExplain"
            >退款原因：{{orderByShopIdDetail.refundExplain}}</p>
          </div>
          <span
            class="address-info"
            v-else-if="orderByShopIdDetail.refundStatus==2"
          >退款成功</span>
          <span
            class="address-info"
            v-else-if="orderByShopIdDetail.status==0 && orderByShopIdDetail.paid==1"
          >已支付，等待商家配送{{refundStatus}}</span>
          <span
            class="address-info"
            v-else-if="orderByShopIdDetail.status==1"
          >配送中{{refundStatus}}</span>
          <span
            class="address-info"
            v-else-if="orderByShopIdDetail.status==3"
          >已完成</span>
          <span
            class="address-info"
            v-else-if="orderByShopIdDetail.refundStatus==2 || orderByShopIdDetail.refundStatus==3"
          >已退款</span>
          <span
            class="address-info"
            v-else
          >其他</span>
        </div>
        <div class="line-sp"></div>
        <div class="delivery-time">
          <span class="c-l">{{orderByShopIdDetail.remark}}</span>
        </div>
        <div class="bottom-a">
          <div
            class="btn"
            v-if="orderByShopIdDetail.status==0 && orderByShopIdDetail.paid==1"
            @click="updateStatus(2, 1)"
          >
            <span>配送</span>
          </div>
          <div
            class="btn"
            v-if="orderByShopIdDetail.status==1 && orderByShopIdDetail.paid==1"
            @click="updateStatus(3,3)"
          >
            <span>完成</span>
          </div>
          <!-- <div
            class="btn"
            v-if="orderByShopIdDetail.status==3 && orderByShopIdDetail.paid==1 && !orderByShopIdDetail.turnover"
            @click="updateStatus(3,10)"
          >
            <span>结算</span>
          </div> -->
          <div
            class="btn"
            @click="refund(null)"
            v-if="userInfo.role==2"
          >
            <span>退款</span>
          </div>
          <div
            class="btn"
            @click="updateStatus(4, 4, -1)"
            v-if="orderByShopIdDetail.refundStatus==1"
          >
            <span>拒绝退款</span>
          </div>
        </div>
      </div>
    </div>
    <div class="item-list">

      <div
        class="section"
        @click="headerClick(orderByShopIdDetail, false)"
      >
        <img
          v-if="orderByShopIdDetail.shopInfo.pic_url"
          :src="path + orderByShopIdDetail.shopInfo.pic_url"
        >
        <i
          v-else
          style="font-size:40rpx;color:#d81e06;"
          class="shop-logo icon my_iconfont icondianpu2"
        ></i>
        <span>{{orderByShopIdDetail.shopInfo.shopName}}</span>
        <i
          class="icon my_iconfont iconright"
          style="display: inline"
        ></i>
      </div>
      <div class="list">
        <div
          class="item"
          v-for="(item, index) in foodList"
          :key="index"
        >
          <img
            :src="path + item.picture"
            @click="editGoods(item.goodsId)"
          >
          <div class="item-r">
            <div class="r-t">
              <span>{{item.name}}</span>
              <span>￥{{item.totalPrice}}</span>
            </div>
            <div class="r-t">
              <span>x{{item.sequence}}</span>
              <div
                class="btn"
                @click="refund(item.id)"
                v-if="userInfo.role==2 && orderByShopIdDetail.refundStatus!=2 && orderByShopIdDetail.refundStatus!=3 && !item.refundTime"
              >
                <span>退款</span>
              </div>
              <span
                v-else-if="item.refundTime"
                @click="refund(item.id)"
              >已退款</span>
            </div>
          </div>
        </div>
        <div
          class="item"
          v-for="(item, index) in infoList"
          :key="index"
        >{{item.productInfo.refundTime}}
          <img :src="item.productInfo.productInfo.image">
          <div class="item-r">
            <div class="r-t">
              <span>{{item.productInfo.productInfo.store_name}}</span>
              <span>￥{{item.productInfo.productInfo.price}}</span>
            </div>
            <div class="r-t">
              <span>x{{item.productInfo.cart_num}}</span>
              <div
                class="btn"
                @click="refund(item.productId)"
                v-if="userInfo.role==2 && !item.refundTime && orderByShopIdDetail.refundStatus!=2 && orderByShopIdDetail.refundStatus!=3 && !item.refundTime"
              >
                <span>退款</span>
              </div>
              <span
                v-else-if="item.refundTime"
                @click="refund(item.productId)"
              >已退款</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="delivery-cast">
          <span>配送费</span>
          <span>￥{{deliveryFee}}</span>
        </div>
        <sep-line></sep-line>
        <div
          class="totle-price"
          v-if="orderByShopIdDetail.refundFee"
        >
          <span class="m">已退款</span>
          <span class="r">￥{{orderByShopIdDetail.refundFee}}</span>
        </div>
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
          <p
            class="item_left"
            style="word-break:keep-all; display: inline"
          >送达时间：</p>
          <div
            class="item_right"
            style="display: inline"
          >
            <p>尽快送达</p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p
            class="item_left"
            style="word-break:keep-all;"
          >送货地址：</p>
          <div
            class="item_right"
            v-if="orderByShopIdDetail.addressInfo"
          >
            <p>{{orderByShopIdDetail.addressInfo.address}}</p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p
            class="item_left"
            style="word-break:keep-all;"
          >顾客姓名：</p>
          <div
            class="item_right"
            v-if="orderByShopIdDetail.addressInfo"
          >
            <p>{{orderByShopIdDetail.addressInfo.name}}</p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div
          class="item_style"
          @click="clickCall"
        >
          <p
            class="item_left"
            style="word-break:keep-all;"
          >顾客电话：</p>
          <div
            class="item_right"
            v-if="orderByShopIdDetail.addressInfo"
          >
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
          <p
            class="item_left"
            style="word-break:keep-all; display: inline"
          >订单号：</p>
          <div
            class="item_right"
            style="display: inline"
          >
            <p>
              {{orderByShopIdDetail.number}}
              <span
                style="border:2rpx solid;padding:0rpx 10rpx;"
                @click="copy"
              >复制</span>
            </p>
          </div>
        </div>
        <div
          class="item_style"
          v-if="orderByShopIdDetail.type==1"
        >
          <p
            class="item_left"
            style="word-break:keep-all; display: inline"
          >物流单号：</p>
          <div
            class="item_right"
            style="display: inline"
          >
            <p>
              {{orderByShopIdDetail.deliveryId}}
              <span
                style="border:2rpx solid;padding:0rpx 10rpx;"
                @click="copyDeliveryId"
              >复制</span>
              <span
                style="margin:20rpx;border:2rpx solid;padding:0rpx 10rpx;"
                @click="eject"
              >修改</span>
            </p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p
            class="item_left"
            style="word-break:keep-all; display: inline"
          >支付方式：</p>
          <div
            class="item_right"
            style="display: inline"
          >
            <p>{{orderByShopIdDetail.paymentType === 1 ? '在线支付' : '其他'}}</p>
          </div>
        </div>
        <div class="line-sp"></div>
        <div class="item_style">
          <p
            class="item_left"
            style="word-break:keep-all; display: inline"
          >下单时间：</p>
          <div
            class="item_right"
            style="display: inline"
          >
            <p>{{orderByShopIdDetail.createTime}}</p>
          </div>
        </div>
      </div>
    </div>
    <view
      class="modalDlg"
      catchtouchmove='preventTouchMove'
      v-if='showModal'
    >
      <view class='windowRow'>
        <text class='userTitle'>物流单号
        </text>
        <view
          class='back'
          @click='back'
        >
          返回
        </view>
      </view>
      <view class='wishName'>
        <input
          v-model="deliveryId"
          placeholder='请输入物流单号'
          class='wish_put'
        />
      </view>
      <view class='wishbnt'>
        <button
          class='wishbnt_bt'
          @click='ok'
        >确定</button>
      </view>
    </view>
  </div>
</template>

<script>
import { openLocation } from "@/utils/wxapi";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { getFetch, postFetch } from "@/network/request/HttpExtension";
import { GOODS_URL_PREFIX } from "@/constants/hostConfig";

export default {
  data() {
    return {
      showModal: false,
      foodList: [],
      infoList: [],
      tabIndex: 0,
      deliveryId: null,
      userInfo: {}
    };
  },
  computed: {
    ...mapState("submitOrder", ["orderByShopIdDetail"]),
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
        return " - 新订单";
      } else if (this.orderByShopIdDetail.status == 3) {
        return " - 配送中";
      } else if (this.orderByShopIdDetail.status == 4) {
        return " - 已完成";
      }
      return "";
    },
    refundStatus() {
      if (this.orderByShopIdDetail.refundStatus == 4) {
        return " - 申请过退款，被拒绝";
      }
      return "";
    }
  },
  methods: {
    ...mapActions("submitOrder", ["refundDataAction"]),
    copyDeliveryId() {
      wx.setClipboardData({ data: this.orderByShopIdDetail.deliveryId });
    },
    editGoods(goodsId) {
      wx.navigateTo({
        url: "/pages/subsidy/goodsManage/main?id=" + goodsId
      });
    },
    ok() {
      if (this.deliveryId) {
        this.showModal = false;
        getFetch(
          "/order/deliveryId/" +
            this.orderByShopIdDetail.number +
            "/" +
            this.deliveryId,
          {},
          true
        ).then(response => {
          this.orderByShopIdDetail.deliveryId = response.result;
        });
      } else {
        wx.showToast({
          title: "请输入物流单号!",
          icon: "none",
          duration: 2000
        });
      }
    },
    eject() {
      this.showModal = true;
    },
    back() {
      this.showModal = false;
    },
    copy() {
      wx.setClipboardData({ data: this.orderByShopIdDetail.number });
    },
    refund(itemId) {
      var that = this;
      if (this.orderByShopIdDetail.refundStatus == 1 && !itemId) {
        wx.showModal({
          content: "确定对当前订单进行退款处理？",
          confirmColor: "#FFC24A",
          success: function(res) {
            if (res.confirm) {
              that.refundDataAction({
                orderNo: that.orderByShopIdDetail.number,
                refundDesc: "",
                refundFee: that.orderByShopIdDetail.realFee * 100
              });
            } else if (res.cancel) {
            }
          }
        });
      } else {
        var urlPath =
          "/pages/subsidy/refund/main?orderId=" +
          this.orderByShopIdDetail.number;
        if (itemId) {
          urlPath += "&itemId=" + itemId;
        }
        wx.navigateTo({
          url: urlPath
        });
      }
    },
    refusal() {
      var order = this.orderByShopIdDetail;
      wx.showModal({
        content: "确定取消对当前订单进行的退款申请？",
        confirmColor: "#FFC24A",
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
        title: "顾客电话",
        itemList: telList,
        success(res) {
          wx.makePhoneCall({ phoneNumber: telList[res.tapIndex] + "" });
        }
      });
    },
    updateStatus(index, status, refundStatus) {
      var refund = {};
      var index = index;
      if (status) {
        refund.status = status;
      }
      if (refundStatus) {
        refund.refundStatus = refundStatus;
      }
      getFetch(
        "/order/updateStatus/" + this.orderByShopIdDetail.number,
        refund,
        true
      ).then(response => {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
          index: index
        });
        wx.navigateBack({ delta: 1 });
      });
    },
    headerClick(item, flag) {
      var update = false;
      if (flag) {
        update = true;
        wx.navigateTo({
          url:
            "/pages/subsidy/shoppingCart/main?shopId=" +
            item.shopId +
            "&update=true&orderId=" +
            item.number
        });
      } else {
        var shopId = item.shopId;
        wx.navigateTo({
          url:
            "/pages/subsidy/shoppingCart/main?shopId=" +
            shopId +
            "&update=" +
            update
        });
      }
    },
    addressClick() {
      wx.navigateTo({ url: "/pages/subsidy/addressList/main" });
    },
    redPacketClick() {
      wx.navigateTo({ url: "/pages/redPacket/main" });
    },
    couponClick() {
      wx.navigateTo({ url: "/pages/couponList/main" });
    },
    remarkClick() {
      wx.navigateTo({ url: "/pages/subsidy/remark/main" });
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
    this.foodList = this.orderByShopIdDetail.itemList;
    this.infoList = this.orderByShopIdDetail.infoList;
    this.shopInfo = this.orderByShopIdDetail.shopInfo;
  },
  onShow(options) {
    this.showModal = false;
    this.userInfo = getApp().globalData.userInfo;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    var data = currPage.data.status;
    if (data) {
      var refund = {};
      refund.refundStatus = data;
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        status: refund
      });
      wx.navigateBack({ delta: 1 });
    }
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
.bottom-a {
  display: flex;
  align-items: center;
  background-color: white;
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
.body {
}

.body button {
  height: 100rpx;
}

.model {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 999;
  opacity: 0.5;
  top: 0;
  left: 0;
}

.modalDlg {
  width: 70%;
  position: fixed;
  top: 350rpx;
  left: 0;
  right: 0;
  z-index: 9999;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.windowRow {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 110rpx;
  width: 100%;
}

.back {
  text-align: center;
  color: red;
  font-size: 30rpx;
  margin: 30rpx;
}

.userTitle {
  font-size: 30rpx;
  color: #666;
  margin: 30rpx;
}

.wishName {
  width: 100%;
  justify-content: center;
  flex-direction: row;
  display: flex;
  margin-bottom: 30rpx;
}

.wish_put {
  width: 80%;
  border: 1px solid;
  border-radius: 10rpx;
  padding-left: 10rpx;
}

.wishbnt {
  width: 100%;
  font-size: 30rpx;
  margin-bottom: 30rpx;
}

.wishbnt_bt {
  width: 50%;
  background-color: red;
  color: #fbf1e8;
  font-size: 30rpx;
  border: 0;
}
</style>
