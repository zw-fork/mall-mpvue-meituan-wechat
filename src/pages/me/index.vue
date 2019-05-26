<template>
  <div class="container">
    <div class="header-c">
      <img :src="userInfo.avatarUrl" alt="">
      <div class="info-c">
        <span class="name">{{userInfo.nickname}}</span>
        <span class="phone">15214313256</span>
      </div>
    </div>
    <div class="order-c">
      <div style="border-bottom: 2rpx solid;font-size: 28rpx;padding-bottom:10rpx;">
         <span style="margin-left: 20rpx;">订单管理</span>
      </div>
      <swiper class="category-c">
          <swiper-item>
            <div class="grid-c">
              <div class="item" v-for="(item, index) in orderList" :key="index"  @click="itemClick(item)">
                <img class="item-img" :src="item.url">
                <span class="item-title">{{item.name}}</span>
                <text class="count">12</text>
              </div>
            </div>
        </swiper-item>
      </swiper>
    </div>
    <div class="order-c">
      <div style="border-bottom: 2rpx solid;font-size: 28rpx;padding-bottom:10rpx;">
         <span style="margin-left: 20rpx;">店铺管理</span>
      </div>
      <swiper class="category-c">
          <swiper-item>
            <div class="grid-c">
              <div class="item" v-for="(item, index) in shopMenuList" :key="index"  @click="itemClick(item)">
                <img class="item-img" :src="item.url">
                <span class="item-title">{{item.name}}</span>
                <text class="count">12</text>
              </div>
            </div>
        </swiper-item>
      </swiper>
    </div>
    <div class="list-c">
      <div class="item" v-for="(item, index) in itemList" :key="index" :data-index="index" @click="itemClick(item)">
        <div class="item-l">
          <i class='icon' :class="item.icon"></i>
          <span class="title">{{item.title}}</span>
          <span class="amount" v-if="item.amount">{{item.amount}}<span>张</span></span>
        </div>
        <i class='icon mt-arrow-right-o'></i>
      </div>
    </div>
    <div>
    </div>
    <div class="btn" @click="logoutClick">退出账号</div>
  </div>
</template>

<script>

import {mapState, mapMutations, mapActions, mapGetters} from "vuex"
import {homeData} from './data'

export default {
  data() {
    return {
       categoryArr: [{items: []}, {items: []}],
      topBannerData: [],
      bottomBanner: {},
      shopsList: [],
      shopMenuList: [],
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
          title: '我的地址',
          icon: 'mt-my-location-o',
          path: '/pages/goodsManage/main'
        },
        {
          title: '邀请有奖',
          icon: 'mt-gift-o'
        },
        {
          title: '客服中心',
          icon: 'mt-customer-service-o'
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
  },
  methods: {
    itemClick(e) {
      wx.navigateTo({url: e.path})
    },
    logoutClick() {
      wx.showModal({
          title: '确认退出？',
          content: '退出登录后将无法查看订单，重新登录即可查看',
          confirmColor: '#FFC24A',
          success: function(res) {
            if (res.confirm) {
              resolve('ok')
            } else if (res.cancel) {
              resolve('cancle')
            }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
