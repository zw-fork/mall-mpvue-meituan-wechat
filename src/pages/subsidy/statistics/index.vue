<template>
  <div class="container">
    <div class="header-c">
      <div class="cate-c">
        <span
          class="c-l"
          :style="{'font-weight': statusList.length<1 ? lineStyle : null}"
          style="text-align:center;width:30%;"
        >时间</span>
        <span
          class="c-m"
          :style="{'font-weight': pageIndex === 4 ? lineStyle : null}"
          style="text-align:center;width:30%;"
        >销售额</span>
        <span
          class="c-m"
          :style="{'font-weight': pageIndex === -1 ? lineStyle : null}"
          style="text-align:center;width:20%;"
        >订单量</span>
        <span
          class="c-m"
          :style="{'font-weight': pageIndex === 4 ? lineStyle : null}"
          style="text-align:center;width:20%;"
        >退款量</span>
      </div>
    </div>
    <scroll-view
      class="list-c"
      :scroll-y="true"
      @scrolltolower="lower"
      :scroll-top="scrollTop"
      @scroll="scroll"
    >
      <div class="header-c" v-for="(item, index) in orderList.datas" :key="index">
        <div class="cate-c">
          <span
            class="c-l"
            :style="{'font-weight': statusList.length<1 ? lineStyle : null}"
            style="text-align:center;width:30%;"
          >{{item.update_time}}</span>
          <span
            class="c-m"
            :style="{'font-weight': pageIndex === 4 ? lineStyle : null}"
            style="text-align:center;width:30%;"
          >{{item.sum_total}}</span>
          <span
            class="c-m"
            :style="{'font-weight': pageIndex === -1 ? lineStyle : null}"
            style="text-align:center;width:20%;"
          >{{item.count}}</span>
          <span
            class="c-m"
            :style="{'font-weight': pageIndex === 4 ? lineStyle : null}"
            style="text-align:center;width:20%;"
          >{{item.refund_status}}</span>
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
      pageIndex: undefined,
      scrollTop: 0,
      statusList: [],
      left: "40rpx",
      status: undefined,
      orderList: {
        datas: []
      }
    };
  },
  methods: {
    ...mapActions("submitOrder", [
      "getOrderDataAction",
      "showOrderDetailAction",
      "getOrderByIdAction",
      "updateOrderStatusAction"
    ]),
    ...mapMutations("submitOrder", ["orderDetailDataMut"]),
    scroll(e) {
      this.currentScroll = e.target.scrollTop;
    },
    lower(e) {
      if (this.orderList.page > 0) {
        this.scrollTop = this.currentScroll;
        wx.showLoading({ title: "加载中...", mask: true });
        getFetch(
          "/order/statistics/" + this.userInfo.shopId,
          { page: this.orderList.page },
          false
        ).then(response => {
          var result = response.result || {};
          this.orderList.datas = [...this.orderList.datas, ...result.list];
          this.orderList.page = result.nextPage;
          wx.hideLoading();
        });
      }
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
    }
  },
  mounted() {
    this.scrollTop = 0;
    getFetch("/order/statistics/" + this.userInfo.shopId, {}, false).then(
      response => {
        var result = response.result || {};
        this.orderList.datas = result.list;
        this.orderList.page = result.nextPage;
      }
    );
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    lineStyle() {
      return "bold;";
    }
  },
  onPullDownRefresh: function() {
    this.scrollTop = 0;
    getFetch("/order/statistics/" + this.userInfo.shopId, {}, false).then(
      response => {
        var result = response.result || {};
        this.orderList.datas = result.list;
        this.orderList.page = result.nextPage;
      }
    );
  }
};
</script>

<style lang="scss" scoped>
.container {
  .header-c {
    display: flex;
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

      .bottom-c {
        display: flex;
        margin-left: 30rpx;
        border-top: 2rpx solid $spLine-color;
        align-items: center;
        justify-content: flex-end;

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