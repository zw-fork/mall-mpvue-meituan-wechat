<template>
  <div class="container">
    <div class="header-c">
      <div class="header">
        <div class="header-m">
          <i class="icon my_iconfont iconsearch"></i>
          <input
            style="width: 90%"
            placeholder="根据订单号搜索"
            placeholder-style="font-size: 24rpx"
            v-model="number"
          >
        </div>
        <div
          class="header-r"
          style="margin: 0 10rpx;"
        >
          <span @click="search()">搜索</span>
        </div>
      </div>
      <div class="cate-c">
        <span
          class="c-l"
          :style="{'color': pageIndex === 5 ? lineStyle : null}"
          style="text-align:center;width:20%;"
          @click="updateOrderList(5)"
        >全部{{pageIndex === 5 ? (total) : ''}}</span>
        <span
          class="c-m"
          :style="{'color': pageIndex === 0 ? lineStyle : null}"
          style="text-align:center;width:20%;"
          @click="updateOrderList(0)"
        >新订单{{pageIndex === 0 ? total : ''}}</span>
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
            <div
              class="order-name"
              style="margin-bottom:-15rpx;"
            >
              <span
                class="shop-name"
                style="display: inline"
              >{{item.addressInfo.name}}</span>
              <i
                class="icon my_iconfont iconright"
                style="display: inline"
              ></i>
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
            v-else-if="item.refundStatus==4"
          >退款失败</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.paid==0"
          >待支付</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.paid==1 && item.status==1"
          >配送中</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.status==4"
          >已取消</p>
          <p
            class="order-status"
            style="position: absolute;right: 0;"
            v-else-if="item.status==3"
          >已完成</p>
        </div>
        <div class="googs-c">
          <div
            class="goods"
            v-if="item.itemList.length"
            style="float:left;"
          >
            <span class="s-l">{{item.itemList[0].name}}</span>
            <span class="s-m">等{{item.itemList.length}}件商品</span>
            <span class="s-r amount">￥{{item.realFee}}</span>
          </div>
          <div
            class="goods"
            v-if="item.infoList.length"
            style="float:left;"
          >
            <span class="s-l">{{item.infoList[0].productInfo.productInfo.store_name}}</span>
            <span class="s-m">等{{item.infoList.length}}件商品</span>
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
      data.type = this.pageIndex;
      data.orderId = this.number;
      this.getOrderItemDataAction(data);
    },
    getOrderItemDataAction(data) {
      getFetch("/order", data, true).then(response => {
        var result = response.result || {};
        this.orderItemList.datas = result.list;
        this.orderItemList.page = result.nextPage;
        this.total = result.total;
      });
    },
    updateOrderList(status) {
      this.scrollTop = 0;
      this.pageIndex = status;
      var data = { page: 1, shopId: this.userInfo.shopId };
      data.type = status;
      this.total = "";
      this.getOrderItemDataAction(data);
    },
    scroll(e) {
      this.scrollTop = undefined;
    },
    lower(e) {
      if (this.orderItemList.page > 0) {
        this.scrollTop = this.currentScroll;
        var openid = this.userInfo.openid;
        var data = {};
        data.type = this.pageIndex;
        data.shopId = this.userInfo.shopId;
        data.page = this.orderItemList.page;
        getFetch("/order", data, true).then(response => {
          var result = response.result || {};
          this.orderItemList.datas = [
            ...this.orderItemList.datas,
            ...result.list
          ];
          this.orderItemList.page = result.nextPage;
          this.total = result.total;
        });
      }
    },
    headerClick(item, flag) {
      var update = false;
      if (flag) {
        update = true;
        this.getOrderByIdAction({ data: item });
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
    if (options.type) {
      this.pageIndex = parseInt(options.type);
      data.type = options.type;
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
    var index = currPage.__data__.index;
    if (index) {
      if (index < 10) {
        this.pageIndex = index;
      }
      currPage.data = {};
      var data = {
        page: 1,
        shopId: this.userInfo.shopId
      };
      this.scrollTop = 0;
      data.type = this.pageIndex;
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
    data.type = this.pageIndex;
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
