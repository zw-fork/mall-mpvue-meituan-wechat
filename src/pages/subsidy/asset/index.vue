<template>
  <div class="container">
    <div class="asset">
      <div class="item">
        <span>累计销售额</span>
        <span>{{total.sum_total}}</span>
      </div>
      <div class="item">
        <span>累计订单量</span>
        <span>{{total.count}}</span>
      </div>
      <div class="item right">
        <span>累计退单</span>
        <span>{{total.refund_status}}</span>
      </div>
    </div>
    <div class="cate-c">
      <span
        class="c-l"
        :style="{'color': pageIndex === 1 ? lineStyle : null}"
        style="text-align:center;width:50%;"
        @click="updateList(1)"
      >订单明细</span>
      <span
        class="c-m"
        :style="{'color': pageIndex === 2 ? lineStyle : null}"
        style="text-align:center;width:50%;"
        @click="updateList(2)"
      >每日明细</span>
    </div>
    <scroll-view class="list-c" :scroll-y="true" @scrolltolower="lower">
      <div v-if="pageIndex === 1">
        <span class="no-data" v-if="!orderList.datas">暂无资金明细~</span>
        <div class="cashlogs" v-for="(item, index) in orderList.datas" :key="index" @click="orderDetail(item)">
          <div class="profile">
            <div class="typeStr">{{item.number}}</div>
            <div class="dateAdd">{{item.paymentTime}}</div>
          </div>
          <div class="amount">          
            <div class="typeStr">{{item.paid==1 ? item.balance : item.realFee}}</div>
            <div class="dateAdd" style="color: red">{{item.refundStatus==2? '已退款' : ''}}</div>
          </div>
        </div>
      </div>
      <div v-if="pageIndex === 2">
        <span class="no-data" v-if="!orderList.datas">暂无资金明细~</span>
        <div class="cashlogs" v-for="(item, index) in orderList.datas" :key="index">
          <div class="profile">
            <div class="typeStr">{{item.update_time}}</div>
            <div
              class="dateAdd"
            >订单：{{item.count}} {{item.refund_status?',退单：' + item.refund_status : ''}}</div>
          </div>
          <span class="amount" style="color: red">{{item.sum_total}}</span>
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
      activeIndex: 1,
      pageIndex: 1,
      scrollTop: 0,
      statusList: [],
      left: "40rpx",
      status: undefined,
      tabs: ["资金明细", "每日明细", "提现记录"],
      orderList: {
        datas: []
      },
      total: {},
      statistics: {
        datas: []
      }
    };
  },
  methods: {
    ...mapActions("submitOrder", [
      "showOrderDetailAction",
      "showOrderByShopIdDetailAction",
      "getOrderByIdAction",
      "updateOrderStatusAction"
    ]),
    ...mapMutations("submitOrder", ["orderDetailDataMut"]),
    updateList(index) {
      if (this.pageIndex != index) {
        this.orderList.datas = [];
        this.pageIndex = index;
        this.orderList.page = 1;
        if (index == 2) {
          this.updateStatistics();
        } else {
          this.updateDetail();
        }
      }
    },
    orderDetail(item) {
      getFetch(
        "/order/" + item.number,
        {},
        true
      ).then(response => {
        var result = response.result || {};
        this.showOrderByShopIdDetailAction({ order: result });
      });
    },  
    scroll(e) {
      this.currentScroll = e.target.scrollTop;
    },
    updateStatistics() {
      getFetch(
        "/order/statistics/" + this.userInfo.shopId,
        { page: this.orderList.page },
        true
      ).then(response => {
        var result = response.result || {};
        this.orderList.datas = [...this.orderList.datas, ...result.list];
        this.orderList.page = result.nextPage;
      });
    },
    updateDetail() {
      getFetch(
        "/order/detail/" + this.userInfo.shopId,
        { page: this.orderList.page },
        true
      ).then(response => {
        var result = response.result || {};
        this.orderList.datas = [...this.orderList.datas, ...result.list];
        this.orderList.page = result.nextPage;
      });
    },
    totalStatistics() {
      getFetch(
        "/order/totalStatistics/" + this.userInfo.shopId,
        {},
        true
      ).then(response => {
        this.total = response.result || {};
      });
    },
    lower(e) {
      if (this.orderList.page > 0) {
        if (this.pageIndex == 2) {
          this.updateStatistics();
        } else {
          this.updateDetail();
        }
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
    }
  },
  mounted() {
    this.totalStatistics();
    this.scrollTop = 0;
    getFetch("/order/detail/" + this.userInfo.shopId, {}, true).then(
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
      return "#FFA500;";
    }
  },
  onPullDownRefresh: function() {
    this.scrollTop = 0;
    this.totalStatistics();
    this.orderList.datas = [];
    this.orderList.page = 1;
    if (this.pageIndex == 2) {
      this.updateStatistics();
    } else {
      this.updateDetail();
    }
  }
};
</script>

<style lang="scss" scoped>
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
.asset {
  display: flex;
  height: 150rpx;
  background-color: #e85654;
}
.asset .item {
  display: flex;
  flex-direction: column;
  width: 280rpx;
  text-align: center;
  font-size: 16px;
  line-height: 30px;
  color: #fff;
}

.btn-view {
  text-align: right;
  height: 70rpx;
  background-color: #e85654;
  padding-right: 40rpx;
  padding-bottom: 30rpx;
}
.btn-view .btn {
  border-color: #fff !important;
  color: #fff !important;
}
.btn-view .bth-right {
  margin-left: 20rpx;
}
.btn-hover {
  border-color: #fff;
  color: #fff;
}

.no-data {
  margin-top: 100rpx;
  text-align: center;
  font-size: 13px;
  color: #ccc;
}

.cashlogs {
  display: flex;
  font-size: 14px;
  padding-bottom: 10rpx;
  border-bottom: 1px solid #eee;
  line-height: 20px;
}
.cashlogs .profile {
  width: 75%;
  padding-left: 30rpx;
}
.cashlogs .amount {
  width: 20%;
}
.list-c {
  display: block;
  position: fixed;
  top: 230rpx;
  bottom: 0rpx;
}
</style>