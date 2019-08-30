<template>
  <div class="container">
    <div class="header-c">
        <div class="header">
          <div class="header-m">
            <i class="icon iconfont iconsearch"></i>
            <input style="width: 90%" placeholder="根据订单号搜索" placeholder-style="font-size: 24rpx" v-model="number">
          </div>
          <div class="header-r" style="margin: 0 10rpx;">
            <span @click="search()">搜索</span>
          </div>
      </div>
      <div class="cate-c">
        <span
          class="c-l"
          :style="{'color': pageIndex === -1 ? lineStyle : null}"
          style="text-align:center;width:20%;"
          @click="updateOrderList(-1)"
        >全部{{pageIndex === -1 ? (total) : ''}}</span>
        <span
          class="c-m"
          :style="{'color': pageIndex === 1 ? lineStyle : null}"
          style="text-align:center;width:20%;"
          @click="updateOrderList(1)"
        >新订单{{pageIndex === 1 ? total : ''}}</span>
        <span
          class="c-m"
          :style="{'color': pageIndex === 2 ? lineStyle : null}"
          style="text-align:center;width:20%;"
          @click="updateOrderList(2)"
        >配送中{{pageIndex === 2 ? total : ''}}</span>
        <span
          class="c-m"
          :style="{'color': pageIndex === 3 ? lineStyle : null}"
          style="text-align:center;width:20%;"
          @click="updateOrderList(3)"
        >已完成{{pageIndex === 3 ? total : ''}}</span>
        <span
          class="c-m"
          :style="{'color': pageIndex === 4 ? lineStyle : null}"
          style="text-align:center;width:20%;"
          @click="updateOrderList(4)"
        >退款{{pageIndex === 4 ? total : ''}}</span>
      </div>
    </div>
    <scroll-view
      class="list-c"
      :scroll-y="true"
      @scrolltolower="lower"
      :scroll-top="scrollTop"
      @scroll="scroll"
    >
      <div
        class="item"
        v-for="(item, index) in orderItemList.datas"
        :key="index"
        @click="orderDetail(item)"
      >
        <div class="shop-info">
          <img :src="item.avatar">
          <div class="order_title">
            <div class="order-name" style="margin-bottom:-15rpx;">
              <span class="shop-name" style="display: inline">{{item.addressInfo.name}}</span>
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
          >等待处理退款</p>
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
            v-else-if="item.status==1"
          >待支付</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.status==2 && item.deliveryStatus==1"
          >已支付</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.status==2 && item.deliveryStatus==2"
          >配送中</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.status==0"
          >已取消</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.deliveryStatus==3"
          >已完成</p>
        </div>
        <div class="googs-c">
          <div class="goods" style="float:left;">
            <span class="s-l" v-if="item.itemList.length">{{item.itemList[0].name}}</span>
            <span class="s-m">等{{item.itemList.length}}件商品</span>
            <span class="s-r amount">￥{{item.realFee}}</span>
          </div>
        </div>
        <div class="bottom-c">
          <span>地址：{{item.addressInfo.address}}</span>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import { jointStyle } from "@/utils/style";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { getFetch } from "@/network/request/HttpExtension";

export default {
  data() {
    return {
      pageIndex: null,
      scrollTop: undefined,
      left: "40rpx",
      statusList: [],
      status: undefined,
      total: undefined,
      number: undefined,
      orderItemList: {
        page: 1,
        type: -1,
        datas: []
      }
    };
  },
  methods: {
    ...mapActions("submitOrder", [
      "showOrderByShopIdDetailAction",
      "getOrderByIdAction"
    ]),
    search() {
      this.scrollTop = 0;
      var data = { page: 1, shopId: this.userInfo.shopId };
      if (this.pageIndex == 1 || this.pageIndex == 2 || this.pageIndex == 3) {
        data.deliveryStatus = this.pageIndex;
      } else if (this.pageIndex == 4) {
        data.refundStatus = -1;
      }
      data.orderId = this.number
      this.getOrderItemDataAction(data);
    },
    getOrderItemDataAction(data) {
      wx.showLoading({ title: "加载中...", mask: true });
      getFetch("/order", data, false).then(response => {
        var result = response.result || {};
        this.orderItemList.datas = result.list;
        this.orderItemList.page = result.nextPage;
        this.total = result.total;
        wx.hideLoading();
      });
    },
    updateOrderList(status) {
      this.scrollTop = 0;
      this.pageIndex = status;
      var data = { page: 1, shopId: this.userInfo.shopId };
      if (status == 1 || status == 2 || status == 3) {
        data.deliveryStatus = status;
      } else if (status == 4) {
        data.refundStatus = -1;
      }
      this.total = ''
      this.getOrderItemDataAction(data);
    },
    scroll(e) {
      this.scrollTop = undefined;
    },
    lower(e) {
      if (this.orderItemList.page > 0) {
        this.scrollTop = this.currentScroll;
        wx.showLoading({ title: "加载中...", mask: true });
        var openid = this.userInfo.openid;
        var data = {};
        if (this.pageIndex == 1 || this.pageIndex == 2 || this.pageIndex == 3) {
          data.deliveryStatus = this.pageIndex;
        } else if (this.pageIndex == 4) {
          data.refundStatus = -1;
        }
        data.shopId = this.userInfo.shopId;
        data.page = this.orderItemList.page;
        getFetch("/order", data, false).then(response => {
          var result = response.result || {};
          this.orderItemList.datas = [
            ...this.orderItemList.datas,
            ...result.list
          ];
          this.orderItemList.page = result.nextPage;
          this.total = result.total;
          wx.hideLoading();
        });
      }
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
    orderDetail(item) {
      this.showOrderByShopIdDetailAction({ order: item });
    }
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    lineStyle() {
      return "#FFA500;";
    }
  },
  onLoad(options) {
    this.scrollTop = 0;
    var data = {
      page: 1,
      shopId: this.userInfo.shopId
    };
    if (options.deliveryStatus) {
      this.pageIndex = parseInt(options.deliveryStatus);
      data.deliveryStatus = options.deliveryStatus;
    } else if (options.refundStatus) {
      data.refundStatus = options.refundStatus;
      this.pageIndex = 4;
    } else {
      this.pageIndex = -1;
    }
    this.getOrderItemDataAction(data);
  },
  onShow(options) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    var status = currPage.__data__.status;
    if (status) {
      currPage.data = {}
      var data = {
        page: 1,
        shopId: this.userInfo.shopId
      };
      this.scrollTop = 0;
      if (status.deliveryStatus) {
        data.deliveryStatus = status.deliveryStatus;
        this.pageIndex = parseInt(status.deliveryStatus);
      }
      if (status.refundStatus == 4) {
        data.refundStatus = status.refundStatus;
        this.pageIndex = 4;
      }else if (status.refundStatus == -1) {  // 部分退款
        if (this.pageIndex == 1 || this.pageIndex == 2 || this.pageIndex == 3) {
          data.deliveryStatus = this.pageIndex;
        } else if (this.pageIndex == 4) {
          data.refundStatus = -1;
        }
      }
      var status = [this.pageIndex];
      this.statusList = status;
      this.getOrderItemDataAction(data);
    }
  },
  onPullDownRefresh: function() {
    this.scrollTop = 0;
    var data = { page: 1, shopId: this.userInfo.shopId };
    if (this.pageIndex == 1 || this.pageIndex == 2 || this.pageIndex == 3) {
      data.deliveryStatus = this.pageIndex;
    } else if (this.pageIndex == 4) {
      data.refundStatus = -1;
    }
    this.getOrderItemDataAction(data);
  }
};
</script>

<style lang="scss" scoped>

.header-m {
  display: flex;
  align-items: center;
  flex: 1;
  background-color: #fff;
  height: 60rpx;
  border-radius: 30rpx;
  margin-left: 20rpx;
  align-items: center;
  i {
    color: $textDarkGray-color;
    font-size: 32rpx;
    margin-left: 20rpx;
  }
  span {
    color: $textDarkGray-color;
    font-size: 24rpx;
    margin-left: 10rpx;
    margin-right: 20rpx;
  }
}
.container {
  .header-c {
    display: flex;
    flex-direction: column;
    background-color: white;
    .header {
      display: flex;
      align-items: center;
    }
    .header-r {
      display: flex;
      align-items: center;
      span {
        font-size: 32rpx;
        color: $textBlack-color;
        margin: 0 10rpx;
      }
      i {
        font-size: 32rpx;
        color: $textBlack-color;
        margin: 0 10rpx;
      }
      img {
        height: 55rpx;
        width: 55rpx;
        margin-left: 20rpx;
      }
    }
    .cate-c {
      display: flex;
      height: 60rpx;
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
    top: 120rpx;
    bottom: 0rpx;
    width: 100%;
    .item {
      display: flex;
      flex-direction: column;
      background-color: white;
      margin-top: 15rpx;
      .shop-info {
        display: flex;
        height: 100rpx;
        background-color: white;
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
          margin-right: 20rpx;
        }
      }
      .googs-c {
        display: flex;
        background-color: white;
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
            right: 20rpx;
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
      }
      .bottom-c {
        display: flex;
        margin-left: 30rpx;
        border-top: 2rpx solid $spLine-color;
        align-items: center;
        font-size: 28rpx;
        background-color: white;
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2rpx solid $blue-color;
          margin: 20rpx;
          border-radius: 4rpx;
          span {
            font-size: 28rpx;
            color: $blue-color;
            margin: 6rpx 10rpx;
          }
        }
      }
    }
  }
}
</style>
