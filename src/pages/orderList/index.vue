<template>
  <div class="container">
    <div class="list-c">
      <div class="item" v-for="(item, index) in result.list" :key="index">
        <div class="shop-info" @click="headerClick">
          <img :src="item.shopInfo.pic_url">
           <div class="order_title">
              <div class="order-name">
                <span class="shop-name" style="display: inline">{{item.shopInfo.shopName}}</span>
                <i class="icon mt-arrow-right-o" style="display: inline"></i>
              </div>
              <span class="order-time" style="color: #999;font-size: 25rpx;margin-left:10rpx;">2019-04-08 23:33</span>
           </div>
          <p class="order-status" style="position: absolute;right: 0;">{{item.status_description}}已完成</p>
        </div>
        <div class="googs-c" @click="orderDetail(item)">
          <div class="goods" style="float:left;">
            <span class="s-l">{{item.itemList[0].name}}再来一单再来一单再来一单再来一单再来一单</span>
            <span class="s-m">等{{item.itemList.length}}件商品</span>
            <span class="s-r amount">￥{{item.total}}</span>
            </div>
        </div>
        <div class="bottom-c" @click="headerClick">
          <div class="btn">
            <span>再来一单</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {orderList} from './data'
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      orderList: [],
    }
  },
  methods: {
    ...mapActions("submitOrder", ["getOrderDataAction", "showOrderDetailAction"]),
    headerClick() {
      wx.navigateTo({url: '/pages/shoppingCart/main'})
    },
    orderDetail(item) {      
      this.showOrderDetailAction({order: item}) 
    }
  },
  mounted() {
    this.orderList = orderList.data.digestlist
  },
  computed: {
    ...mapState("submitOrder", ["result"]),
  },
  created() {
    this.getOrderDataAction()
  }
}
</script>

<style lang="scss" scoped>
.container {
  .list-c {
    display: flex;
    flex-direction: column;
    .item {
      display: flex;
      flex-direction: column;
      background-color: white;
      margin-top: 20rpx;
      .shop-info {
        display: flex;
        height: 120rpx;
        background-color: white;
        align-items: center;
        border-bottom: 2rpx solid $spLine-color;
        margin-left: 30rpx;
        margin-bottom: 10rpx;
        .order_title {
           align-items: center;
           justify-content: flex-start;
        }
        img {
          width: 80rpx;
          height: 80rpx;
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
          float:right;
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
          margin-left: 120rpx;
          margin-right: 20rpx;
          .s-l {
            font-size: 28rpx;
            color: $textDarkGray-color;
            padding: 10rpx 0;
            max-width: 50%;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          }
          .s-m {
            max-width: 35%;
            font-size: 28rpx;
            color: $textDarkGray-color;
            padding: 10rpx 0;
            text-align:left;
          }
          .s-r {
            position: absolute;
            right: 20rpx;;
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
        background-color: white;
        justify-content: flex-end;
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2rpx solid $spLine-color;
          margin: 20rpx;
          border-radius: 4rpx;
          span {
            font-size: 28rpx;
            color: $textBlack-color;
            margin: 16rpx 24rpx;
          }
        }
      }
    }
  }
}
</style>
