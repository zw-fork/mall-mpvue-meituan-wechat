<template>
  <div class="container">
    <scroll-view class="list-c" :scroll-y="true" @scrolltolower="lower">
      <div class="item" v-for="(item, index) in result.list" :key="index" @click="orderDetail(item)">
        <div class="shop-info">
          <img :src="item.shopInfo.pic_url">
           <div class="order_title" @click="headerClick">
              <div class="order-name" style="margin-bottom:-15rpx;">
                <span class="shop-name" style="display: inline">{{item.shopInfo.shopName}}</span>
                <i class="icon mt-arrow-right-o" style="display: inline"></i>
              </div>
              <span class="order-time" style="color: #999;font-size: 25rpx;margin-left:10rpx;padding:-20rpx;">2019-04-08 23:33</span>
           </div>
          <p class="order-status" style="position: absolute;right: 0;">{{item.status_description}}已完成</p>
        </div>
        <div class="googs-c" >
          <div class="goods" style="float:left;">
            <span class="s-l">{{item.itemList[0].name}}再来一单再来一单再来一单再来一单再来一单</span>
            <span class="s-m">等{{item.itemList.length}}件商品</span>
            <span class="s-r amount">￥{{item.realFee}}</span>
            </div>
        </div>
        <div class="bottom-c">
          <div class="btn" @click="headerClick">
            <span>再来一单</span>
          </div>
        </div>
      </div>
    </scroll-view>
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
    lower(e) {
    wx.showLoading({title: '加载中...', mask: true})
    setTimeout(() => {
          wx.hideLoading()
        }, 1000)
  },
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
    display: block;
    position: fixed;
    top: 0rpx;
    bottom: 0rpx;
    width:100%;
    .item {
      display: flex;
      flex-direction: column;
      background-color: white;
      margin-top: 20rpx;
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
          margin-left: 100rpx;
          margin-right: 20rpx;
          margin-bottom:10rpx;
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
