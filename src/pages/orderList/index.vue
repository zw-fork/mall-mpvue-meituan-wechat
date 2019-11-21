<template>
  <div class="container">
    <authorize @func="getMsgFormSon" ref="authorize" :show="showAuth2"></authorize>
    <div class="header-c">
      <div class="cate-c">
        <span
          class="c-l"
          :style="{'color': pageIndex === -1 ? lineStyle : null}"
          style="text-align:center;width:34%;"
          @click="updateOrderList(-1)"
        >全部订单</span>
        <span
          class="c-m"
          :style="{'color': pageIndex === 3 ? lineStyle : null}"
          style="text-align:center;width:33%;"
          @click="updateOrderList(3)"
        >已完成</span>
        <span
          class="c-m"
          :style="{'color': pageIndex === 4 ? lineStyle : null}"
          style="text-align:center;width:33%;"
          @click="updateOrderList(4)"
        >退款</span>
      </div>
    </div>
    <scroll-view
      class="list-c"
      :scroll-y="true"
      @scrolltolower="lower"
      :scroll-top="scrollTop"
      @scroll="scroll"
    >
      <div class="item" v-for="(item, index) in orderList.datas" :key="index">
        <div class="shop-info">
          <div class="h-l">
            <i style="font-size:30rpx;color:#d81e06;" class="shop-logo icon iconfont icondianpu"></i>
          </div>
          <div class="order_title" @click="intoShop(item)">
            <div class="order-name" style="margin-bottom:-15rpx;">
              <span class="shop-name" style="display: inline">{{item.shopInfo.shopName}}</span>
              <i class="icon iconfont iconright" style="display: inline"></i>
            </div>
            <span
              class="order-time"
              style="color: #999;font-size: 23rpx;margin-left:10rpx;padding:-20rpx;"
            >{{item.updateTime}}</span>
          </div>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-if="item.refundStatus==1"
          >等待商家处理退款</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.refundStatus==2 || item.refundStatus==3"
          >退款成功</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.refundStatus==4 && pageIndex === -1"
          >退款失败</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.status==0"
          >已取消</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.status==4"
          >支付超时取消</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.status==1"
          >待支付</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.status==2 && item.deliveryStatus!=3"
          >已支付，等待商家配送</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.deliveryStatus==2 || item.deliveryStatus==1"
          >配送中</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.deliveryStatus==3"
          >已完成</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.status==5">其他</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.refundStatus==0"
          >退款申请已取消</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.refundStatus==1"
          >退款申请中</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.status==3"
          >已退款</p>
        </div>
        <div class="googs-c" @click="orderDetail(item)">
          <div class="goods" style="float:left;">
            <span class="s-l" v-if="item.itemList.length">{{item.itemList[0].name}}</span>
            <span class="s-m">等{{item.itemList.length}}件商品</span>
            <span class="s-r amount">￥{{item.realFee}}</span>
          </div>
        </div>
        <div class="bottom-c">
          <div class="btn" @click="agreeClick(item)">
            <span>{{item.status==1?'微信支付' : '再来一单'}}</span>
          </div>
          <div class="btn" @click="cancelClick(item)" v-if="item.status==1">
            <span>取消</span>
          </div>
          <div
            class="btn"
            @click="cancelClick(item)"
            v-if="item.canRefund && (!item.refundStatus || item.refundStatus == 4) && item.status==2"
          >
            <span>退款</span>
          </div>
        </div>
      </div>
    </scroll-view>
    <div class="auth" v-if="showAuth">
        <div
            class="item"
            style="font-size: 30rpx;display: flex;justify-content: center;align-items: center;top:40%"
          >您还没有登录，请登录后查看订单</div>
      <div class="bottom-c1" style="justify-content: space-around;">
              <div class="btn" @click="auth">
            <span>登录</span>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jointStyle } from "@/utils/style";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { getFetch } from "@/network/request/HttpExtension";
import authorize from "@/components/authorize";

export default {
  data() {
    return {
      pageIndex: -1,
      scrollTop: 0,
      statusList: [],
      left: "40rpx",
      showAuth2: false,
      showAuth: false,
      status: undefined
    };
  },
 components: {
    authorize
  },
  methods: {
    ...mapActions("submitOrder", [
      "showOrderDetailAction",
      "getOrderByIdAction",
      "updateOrderStatusAction"
    ]),
    ...mapMutations("submitOrder", ["orderDetailDataMut"]),
    auth() {
      this.showAuth2 = this.showAuth;
    },
     getMsgFormSon(data) {
      this.showAuth = data || !this.userInfo.nickname;
      if (!data) {
        this.showAuth2 = false;
        this.scrollTop = 0;
        this.updateOrderList(-1);
      }
    },   
    updateOrderList(status) {
      this.scrollTop = 0;
      this.pageIndex = status;
      var data = { page: 1 };
      if (status == 1 || status == 2 || status == 3) {
        data.deliveryStatus = status;
      } else if (status == 4) {
        data.refundStatus = -1;
      }
      getFetch("/order", data, true).then( response => {
            var result = response.result || {};
            this.orderList.datas = result.list;
            this.orderList.page = result.nextPage;
          }
      );
    },
    scroll(e) {
      this.currentScroll = e.target.scrollTop;
    },
    lower(e) {
      if (this.orderList.page > 0) {
        this.scrollTop = this.currentScroll;
        var data = {};  
        if (this.pageIndex == 1 || this.pageIndex == 2 || this.pageIndex == 3) {
          data.deliveryStatus = this.pageIndex;
        } else if (this.pageIndex == 4) {
          data.refundStatus = -1;
        }
        data.page = this.orderList.page;
        getFetch("/order", data, true).then(
          response => {
            var result = response.result || {};
            this.orderList.datas = [...this.orderList.datas, ...result.list];
            this.orderList.page = result.nextPage;
          }
        );
      }
    },
    intoShop(item) {
      var shopId = item.shopId;
      wx.navigateTo({
        url: "/pages/subsidy/shoppingCart/main?shopId=" + shopId + "&update=false"
      });
    },
    agreeClick(item) {
      var status = item.status;
      var selectStatus = this.pageIndex == -1 ? null : this.pageIndex;
      if (status == 1) {
        this.updateOrderStatusAction({
          order: item,
          status: 2,
          selectStatus: selectStatus
        });
      } else {
        this.getOrderByIdAction({
          data: item
        });
      }
    },
    cancelClick1(item) {
      var status = item.status;
      var selectStatus = this.pageIndex == -1 ? null : this.pageIndex;
      if (status == 1) {
        this.updateOrderStatusAction({
          order: item,
          status: 0,
          selectStatus: selectStatus
        });
      } else {
        this.updateOrderStatusAction({
          order: item,
          status: item.status,
          refundStatus: 1,
          selectStatus: selectStatus
        });
      }
      this.scrollTop = 0;
    },
    orderDetail(item) {
      this.showOrderDetailAction({ order: item });
    },
    cancelClick(item) {  
      var status = item.status;
      var selectStatus = this.pageIndex == -1 ? null : this.pageIndex;
      if (status == 1) {
        this.updateOrderStatusAction({
          order: item,
          status: 0,
          selectStatus: selectStatus
        });
      } else {
        wx.navigateTo({
          url: "/pages/subsidy/refund/main?orderId=" + item.number
        });
      }
    }
  },
  mounted() {
    if (this.$refs.authorize) {
      var p = this.$refs.authorize.getUserInfo();
    }
  },
  computed: {
    ...mapState("submitOrder", ["orderList"]),
    ...mapState("user", ["userInfo"]),
    lineStyle() {
      return "#FFA500;";
    }
  },
  onPullDownRefresh: function() {
    this.scrollTop = 0;
    this.updateOrderList(this.pageIndex);
  },
  onShow(options) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    if (currPage.data.status) {
      currPage.data.status = null;
      this.pageIndex == -1
      this.updateOrderList(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
      .bottom-c1 {
        display: flex;
        border-top: 2rpx solid $spLine-color;
        align-items: center;
		justify-content: flex-end;
      }
      .bottom-c {
        display: flex;
        margin-left: 30rpx;
        border-top: 2rpx solid $spLine-color;
        align-items: center;
		justify-content: flex-end;
      }
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2rpx solid $mtRed-color;
          margin: 20rpx;
          border-radius: 4rpx;
          justify-content: space-around;

          span {
            font-size: 28rpx;
            color: $mtRed-color;
            margin: 6rpx 10rpx;
          }
        }
.auth {
  width:600rpx;
  position:fixed;
  top:50%;
  left:50%;
  margin-left:-300rpx;
  transform:translateY(-50%);
}
.container {
  .header-c {
    display: flex;
    background-color: white;
    flex-direction: column;

    .cate-c {
      display: flex;
      height: 70rpx;
      align-items: center;
      border-bottom: 5rpx solid $spLine-color;
      position: relative;
      transition: all 0.2s;

      .c-l {
        font-size: 30rpx;
        color: $textBlack-color;
      }

      .c-m {
        font-size: 30rpx;
        color: $textBlack-color;
      }

      .c-r {
        font-size: 30rpx;
        color: $textBlack-color;
      }

      .c-main {
        position: absolute;
        font-size: 32rpx;
        color: $textBlack-color;
        right: 30rpx;
      }
    }
  }

  .list-c {
    display: block;
    position: fixed;
    top: 70rpx;
    bottom: 0rpx;

    .item {
      display: flex;
      flex-direction: column;
      background-color: white;
      margin: 15rpx;
      border-radius: 25rpx;

      .shop-info {
        display: flex;
        height: 100rpx;
        align-items: center;
        border-bottom: 2rpx solid $spLine-color;
        margin-left: 30rpx;

        .order_title {
          align-items: center;
          justify-content: flex-start;
        }

        img {
          width: 60rpx;
          height: 60rpx;
        }

        .shop-name {
          font-size: 32rpx;
          color: $textBlack-color;
          margin-left: 10rpx;
          font-weight: bold;
        }

        i {
          font-size: 28rpx;
          color: $textGray-color;
          margin-left: 10rpx;
          flex: 1;
        }

        .order-status {
          font-size: 28rpx;
          color: $textDarkGray-color;
          display: flex;
          float: right;
          margin-right: 30rpx;
        }
      }

      .googs-c {
        display: flex;
        flex-direction: column;

        .goods {
          display: flex;
          align-items: center;
          margin-left: 100rpx;
          margin-right: 20rpx;
          margin-bottom: 15rpx;
          margin-top: 15rpx;

          .s-l {
            font-size: 28rpx;
            color: $textDarkGray-color;
            padding: 10rpx 0;
            max-width: 50%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .s-m {
            max-width: 35%;
            font-size: 28rpx;
            color: $textDarkGray-color;
            padding: 10rpx 0;
            text-align: left;
          }

          .s-r {
            position: absolute;
            right: 0rpx;
            font-size: 24rpx;
            color: $textBlack-color;
          }
        }
      }

      .price {
        display: flex;
        margin: 20rpx;
        justify-content: flex-end;

        .count {
          font-size: 24rpx;
          color: $textDarkGray-color;
        }
      }

      .amount {
        font-size: 24rpx;
        color: $textBlack-color;
        font-weight: bold;
        margin-right: 30rpx;
      }
    }
  }
}
</style>