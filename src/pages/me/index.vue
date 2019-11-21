<template>
  <div class="container" @click="update">
    <authorize @func="getMsgFormSon" ref="authorize" :show="showAuth2"></authorize>
    <div class="header-c">
      <img :src="userInfo.avatarUrl" alt @click="updateUser(userInfo)">
      <div class="info-c" @click="visibleItemModal = !visibleItemModal" v-if="userInfo.nickname">
        <span class="name">{{userInfo.nickname}}</span>
      </div>
      <div class="info-c" v-else-if="showAuth">
        <span class="name" @click="auth">请授权登录</span>
      </div>
    </div>
    <div class="order-c" v-if="(userInfo.role==1 || userInfo.role==2) && userInfo.shopId != null">
      <div class="itemName">
        <span>订单管理</span>
      </div>
      <div class="category-c">
        <div class="grid-c">
          <div
            class="item"
            v-for="(item, index) in orderList"
            :key="index"
            @click="itemClick(item)">
            <i class="item-img icon iconfont" :class="item.url" style="font-size: 42rpx;"></i>
            <span class="item-title">{{item.name}}</span>
            <text class="count" v-if="orderCount[index]">{{orderCount[index]}}</text>
          </div>
        </div>
      </div>
    </div>
    <div class="order-c" v-if="(userInfo.role==1 || userInfo.role==2) && userInfo.shopId != null">
      <div style="border-bottom: 2rpx solid;font-size: 28rpx;padding-bottom:10rpx;">
        <span style="margin-left: 20rpx;">商品管理</span>
      </div>
      <div class="category-c">
        <div class="grid-c">
          <div
            class="item"  
            v-for="(item, index) in goodsMenuList"
            :key="index"
            @click="itemClick(item)"
          >
            <i class="item-img icon iconfont" :class="item.url" style="font-size: 42rpx;"></i>
            <span class="item-title">{{item.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="order-c" v-if="userInfo.role==2">
      <div style="border-bottom: 2rpx solid;font-size: 28rpx;padding-bottom:10rpx;">
        <span style="margin-left: 20rpx;">店铺管理</span>
      </div>
      <div class="category-c">
        <div class="grid-c">
          <div
            class="item"
            v-for="(item, index) in shopMenuList"
            :key="index"
            @click="itemClick(item)"
          >
            <i class="item-img icon iconfont" :class="item.url" style="font-size: 42rpx;"></i>
            <span class="item-title">{{item.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="order-c" v-if="userInfo.role==3">
      <div style="border-bottom: 2rpx solid;font-size: 28rpx;padding-bottom:10rpx;">
        <span style="margin-left: 20rpx;">超级管理员</span>
      </div>
      <div class="category-c">
        <div class="grid-c">
          <div
            class="item"
            v-for="(item, index) in superMenuList"
            :key="index"
            @click="itemClick(item)"
          >
            <i class="item-img icon iconfont" :class="item.url" style="font-size: 42rpx;"></i>
            <span class="item-title">{{item.name}}</span>
          </div>
        </div>
      </div>
    </div>


      <div class='user_column'>
    <div class='user_column_item'>
      <contact-button style="opacity:0;position:absolute;top:20rpx;" type="default-dark" :session-from="sessionForm" size="30">
      </contact-button>
      <image class='user_column_item_image' src='/static/images/customer.png'></image>
      <div class='user_column_item_text'>联系客服</div>
    </div>
    <div v-if="userInfo.id" class='user_column_item' @click="itemClick(itemList[0])">
      <image class='user_column_item_image' src='/static/images/code.png'></image>
      <div class='user_column_item_text'>二维码</div>
    </div>
  </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { homeData } from "./data";
import { getFetch } from "@/network/request/HttpExtension";
import authorize from "@/components/authorize";

export default {
  data() {
    return {
      data: {shopId: 12},
      visibleItemModal: false,
      orderCount: [],
      showAuth: false,
      showAuth2: false,
      show: false,
      showEdit: false,
      categoryArr: [{ items: [] }, { items: [] }],
      topBannerData: [],
      divStyle: "",
      bottomBanner: {},
      shopsList: [],
      shopMenuList: [],
      goodsMenuList: [],
      superMenuList: [],
      orderList: [],
      itemList: [
      {
        title: "二维码",
        icon: "mt-protocol-o",
        path: "/pages/subsidy/qrcode/main"
      }
      ]
    };
  },
 components: {
    authorize
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    sessionForm() {
      return JSON.stringify({shopId: 12});
    }
  },
  mounted() {
    if (this.$refs.authorize) {
      var p = this.$refs.authorize.getUserInfo();
      // p.then(function (value) {
      //   console.log(value);
      // });
    }
    this.orderList = [];
    var categoryData = homeData.headData.data.primary_filter;
    categoryData.map((item, index) => {
      this.orderList.push(item);
    });
    this.shopMenuList = [];
    var menuData = homeData.headData.data.shop_menu;
    menuData.map((item, index) => {
      this.shopMenuList.push(item);
    });
    this.goodsMenuList = [];
    var goodsData = homeData.headData.data.goods_menu;
    goodsData.map((item, index) => {
      this.goodsMenuList.push(item);
    });
    this.superMenuList = [];
    var superData = homeData.headData.data.super_menu;
    superData.map((item, index) => {
      this.superMenuList.push(item);
    });
  },
  methods: {
    ...mapMutations("user", ["changeUserInfoMut"]),
    ...mapActions("user", ["wxLocation"]),
    auth() {
      this.showAuth2 = this.showAuth;
    },
    getMsgFormSon(data) {      
      this.showAuth = data || !this.userInfo.nickname;
      if (!data) {
        this.showAuth2 = false;
        if (this.userInfo.shopId && !this.orderCount.length && this.userInfo.role>0 ) {
          getFetch("/order/count/" + this.userInfo.shopId, true).then(response => {
            var count = response.result;
            this.orderCount = [];
            this.orderCount.push(count.新订单);
            this.orderCount.push(count.配送中);
            this.orderCount.push(count.退款);
          });
        }
      }
    },
      goFeedback() {
         wx.navigateTo({
        url: "/pages/feedback/main"
      });
  },
    update() {
      if (!this.show) {
        this.showEdit = false;
      }
      this.show = false;
      return false;
    },
    updateUser() {
      wx.navigateTo({ url: "/pages/userSetting/main" });
    },
    itemClick(e) {
      wx.navigateTo({ url: e.path });
    },
    locationSearchClick() {
      this.wxLocation();
    },
    logoutClick(e) {
      wx.getSystemInfo({
        success(system) {
          console.log(`system:`, system);
          self.statusBarHeight = system.statusBarHeight;
          self.platform = system.platform;

          let platformReg = /ios/i;
          if (platformReg.test(system.platform)) {
            self.titleBarHeight = 44;
          } else {
            self.titleBarHeight = 48;
          }

          self.navBarHeight = self.statusBarHeight + self.titleBarHeight;
        }
      });
      return false;
    }
  },
  onShow(options) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    if (currPage.data.status == "qrcode") {
      getFetch("/wechat/getCurrentUser", true).then(response => {
        var user = response.result || {}
        this.changeUserInfoMut(user)
        if (response.code == 560) {
          this.showAuth = true;
          this.$refs.authorize.getUserInfo();
          return;
        }
        if (user.shopId) {
          getFetch("/order/count/" + user.shopId, true).then(response => {
            var count = response.result;
            this.orderCount = [];
            this.orderCount.push(count.新订单);
            this.orderCount.push(count.配送中);
            this.orderCount.push(count.退款);
          });
        }
      }); 
    } else {
      if (this.userInfo.shopId != null) {
        getFetch("/order/count/" + this.userInfo.shopId, true).then(response => {
          var count = response.result;
          this.orderCount = [];
          this.orderCount.push(count.新订单);
          this.orderCount.push(count.配送中);
          this.orderCount.push(count.退款);
        });
      }
    }
  },
  onPullDownRefresh: function() {
      getFetch("/wechat/getCurrentUser", true).then(response => {
        var user = response.result || {}
        this.changeUserInfoMut(user)
        if (response.code == 560) {
          this.showAuth = true;
          this.$refs.authorize.getUserInfo();
          return;
        }
        if (user.shopId) {
          getFetch("/order/count/" + user.shopId, true).then(response => {
            var count = response.result;
            this.orderCount = [];
            this.orderCount.push(count.新订单);
            this.orderCount.push(count.配送中);
            this.orderCount.push(count.退款);
          });
        }
      });
  }
};
</script>

<style lang="scss" scoped>
.user_column_item_text {
  /* border: 1px solid black; */
  margin-top: 5rpx;
  font-size: 26rpx;
  color: #555;
}
.user_column_item_badge {
  height: 28rpx;
  width: 28rpx;
  position: absolute;
  background: #b4282d;
  color: #fff;
  border-radius: 50%;
  margin-top: 20rpx;
  margin-left: 40rpx;
}

.user_column_item_image {
  width: 50rpx;
  height: 50rpx;
  margin-top: 30rpx;
}
.user_column {
  background-color: white;
  /* border: 1px solid black; */
  height: 140rpx;
  display: flex;
  align-items: center;
}

.user_column_item {
  width: 25%;
  height: 140rpx;
  background: #fff;
  text-align: center;
  position: relative;
}
.itemName {
  border-bottom: 2rpx solid;
  font-size: 32rpx;
  padding-bottom: 10rpx;
}

.editGoods {
  background-color: black;
  display: flex;
  position: absolute;
  opacity: 0.5;
  right: 0rpx;

  i {
    font-size: 50rpx;
    color: white;
    flex-direction: column;
    align-items: center;
    margin-left: 10rpx;
    display: flex;
  }

  span {
    flex-direction: column;
    align-items: center;
    display: flex;
    margin-left: 10rpx;
    font-size: 28rpx;
  }
}

button::after {
  border: none;
}

.screen_cover {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
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
    margin-top: 15rpx;
    padding: 10px;

    .category-c {
      background-color: white;
      padding-top: 15rpx;

      .grid-c {
        font-size: 26rpx;
        flex-wrap: wrap;
        display: flex;

        .item {
          padding-bottom: 20rpx;
          width: 25%;
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
            font-size: 26rpx;
            color: $textBlack-color;
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
            margin-left: 20rpx;
            color: white;
          }
        }
      }
    }

    .item {
      box-sizing: border-box;
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
    background-color: #e93323;

    img {
      border: 3px solid white;
      width: 140rpx;
      height: 140rpx;
      border-radius: 80rpx;
      margin-left: 30rpx;
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
          margin-left: 10rpx;
          margin-top: 15rpx;
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