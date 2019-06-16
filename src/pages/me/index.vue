<template>
<div>
  <div class="container" @click="update">
    <div class="header-c">
      <img :src="userInfo.avatarUrl" alt="">
      <div class="info-c">
        <span class="name">{{userInfo.nickname}}</span>
        <span class="phone">15214313256</span>
      </div>
    </div>
    <div class="order-c" v-if="(userInfo.role==1 || userInfo.role==2) && userInfo.shopId">
      <div style="border-bottom: 2rpx solid;font-size: 28rpx;padding-bottom:10rpx;">
         <span style="margin-left: 20rpx;">订单管理</span>
      </div>
      <swiper class="category-c">
          <swiper-item>
            <div class="grid-c">
              <div class="item" v-for="(item, index) in orderList" :key="index"  @click="itemClick(item)">
                <i class="item-img icon iconfont" :class="item.url" style="font-size: 42rpx;"></i>
                <span class="item-title">{{item.name}}</span>
                <text class="count" v-if="orderCount[index]" >{{orderCount[index]}}</text>
              </div>
            </div>
        </swiper-item>  
      </swiper>
    </div>
    <div class="order-c" v-if="(userInfo.role==1 || userInfo.role==2) && userInfo.shopId">
      <div style="border-bottom: 2rpx solid;font-size: 28rpx;padding-bottom:10rpx;">
         <span style="margin-left: 20rpx;">商品管理</span>
      </div>
      <swiper class="category-c">
          <swiper-item>
            <div class="grid-c">
              <div class="item" v-for="(item, index) in goodsMenuList" :key="index"  @click="itemClick(item)">
                <i class="item-img icon iconfont" :class="item.url" style="font-size: 42rpx;"></i>
                <span class="item-title">{{item.name}}</span>
              </div>
            </div>
        </swiper-item>
      </swiper>
    </div>
        <div class="order-c" v-if="userInfo.role==2 && userInfo.shopId">
      <div style="border-bottom: 2rpx solid;font-size: 28rpx;padding-bottom:10rpx;">
         <span style="margin-left: 20rpx;">店铺管理</span>
      </div>
      <swiper class="category-c">
          <swiper-item>
            <div class="grid-c">
              <div class="item" v-for="(item, index) in shopMenuList" :key="index"  @click="itemClick(item)">
                <i class="item-img icon iconfont" :class="item.url" style="font-size: 42rpx;"></i>
                <span class="item-title">{{item.name}}</span>
              </div>
            </div>
        </swiper-item>
      </swiper>
    </div>
            <div class="order-c" v-if="userInfo.role==-1">
      <div style="border-bottom: 2rpx solid;font-size: 28rpx;padding-bottom:10rpx;">
         <span style="margin-left: 20rpx;">超级管理员</span>
      </div>
      <swiper class="category-c">
          <swiper-item>
            <div class="grid-c">
              <div class="item" v-for="(item, index) in superMenuList" :key="index"  @click="itemClick(item)">
                <i class="item-img icon iconfont" :class="item.url" style="font-size: 42rpx;"></i>
                <span class="item-title">{{item.name}}</span>
              </div>
            </div>
        </swiper-item>
      </swiper>
    </div>
    <div class="list-c">
      <div class="item" v-for="(item, index) in itemList" :key="index" :data-index="index">
        <div class="item-l">
          <i class='icon' :class="item.icon"></i>
          <span class="title">{{item.title}}</span>
          <span class="amount" v-if="item.amount">{{item.amount}}<span>张</span></span>
        </div>
        <i class='icon iconfont iconright' @click="itemClick(item)"></i>
      </div>
      <div class="item">
        <div class="item-l">
          <i class='icon mt-customer-service-o'></i>
          <span class="title">客服中心</span>
        </div>
       <button open-type="contact" style="margin: 0;padding: 0;border:none;background-color: white;">
         <i class='icon iconfont iconright' @click="logoutClick($event)"></i>
      </button>
      </div>
    </div>
    <div>
    </div>
    <div class="btn" @click="logoutClick($event)">退出账号</div>
</div>
  </div>
</template>

<script>

import {mapState, mapMutations, mapActions, mapGetters} from "vuex"
import {homeData} from './data'
import {getFetch} from '@/network/request/HttpExtension'

export default {
  data() {
    return {
      orderCount: [],
      show: false,
      showEdit: false,
       categoryArr: [{items: []}, {items: []}],
      topBannerData: [],
      divStyle: '',
      bottomBanner: {},
      shopsList: [],
      shopMenuList: [],
      goodsMenuList:[],
      superMenuList: [],
      orderList: [],
      itemList: [
        {
          title: '红包',
          icon: 'mt-red-packet-o',
          path: '/pages/redPacket/main',
          amount: 4
        }, 
        {
          title: '商家代金券',
          icon: 'mt-coupon-o',
          path: '/pages/couponList/main',
          amount: 10
        },
        {
          title: '店铺注册',
          icon: 'mt-my-location-o',
          path: '/pages/shopManage/main'
        },
        {
          title: '邀请有奖',
          icon: 'mt-gift-o'
        },
        {
          title: '帮助和反馈',
          icon: 'mt-help-o',
          path: '/pages/feedback/main'
        },
        {
          title: '协议和说明',
          icon: 'mt-protocol-o',
          path: '/pages/protocol/main'
        }]
    }
  },
  computed: {
    ...mapState("user", ["userInfo"]),
  },
    mounted() {
    var categoryData = homeData.headData.data.primary_filter;
    categoryData.map((item, index) => {
       this.orderList.push(item)
    })
    var menuData = homeData.headData.data.shop_menu;
    menuData.map((item, index) => {
       this.shopMenuList.push(item)
    })
    var goodsData = homeData.headData.data.goods_menu;
    goodsData.map((item, index) => {
       this.goodsMenuList.push(item)
    })
    var superData = homeData.headData.data.super_menu;
    superData.map((item, index) => {
       this.superMenuList.push(item)
    })
  },
  methods: {
    update() {
      if (!this.show) {
        this.showEdit = false
      }
       this.show = false
       return false;
    },
    itemClick(e) {
      wx.navigateTo({url: e.path})
    },
    logoutClick(e) {
      this.showEdit = true
      this.show = true
       this.divStyle = 'top:' + (e.target.offsetTop + e.target.y - 20) + 'rpx;'
       return false;
    }
  },
  onShow(options) {
    if (this.userInfo.shopId) {
          getFetch('/order/count/'+this.userInfo.shopId, false).then(response => {
            var count = response.result
            this.orderCount = []
        this.orderCount.push(count.新订单)
        this.orderCount.push(count.配送中)
        this.orderCount.push(count.退款)
      })
    }

  }
}
</script>

<style lang="scss" scoped>
 button::after{ border: none; } 
    .screen_cover{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0,0,0,.3);
        z-index: 11;
    }
.editGoods {
  background-color: black;
   display: flex;
   position: absolute;
   opacity: 0.5;
   right: 0rpx;
   img {
           flex-direction: column;
      align-items: center;
      display: flex;
     margin: 10rpx;
     width: 50rpx;
     margin-left: 40rpx;
     height: 50rpx;
   }
   span {
      flex-direction: column;
      align-items: center;
      display: flex;
           margin: 10rpx;
           margin-left: 40rpx;
      font-size: 24rpx;
   }
}
.container {
  .order-c {
    display: flex;
    flex-direction: column;
    background-color: white;
    height:180rpx;
    border-radius:25rpx;
    margin:15rpx;
    .category-c {
      height: 100rpx;
      background-color: white;
      padding-top: 15rpx;
      .grid-c {
        height: 140rpx;
        flex-wrap: wrap;
        display: flex;
        .item {
          width: 20%;
          background-color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
          img {
            width: 60rpx;
            height: 60rpx;
          }
          span {
            font-size: 20rpx;
            color: $textBlack-color;
            margin-top: 10rpx;
          }
          .count {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: $mtRed-color;
            width: 30rpx;
            height: 30rpx;
            border-radius: 15rpx;
            position: absolute;
            font-size: 20rpx;
            margin-left:20rpx;
            color: white;
          }
        }
      }
    }
    .item {
      box-sizing: border-box;
      margin-left: 20rpx;
       float: left;
      display: flex;
    }
    img {
      width: 60rpx;
      height: 60rpx;
    }
    p {
      font-size: 32rpx;
    }
  }
  .header-c {
    display: flex;
    align-items: center;
    height: 200rpx;
    background-color: #ff0066;
    img {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      margin-left: 30rpx
    }
    .info-c {
      display: flex;
      flex-direction: column;
      margin-left: 30rpx;
      .name {
        font-size: 32rpx;
        color: $textBlack-color;
        font-weight: bold;
      }
      .phone {
        font-size: 28rpx;
        color: $textBlack-color;
      }
    }
  }
  .list-c {
    display: flex;
    flex-direction: column;
    margin-top: 200rpx;
    background-color: white;
    .item {
      display: flex;
      align-items: center;
      height: 88rpx;
      border-bottom: 2rpx solid $spLine-color;
      padding: 0 20rpx;
      .item-l {
        display: flex;
        flex: 1;
        i {
          font-size: 38rpx;
          color: $textDarkGray-color;
        }
        .title {
          font-size: 28rpx;
          color: $textBlack-color;
          margin-left: 30rpx;
          margin-top: 6rpx;
        }
        .amount {
          font-size: 38rpx;
          color: $mtRed-color;
          margin: 0 10rpx;
          display: flex;
          align-items: center;
           span {
             font-size: 24rpx;
             color: $textDarkGray-color;
             margin-left: 10rpx;
           }
        }
      }
      i {
        font-size: 24rpx;
        color: $textGray-color;
      }
    }
    .item:last-child {
      border-bottom: 0rpx solid $spLine-color;
    }
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    background-color: white;
    margin-top: 20rpx;
    color: $textBlack-color;
    font-size: 28rpx;
  }
}
</style>
