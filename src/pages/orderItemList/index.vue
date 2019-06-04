<template>
  <div class="container">
    <div class="header-c">
       <div class="cate-c">
         <span class="c-l" :style="{'font-weight': statusList.length<1 ? lineStyle : null}" style="text-align:center;width:20%;" @click="updateOrderList([])">全部</span>
         <span class="c-m" :style="{'font-weight': pageIndex === 2 ? lineStyle : null}" style="text-align:center;width:20%;" @click="updateOrderList([2])">新订单</span>
         <span class="c-m" :style="{'font-weight': pageIndex === 3 ? lineStyle : null}" style="text-align:center;width:20%;" @click="updateOrderList([3])">配送中</span>
         <span class="c-m" :style="{'font-weight': pageIndex === 4 ? lineStyle : null}" style="text-align:center;width:20%;" @click="updateOrderList([4])">已完成</span>
         <span class="c-m" :style="{'font-weight': pageIndex === 7 ? lineStyle : null}" style="text-align:center;width:20%;" @click="updateOrderList([7])">退款申请</span>
       </div>
    </div>
    <scroll-view class="list-c" :scroll-y="true" @scrolltolower="lower" :scroll-top="scrollTop" @scroll="scroll">
      <div class="item" v-for="(item, index) in orderList.datas" :key="index" @click="orderDetail(item)">
        <div class="shop-info">
          <img :src="item.avatar">
           <div class="order_title">
              <div class="order-name" style="margin-bottom:-15rpx;">
                <span class="shop-name" style="display: inline">{{item.addressInfo.name}}</span>
                <i class="icon mt-arrow-right-o" style="display: inline"></i>
              </div>
              <span class="order-time" style="color: #999;font-size: 23rpx;margin-left:10rpx;padding:-20rpx;">{{item.createTime}}</span>
           </div>
          <p class="order-status" style="position: absolute;right: 0;" v-if="item.status==1">待支付</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.status==2">已支付，等待商家配送</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.status==3">配送中</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.status==0">已取消</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.status==4">已完成</p>
        </div>
        <div class="googs-c">
          <div class="goods" style="float:left;">
            <span class="s-l">{{item.itemList[0].name}}</span>
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
import {jointStyle} from "@/utils/style";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import {getFetch} from '@/network/request/HttpExtension'

export default {
  data() {
    return {
      pageIndex : -1,
      scrollTop:undefined,
      left: '40rpx',
      statusList: [],
      status: undefined
    }
  },
  methods: {
    ...mapActions("submitOrder", ["getOrderDataAction", "showOrderDetailAction", "getOrderByIdAction"]),
    ...mapMutations("submitOrder", ["orderDetailDataMut"]),
    updateOrderList(status) {
      this.scrollTop = 0
      this.statusList = status
      if (status.length<1) {
        this.pageIndex = null
        this.getOrderDataAction({'uid': this.userInfo.openid, 'data' : { 'page' : 1,'shopId':this.userInfo.shopId}})
      } else {
        this.pageIndex = status[0]
        this.getOrderDataAction({'uid': this.userInfo.openid, 'data' : { 'page' : 1,'shopId':this.userInfo.shopId, 'statusList': this.statusList.join(',')}})
      }
    },
    scroll(e) {
      this.scrollTop = undefined
    },
    lower(e) {
       if (this.orderList.page>0) {
        wx.showLoading({title: '加载中...', mask: true})
       var openid = this.userInfo.openid
       var data = {}
       data.page = this.orderList.page
       data.shopId = this.userInfo.shopId
       if (this.statusList.length>0) {
         data.statusList = this.statusList  
       } 
     getFetch('/order/' + this.userInfo.openid, data, false).then(response => {
      var result = response.result || {}
      this.orderList.datas = [
        ...this.orderList.datas,
        ...result.list
        ]
      this.orderList.page = result.nextPage
      wx.hideLoading()
    })
    
    }
  },
    headerClick(item, flag) {
      var update = false
      if (flag) {
        update = true
        var openid = this.userInfo.openid
        this.getOrderByIdAction({'uid': openid, 'data' : item})
      } else {
          var shopId = item.shopId
      wx.navigateTo({url: '/pages/shoppingCart/main?shopId=' + shopId + '&update=' + update})
      }
    },
    orderDetail(item) {      
      this.showOrderDetailAction({order: item})
      wx.navigateTo({url: '/pages/orderDetail/main'})
    }
  },
  computed: {
    ...mapState("submitOrder", ["orderList"]),
    ...mapState("user", ["userInfo"]),
     lineStyle() {
      return "bold;"
    }
  },
  onLoad(options) 
  {
    this.scrollTop = 0
    if (!options.status) {
      this.getOrderDataAction({'uid': this.userInfo.openid, 'data' : { 'page' : 1,'shopId':this.userInfo.shopId}})
    } else {
      this.pageIndex = parseInt(options.status)
      this.getOrderDataAction({'uid': this.userInfo.openid, 'data' : { 'page' : 1,'shopId':this.userInfo.shopId, 'statusList': [2,3,4].join(',')}})
    }
  },
  onPullDownRefresh: function () {
    this.scrollTop = 0
      if (this.statusList.length>0) {
         this.getOrderDataAction({'uid': this.userInfo.openid, 'data' : { 'page' : 1,'shopId':this.userInfo.shopId, 'statusList': this.statusList.join(',')}})
      } else {
          this.getOrderDataAction({'uid': this.userInfo.openid, 'data' : { 'page' : 1,'shopId':this.userInfo.shopId}})     
      }
  }
}
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
    width:100%;
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
          margin-bottom:15rpx;
          margin-top:15rpx;
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
