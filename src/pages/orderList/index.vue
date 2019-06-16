<template>
  <div class="container">
    <div class="header-c">
       <div class="cate-c">
         <span class="c-l" :style="{'font-weight': statusList.length<1 ? lineStyle : null}" style="text-align:center;width:34%;" @click="updateOrderList([])">全部订单</span>
         <span class="c-m" :style="{'font-weight': pageIndex === 4 ? lineStyle : null}" style="text-align:center;width:33%;" @click="updateOrderList([4])">已完成</span>
         <span class="c-m" :style="{'font-weight': pageIndex === -1 ? lineStyle : null}" style="text-align:center;width:33%;" @click="updateOrderList([-1])">退款</span>
       </div>
    </div>
    <scroll-view class="list-c" :scroll-y="true" @scrolltolower="lower" :scroll-top="scrollTop" @scroll="scroll">
      <div class="item" v-for="(item, index) in orderList.datas" :key="index">
        <div class="shop-info">
 <div class="h-l">
          <i style="font-size:30rpx;color:#d81e06;" class="shop-logo icon iconfont icondianpu"></i>
        </div>           <div class="order_title" @click="intoShop(item)">
              <div class="order-name" style="margin-bottom:-15rpx;">
                <span class="shop-name" style="display: inline">{{item.shopInfo.shopName}}</span>
                <i class="icon iconfont iconright" style="display: inline"></i>
              </div>
              <span class="order-time" style="color: #999;font-size: 23rpx;margin-left:10rpx;padding:-20rpx;">{{item.updateTime}}</span>
           </div>
          <p class="order-status" style="position: absolute;right: 0;" v-if="item.refundStatus==1">等待商家处理退款</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.refundStatus==2">退款成功</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.refundStatus==3">退款失败</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.status==0">待支付</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.status==1">待支付</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.status==2">已支付，等待商家配送</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.status==3">配送中</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.status==4">已完成</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.status==5">其他</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.status==6">退款申请已取消</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.status==7">退款申请中</p>
          <p class="order-status" style="position: absolute;right: 0;" v-else-if="item.status==8">已退款</p>
        </div>
        <div class="googs-c" @click="orderDetail(item)">
          <div class="goods" style="float:left;">
            <span class="s-l">{{item.itemList[0].name}}</span>
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
          <div class="btn" @click="cancelClick(item)" v-if="!item.refundStatus && item.status>1">
            <span>退款</span>
          </div>
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
      pageIndex :undefined,
      scrollTop:0,
      statusList: [],
      left: '40rpx',
      status: undefined
    }
  },
  methods: {
    ...mapActions("submitOrder", ["getOrderDataAction", "showOrderDetailAction", "getOrderByIdAction", "updateOrderStatusAction"]),
    ...mapMutations("submitOrder", ["orderDetailDataMut"]),
    updateOrderList(status) {
      this.scrollTop = 0
      this.statusList = status
      if (status.length<1) {
        this.pageIndex = null
        this.getOrderDataAction({'uid': this.userInfo.openid, 'data' : { 'page' : 1}})
      } else {
        this.pageIndex = status[0]
        this.getOrderDataAction({'uid': this.userInfo.openid, 'data' : { 'page' : 1, 'statusList': this.statusList.join(',')}})
      }
    },
    scroll(e) {
      this.currentScroll = e.target.scrollTop
    },
    lower(e) {
       if (this.orderList.page>0) {
        this.scrollTop = this.currentScroll
        wx.showLoading({title: '加载中...', mask: true})
       var openid = this.userInfo.openid
       var data = {}
       data.page = this.orderList.page
       if (this.pageIndex && this.pageIndex>-1) {
         data.status = this.pageIndex  
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
  intoShop(item) {
     var shopId = item.shopId
     wx.navigateTo({url: '/pages/shoppingCart/main?shopId=' + shopId + '&update=false'})
  },
    agreeClick(item) {
      var status = item.status
      var selectStatus = this.pageIndex == -1 ? null : this.pageIndex
      if (status==1) {
        this.updateOrderStatusAction({order : item, status: 3, selectStatus: selectStatus})
      }else{
        var openid = this.userInfo.openid
        this.getOrderByIdAction({'uid': openid, 'data' : item, selectStatus: selectStatus})
      }
    },
    cancelClick(item) {
      var status = item.status
      var selectStatus = this.pageIndex == -1 ? null : this.pageIndex
      if (status==1) {
        this.updateOrderStatusAction({order : item, status: 0, selectStatus: selectStatus})
      }else{
        this.updateOrderStatusAction({order : item, status: item.status, refundStatus : 1, selectStatus: selectStatus})
      }
      this.scrollTop = 0
    },
    orderDetail(item) {      
      this.showOrderDetailAction({order: item})
    }
  },
  mounted() {
    this.scrollTop = 0
    var openid = this.userInfo.openid
    this.getOrderDataAction({'uid': openid, 'data' : { 'page' : this.orderList.page}})
  },
  computed: {
    ...mapState("submitOrder", ["orderList"]),
    ...mapState("user", ["userInfo"]),
     lineStyle() {
      return "bold;"
    }
  },
  onPullDownRefresh: function () {
    this.scrollTop = 0
       if (this.statusList.length>0) {
         this.getOrderDataAction({'uid': this.userInfo.openid, 'data' : { 'page' : 1, 'statusList': this.statusList.join(',')}})
      } else {
        this.getOrderDataAction({'uid': this.userInfo.openid, 'data' : { 'page' : 1}})
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
