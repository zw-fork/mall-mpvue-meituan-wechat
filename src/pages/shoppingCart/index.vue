<template>
  <div class="container" @click="update" @mousedown="update" v-if="!shopId || shopId == shopInfo.shopId">
    <div class="header-c">
      <div class="header" @click="openLocation">
        <div class="h-l">
          <img
            class="shop-logo"
            :src="shopInfo.pic_url? (path + shopInfo.pic_url) : '/static/images/shop.png'"
          >
        </div>
        <div class="h-r">
          <span class="r-l" >地址: {{shopInfo.wxAddress.name}}</span>
          <div class="r-t">
            <span class="t-l">起送 ¥{{shopInfo.min_price}}</span>
            <div class="s-l"></div>
            <span class="t-m">营业时间: 全天</span>
            <i class="icon iconfont iconright" style="position:absolute; right:0rpx;"></i>
          </div>
          <div class="r-m" v-if="shopInfo.bulletin">
            <span class="b-r">公告：{{shopInfo.bulletin}}</span>
          </div>
        </div>
      </div>
      <div class="cate-c">
        <span
          class="c-l"
          :style="{'font-weight': pageIndex === 0 ? lineStyle : null}"
          @click="menuClick"
        >商品</span>
        <span
          class="c-m"
          :style="{'font-weight': pageIndex === 1 ? lineStyle : null}"
          @click="shopClick"
        >商家</span>
        <span class="c-m" @click="goHome">首页</span>
        <div class="header-r" @click="searchClick" style=" position: absolute;right:10rpx;">
          <i class="icon iconfont iconsearch"></i>
          <span>搜索商品</span>
        </div>
      </div>
    </div>
    <div class="list-c" v-if="pageIndex === 0">
      <scroll-view class="list-l" :scroll-y="true">
        <div
          class="l-item"
          :class="{active: index === tagIndex}"
          v-for="(item, index) in shopInfo.categoryModelList"
          :key="index"
          @click="categoryClick(item, index)"
        >
          <span>{{item.name}}</span>
          <text class="count" v-if="item.count > 0">{{item.count}}</text>
        </div>
      </scroll-view>
      <scroll-view
        class="list-r"
        :scroll-y="true"
        @scrolltolower="lower"
        :scroll-top="scrollTop"
        @scroll="scroll"
      >
        <div class="section">
          <span class="title">{{spus.title}}</span>
        </div>
        <div class="item-list" v-for="(item, index) in spus.datas" :key="index">
          <div class="item">
            <div class="item-l">
              <img :src="path + item.picture">
            </div>
            <div class="item-r">
              <div class="div-title">
                <span class="title">{{item.name}}</span>
              </div>
              <span class="sub-title"></span>
              <div class="r-t">
                <span class="price">￥{{item.min_price}}</span>
                <div class="add-item" v-if="!showManage">
                  <div
                    class="add-l"
                    @click.stop="reduceClick(item, index, spus.index)"
                    v-if="item.sequence > 0"
                  >
                    <i class="icon iconfont iconminus-circle"></i>
                    <span>{{item.sequence}}</span>
                  </div>
                  <div class="add-r" @click.stop="addClick(item, index, spus.index)">
                    <i class="icon iconfont iconplus-circle"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <div class="shop-info" v-else-if="pageIndex === 1">
      <div class="address">
        <i class="icon mt-location-o"></i>
        <span>{{shopInfo.wxAddress.name}}</span>
        <i class="icon mt-phone-o" @click.stop="clickCall()"></i>
      </div>
      <div class="delivery">
        <div class="btm">
          <i class="icon mt-clock-s"></i>
          <span>营业时间: 全天</span>
        </div>
      </div>
      <div class="delivery">
        <div class="btm">
          <i class="icon mt-clock-s"></i>
          <span style="border:2rpx solid;padding:0rpx 10rpx;" @click="copy">复制微信号</span>
        </div>
      </div>
      <div class="delivery" v-if="shopInfo.bulletin">
        <div class="notice">
          <span>{{shopInfo.bulletin}}</span>
        </div>
      </div>
    </div>
    <div class="screen_cover" v-show="showCart && productCount > 0" @click="toggleCartList"></div>
    <div class="cart_food_list" v-if="showCart && productCount > 0">
      <header>
        <h4>购物车</h4>
        <div @click="clearCart">
          <span class="clear_cart">清空</span>
        </div>
      </header>
      <section class="cart_food_details" id="cartFood">
        <ul>
          <li v-for="(item, index) in cartGoodsList1" :key="index" class="cart_food_li">
            <div class="cart_list_num">
              <p class="ellipsis">{{item.name}}</p>
            </div>
            <div class="cart_list_price">
              <span>¥</span>
              <span>{{item.min_price}}</span>
            </div>
            <section class="cart_list_control">
              <span @click.stop="reduceClick(item, item.index, item.categoryIndex)">
                <i class="icon iconfont iconminus-circle" style="color: #ccc;font-size: 48rpx;"></i>
              </span>
              <span class="cart_num">{{item.sequence}}</span>
              <div @click.stop="addClick(item, item.index, item.categoryIndex)">
                <i class="icon iconfont iconplus-circle" style="color: #FF6347;font-size: 52rpx;"></i>
              </div>
            </section>
          </li>
        </ul>
      </section>
    </div>
    <div class="footer-c" v-if="pageIndex === 0">
      <div class="c-m">
        <div class="l">
          <span class="price" v-if="totalPrice > 0 || productCount > 0">
            ￥
            <span>{{totalPrice}}</span>
          </span>
          <div class="m-l">
            <span class="l-l">另需配送费￥{{shopInfo.support_pay}}</span>
            <div class="l-m"></div>
            <span class="l-r" v-if="shopInfo.type != 1">小区内配送</span>
          </div>
        </div>
        <div
          class="m-r"
          :style="{'background-color': btnTitle === '去结算' ? '#FF6347' : '#969696'}"
          @click="orderClick"
        >
          <span :style="{color: btnTitle === '去结算' ? '#FFFFFF' : '#ffffff'}">{{btnTitle}}</span>
        </div>
      </div>
      <div class="cart-c">
        <i
          mode="widthFix"
          class="icon iconfont icongouwuche"
          :style="productCount > 0 ? 'color: #1296db' : 'color: #969696'"
          @click="toggleCartList()"
        ></i>
        <span v-if="productCount > 0">{{productCount}}</span>
      </div>
    </div>
    <div class="editGoods" :style="divStyle" v-if="showEdit">
      <div @click="editGoods">
        <i class="icon iconfont iconedit"></i>
        <span style="color:white;text-align: center;">编辑</span>
      </div>
      <div @click="upGoods" v-if="selectGoods.status==2">
        <i class="icon iconfont iconshangjia1"></i>
        <span style="color:white;text-align: center;">上架</span>
      </div>
      <div @click="downGoods" v-if="selectGoods.status==1">
        <i class="icon iconfont iconxiajia"></i>
        <span style="color:white;text-align: center;">下架</span>
      </div>
      <div @click="deleteGoods">
        <i class="icon iconfont icondelete"></i>
        <span style="color:white;text-align: center;">删除</span>
      </div>
    </div>
  </div>
</template>

<script>
import { jointStyle } from "@/utils/style";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { formatYMD } from "@/utils/formatTime";
import { _array } from "@/utils/arrayExtension";
import { getFetch, postFetch } from "@/network/request/HttpExtension";
import { GOODS_URL_PREFIX } from "@/constants/hostConfig";
import QQMapWX from "qqmap-wx-jssdk";

export default {
  data() {
    return {
      selectGoods: undefined,
      selectIndex: undefined,
      shopId: undefined,
      showEdit: false,
      show: false,
      divStyle: "",
      scrollTop: undefined,
      currentScroll: 0,
      showCart: false,
      tagIndex: 0,
      pageIndex: 0,
      left: "40rpx",
      stars: [1, 2, 3, 4],
      cartGoodsList1: [],
      phoneList: ["10107888", "22222222"]
    };
  },
  computed: {
    ...mapState("shoppingCart", [
      "cartMap",
      "shopInfo",
      "spus",
      "commentInfo",
      "visibleSkuModal",
      "visibleItemModal",
      "skuInfo",
      "previewInfo"
    ]),
    ...mapState("user", ["userInfo"]),
    ...mapState("submitOrder", ["orderDetail"]),
    lineStyle() {
      return "bold;padding-bottom:2px; border-bottom:2px solid #F00;";
    },
    path() {
      return `${GOODS_URL_PREFIX}`;
    },
    totalPrice() {
      var price = 0;
      if (this.shopInfo.categoryModelList) {
        this.shopInfo.categoryModelList.map(item => (price += item.totalPrice));
      }
      var cartGoodsList = [];
      var goodsMap = this.cartMap;
      for (var key in goodsMap) {
        if (goodsMap.hasOwnProperty(key)) {
          var goods = goodsMap[key];
          if (goods.sequence > 0) {
            var cartGoods = {};
            cartGoods.index = goods.index;
            cartGoods.goodsId = goods.goodsId;
            cartGoods.categoryIndex = goods.categoryIndex;
            cartGoods.categoryId = goods.categoryId;
            cartGoods.picture = goods.picture;
            cartGoods.name = goods.name;
            cartGoods.oldData = goods.oldData;
            cartGoods.min_price = goods.currentPrice
              ? goods.currentPrice
              : goods.min_price;
            cartGoods.sequence = goods.sequence;
            cartGoodsList.push(cartGoods);
          }
        }
      }
      this.cartGoodsList1 = cartGoodsList;
      return parseFloat(price).toFixed(2);
    },
    productCount() {
      var count = 0;
      if (this.shopInfo.categoryModelList) {
        this.shopInfo.categoryModelList.map(item => (count += item.count));
      }
      return count;
    },
    btnTitle() {
      if (this.shopInfo && this.shopInfo.min_price != null) {
        if (this.shopInfo.status != 1) {
          return "打烊";
        }
        var content = `${this.shopInfo.min_price}元起送`;
        var price = 0;
        if (this.shopInfo.categoryModelList) {
          this.shopInfo.categoryModelList.map(
            item => (price += item.totalPrice)
          );
        }
        if (price <= 0) return content;
        if (price < this.shopInfo.min_price) {
          var value = parseFloat(this.shopInfo.min_price - price).toFixed(2);
          return `还差${value}元`;
        } else {
          return "去结算";
        }
      } else {
        return "";
      }
    }
  },
  methods: {
    ...mapMutations("shoppingCart", [
      "changeReduceFeeDataMut",
      "changeSkuModalMut",
      "changeItemModalMut"
    ]),
    ...mapActions("shoppingCart", [
      "getMenuDataAction",
      "getCommentDataAction",
      "getCategoryMenuDataAction",
      "addItemAction",
      "reduceItemAction",
      "closeShoppingCartAction",
      "selectSkuAction",
      "changeSkuDataMut",
      "attrSelectAction",
      "changeSkuModalDataAction",
      "previewItemAction"
    ]),
    ...mapActions("submitOrder", ["createOrderDetailAction"]),
    copy() {
      wx.setClipboardData({data: this.shopInfo.wechatId});
    },
    updateGoods(goodsModel) {
      postFetch("/goods/upload2", goodsModel, false).then(response => {
        this.showEdit = false;
        wx.showLoading({ title: "加载中...", mask: true });
        getFetch(
          "/goods/list/" + this.shopInfo.shopId,
          { page: 1, categoryId: this.spus.categoryId, status: 1 },
          false
        ).then(response => {
          var goods = response.result.list;
          for (var index1 in goods) {
            var g = this.cartMap[goods[index1].goodsId];
            if (g) {
              goods[index1].sequence = g.sequence;
              goods[index1].oldData = true;
              this.cartMap[goods[index1].goodsId] = goods[index1];
            }
          }
          this.spus.datas = goods;
          this.spus.page = response.result.nextPage;
          wx.hideLoading();
        });
      });
    },
    deleteGoods() {
      var that = this;
      wx.showModal({
        content: "确定删除当前商品？",
        confirmColor: "#FFC24A",
        success: function(res) {
          if (res.confirm) {
            that.selectGoods.status = 0;
            that.updateGoods(that.selectGoods);
          } else if (res.cancel) {
          }
        }
      });
    },
    downGoods() {
      var that = this;
      wx.showModal({
        content: "确定下架当前商品？",
        confirmColor: "#FFC24A",
        success: function(res) {
          if (res.confirm) {
            that.selectGoods.status = 2;
            that.updateGoods(that.selectGoods);
          } else if (res.cancel) {
          }
        }
      });
    },
    editGoods() {
      wx.navigateTo({
        url: "/pages/goodsManage/main?id=" + this.selectGoods.goodsId
      });
    },
    manageGoods(e, index) {
      this.selectGoods = this.spus.datas[index];
      this.selectIndex = index;
      this.showEdit = true;
      this.divStyle = "top:" + (2 * e.target.y - 50) + "rpx;";
      return false;
    },
    openLocation() {
      var shop = this.shopInfo;
      wx.openLocation({
        latitude: Number(shop.wxAddress.latitude),
        longitude: Number(shop.wxAddress.longitude),
        scale: 28
      });
    },
    clickCall() {
      var tel = this.shopInfo.tel;
      wx.showActionSheet({
        title: "商家电话",
        itemList: tel,
        success(res) {
          wx.makePhoneCall({ phoneNumber: tel[res.tapIndex] + "" });
        }
      });
    },
    clearCart() {
      var goodsMap = this.cartMap;
      for (var key in goodsMap) {
        if (goodsMap.hasOwnProperty(key)) {
          goodsMap[key].sequence = 0;
        }
      }
      if (this.shopInfo.categoryModelList) {
        for (var index in this.shopInfo.categoryModelList) {
          this.shopInfo.categoryModelList[index].totalPrice = 0;
          this.shopInfo.categoryModelList[index].count = 0;
        }
      }
      this.showCart = false;
    },
    scroll(e) {
      var value = this.currentScroll - e.target.scrollTop;
      if (Math.abs(value) > 0) {
        this.currentScroll = e.target.scrollTop;
        this.showEdit = false;
      }
    },
    //滚动条滚到底部或右边的时候触发
    lower(e) {
      if (this.spus.page > 0) {
        wx.showLoading({ title: "加载中...", mask: true });
        getFetch(
          "/goods/list/" + this.shopInfo.shopId,
          { page: this.spus.page, categoryId: this.spus.categoryId, status: 1 },
          false
        ).then(response => {
          var goods = response.result.list;
          for (var index1 in goods) {
            var g = this.cartMap[goods[index1].goodsId];
            if (g) {
              goods[index1].sequence = g.sequence;
              goods[index1].oldData = true;
              this.cartMap[goods[index1].goodsId] = goods[index1];
            }
          }
          this.spus.datas = [...this.spus.datas, ...goods];
          this.spus.page = response.result.nextPage;
          wx.hideLoading();
        });
      }
    },
    //控制购物列表是否显示
    toggleCartList() {
      this.cartGoodsList1.length ? (this.showCart = !this.showCart) : true;
    },
    orderClick() {
      if (this.shopInfo) {
        var price = 0;
        if (this.shopInfo.categoryModelList) {
          this.shopInfo.categoryModelList.map(
            item => (price += item.totalPrice)
          );
        }
        if (this.shopInfo.status != 1 || price < this.shopInfo.min_price)
          return;
        this.closeShoppingCartAction1();
      }
    },
    closeShoppingCartAction1() {
      var array = this.shopInfo.categoryModelList;
      var selectedArr = [];
      this.cartGoodsList1.map((item, index) => {
        var price = item.min_price * item.sequence;
        item.totalPrice = parseFloat(price).toFixed(2);
        selectedArr.push(item);
      });
      var order = {};
      order.shopInfo = this.shopInfo;
      order.itemList = selectedArr;
      this.createOrderDetailAction({ order });
    },
    categoryClick(item, index) {
      this.tagIndex = index;
      this.showEdit = false;
      var categoryId = item.categoryId;
      this.getCategoryMenuDataAction({ categoryId, index });
    },
    menuClick() {
      this.showEdit = false;
      this.left = 40 + "rpx";
      this.pageIndex = 0;
    },
    shopClick() {
      this.showEdit = false;
      this.left = 182 + "rpx";
      this.pageIndex = 1;
    },
    skuClick(item, index) {
      this.selectSkuAction({ item, index });
    },
    addClick(item, index, categoryIndex) {
      this.addItemAction({ item, index, categoryIndex });
    },
    reduceClick(item, index, categoryIndex) {
      this.reduceItemAction({ item, index, categoryIndex });
    },
    closeSku() {
      this.changeSkuModalMut(false);
    },
    attrClick(itm, idx, setIdx) {
      this.attrSelectAction({ itm, idx, setIdx });
    },
    modalAdd() {
      var skuInfo = this.skuInfo;
      const { item, index } = skuInfo;
      this.addItemAction({ item, index });
      this.changeSkuModalDataAction({ num: 1 });
    },
    modalReduce() {
      var skuInfo = this.skuInfo;
      const { item, index } = skuInfo;
      this.reduceItemAction({ item, index });
      this.changeSkuModalDataAction({ num: -1 });
    },
    closePreview() {
      this.changeItemModalMut(false);
    },
    itemClick(item, index) {
      this.previewItemAction({ item, index });
    },
    previewAdd() {
      var item = this.previewInfo;
      this.addItemAction({ item, index: item.preIndex });
    },
    previewReduce() {
      var item = this.previewInfo;
      this.reduceItemAction({ item, index: item.preIndex });
    },
    previewAttr() {
      this.changeItemModalMut(false);
      var item = this.previewInfo;
      this.selectSkuAction({ item, index: item.preIndex });
    },
    goHome() {
      if (!this.userInfo.addressModel) {
        this.userInfo.addressModel = this.shopInfo.addressModel;
      }
      wx.switchTab({
        url: "/pages/home/main"
      });
    },
    searchClick() {
      wx.navigateTo({
        url: "/pages/searchList/main?shopId=" + this.shopInfo.shopId
      });
    },
     update() {
      this.showEdit = false;
      return false;
    },
  },
  onShow(options) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    if (currPage.data.update) {
      this.getMenuDataAction({
        shopId: this.shopId,
        index: this.tagIndex,
        flag: true
      });
    }
  },
  onLoad(options) {
    var location = this.userInfo.location;
    var data = {};
    if (location) {
      data = {
        longitude: location.lng,
        latitude: location.lat
      };
    }
    this.pageIndex = 0;
    var that = this;
    this.shopId = options.shopId;
    if (!this.shopId) {
      this.shopId = this.userInfo.shopId;
    }
    var update = false;
    this.showCart = false;
    if (options.update == "true") {
      update = true;
    }
    if (this.shopId != this.shopInfo.shopId) {
      this.tagIndex = 0;
    }
    this.getMenuDataAction({
      shopId: this.shopId,
      data: data,
      index: this.tagIndex,
      flag: update
    });
  },
  onShareAppMessage: function() {
    return {
      title: this.shopInfo.shopName,
      path: "/pages/index/main?shopId=" + this.shopInfo.shopId
    };
  },
  onShow(options) {
    this.showEdit = false;
  }
};
</script>

<style lang="scss" scoped>
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
.div-title {
  float: left;
}
.shop-logo {
  height: 120rpx;
  width: 120rpx;
  border-radius: 8rpx;
}

.header-r {
  display: flex;
  align-items: center;
  flex: 1;
  background-color: #fff;
  height: 60rpx;
  border-radius: 30rpx;
  margin-left: 50rpx;
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

.screen_cover {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 11;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart_food_list {
  position: fixed;
  width: 100%;
  padding-bottom: 1rem;
  z-index: 12;
  bottom: 0;
  left: 0;
  background-color: #fff;

  header {
    display: flex;
    align-items: center;
    padding: 10rpx 10rpx;
    background-color: #eceff1;
    justify-content: space-between;
    align-items: center;
  }

  .cart_food_details {
    background-color: #fff;
    max-height: 550rpx;
    overflow-y: auto;

    .cart_food_li {
      display: flex;
      justify-content: space-between;
      border-bottom: 2rpx solid $spLine-color;
      padding: 5rpx 40rpx;
      height: 80rpx;
      align-items: center;
      font-size: 32rpx;
      color: #000;

      .cart_list_num {
        width: 55%;

        p:nth-of-type(1) {
          font-weight: bold;
        }

        p:nth-of-type(2) {
        }
      }

      .cart_list_price {
        span:nth-of-type(1) {
          color: #666;
          font-family: Helvetica Neue, Tahoma;
        }

        span:nth-of-type(2) {
          color: #666;
          font-family: Helvetica Neue, Tahoma;
          font-weight: bold;
        }
      }

      .cart_list_control {
        display: flex;
        align-items: center;

        span {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        svg {
          fill: #3190e8;
        }

        .specs_reduce_icon {
          fill: #999;
        }

        .cart_num {
          min-width: 0.5rem;
          text-align: center;
          font-family: Helvetica Neue, Tahoma;
        }
      }
    }
  }
}

.container {
  display: flex;
  flex-direction: column;
  background-color: $page-bgcolor;
  position: relative;

  .header-c {
    display: flex;
    flex-direction: column;

    .header {
      display: flex;
      background-color: white;
      height: 130rpx;

      .h-l {
        display: flex;
        margin-left: 16rpx;
      }

      .h-r {
        display: flex;
        flex-direction: column;
        margin: 0 20rpx;

        .r-t {
          display: flex;
          align-items: center;

          .t-l {
            font-size: 22rpx;
          }

          .s-l {
            margin: 0 20rpx;
            width: 2rpx;
            height: 30rpx;
            background-color: white;
          }

          .t-m {
            font-size: 22rpx;
          }

          .s-r {
            margin: 0 20rpx;
            width: 2rpx;
            height: 30rpx;
            background-color: white;
          }

          .t-r {
            font-size: 22rpx;
          }
        }

        .r-l {
          font-size: 22rpx;
          line-height: 30rpx;
          height: 30rpx;
          overflow: hidden;
        }

        .r-m {
          font-size: 22rpx;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .r-b {
          display: flex;
          align-items: center;

          .b-l {
            width: 30rpx;
            height: 60rpx;
            background-color: #ff616d;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            font-size: 22rpx;
          }

          .b-r {
            font-size: 22rpx;
            color: white;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            display: inline-block;
            margin-left: 20rpx;
          }

          i {
            font-size: 22rpx;
            color: white;
          }
        }
      }
    }

    .cate-c {
      display: flex;
      height: 70rpx;
      align-items: center;
      border-bottom: 2rpx solid $spLine-color;
      position: relative;
      transition: all 0.2s;

      .c-l {
        font-size: 32rpx;
        color: $textBlack-color;
        margin-left: 40rpx;
      }

      .c-m {
        font-size: 32rpx;
        color: $textBlack-color;
        margin-left: 80rpx;
      }

      .c-r {
        font-size: 32rpx;
        color: $textBlack-color;
        margin-left: 80rpx;
      }

      .c-main {
        position: absolute;
        font-size: 32rpx;
        color: $textBlack-color;
        right: 30rpx;
      }

      .line {
        position: absolute;
        width: 60rpx;
        height: 4rpx;
        background-color: $theme-color;
        left: 40rpx;
        bottom: 2rpx;
        transition: left 0.2s;
      }
    }
  }

  .list-c {
    display: flex;
    position: fixed;
    top: 200rpx;
    width: 100%;
    bottom: 100rpx;

    .list-l {
      display: flex;
      flex-direction: column;
      width: 160rpx;
      background-color: $page-bgcolor;

      .l-item {
        display: flex;
        width: 160rpx;
        align-items: center;
        justify-content: center;
        padding: 20rpx;
        box-sizing: border-box;
        position: relative;

        img {
          width: 30rpx;
          height: 30rpx;
          background-size: cover;
          border-radius: 15rpx;
        }

        span {
          font-size: 24rpx;
          color: $textDarkGray-color;
          margin-left: 10rpx;
        }

        .count {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: $mtRed-color;
          width: 30rpx;
          height: 30rpx;
          border-radius: 15rpx;
          right: 0;
          top: 6rpx;
          position: absolute;
          font-size: 20rpx;
          color: white;
        }
      }

      .active {
        background-color: white;

        span {
          color: #000;
          font-weight: bold;
        }
      }
    }

    .list-r {
      display: block;
      flex-direction: column;
      flex: 1;
      background-color: white;

      .section {
        display: flex;
        height: 70rpx;
        align-items: center;
        margin-left: 20rpx;

        span {
          font-size: 28rpx;
          color: $textBlack-color;
        }
      }

      .item-list {
        display: flex;
        margin: 0 20rpx;
        flex-direction: column;

        .item {
          display: flex;
          margin-bottom: 30rpx;

          .item-l {
            img {
              width: 160rpx;
              height: 160rpx;
              background-size: cover;
            }
          }

          .item-r {
            display: flex;
            flex-direction: column;
            margin-left: 20rpx;
            justify-content: space-between;
            flex: 1;

            .title {
              font-size: 28rpx;
              color: $textBlack-color;
              font-weight: bold;
              overflow: hidden;
              line-height: 30rpx;
              height: 30rpx;
            }

            .sub-title {
              font-size: 20rpx;
              color: $textDarkGray-color;
              line-height: 30rpx;
              overflow: hidden;
              height: 30rpx;
              margin-top: 10rpx;
            }

            .sale-num {
              font-size: 20rpx;
              color: $textDarkGray-color;
              margin-top: 10rpx;
            }

            .r-t {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .price {
                font-size: 32rpx;
                color: $mtRed-color;
                font-weight: bold;
              }

              .sku {
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: $theme-color;
                padding: 8rpx 12rpx;
                border-radius: 25rpx;
                position: relative;

                span {
                  font-size: 20rpx;
                  color: $textBlack-color;
                }

                .count {
                  width: 30rpx;
                  height: 30rpx;
                  background-color: $mtRed-color;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: absolute;
                  color: white;
                  font-size: 20rpx;
                  right: 0;
                  top: -14rpx;
                  border-radius: 15rpx;
                }
              }

              .add-item {
                display: flex;
                align-items: center;

                .add-l {
                  display: flex;
                  flex-direction: row;
                  align-items: center;

                  i {
                    font-size: 50rpx;
                    color: $textGray-color;
                  }

                  span {
                    font-size: 32rpx;
                    color: $textBlack-color;
                    margin: 0 20rpx;
                  }
                }

                .add-r {
                  i {
                    color: #ff6347;
                    font-size: 54rpx;
                  }
                }
              }
            }

            .tags-c {
              display: flex;
              align-items: center;
              margin-top: 10rpx;
              flex-wrap: wrap;

              img {
                width: 60rpx;
                height: 30rpx;
                background-size: cover;
              }
            }
          }
        }
      }
    }

    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
  }

  .comment-c {
    .comment-sc {
      display: flex;
      position: fixed;
      top: 220rpx;
      flex-direction: column;
      height: 100%;

      .comment-header {
        margin-top: 20rpx;
        display: flex;
        align-items: center;
        height: 140rpx;
        background-color: white;
        width: 100%;
        justify-content: space-around;

        .h-l {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .score {
            font-size: 50rpx;
            color: $theme-color;
          }

          .title {
            font-size: 20rpx;
            color: $textBlack-color;
          }
        }

        .h-m {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;

          .m-t {
            display: flex;
            align-items: center;

            .title {
              font-size: 20rpx;
              color: $textBlack-color;
            }

            .star-c {
              display: flex;
              align-items: center;
              margin: 0 30rpx;

              i {
                color: $theme-color;
                font-size: 24rpx;
              }
            }

            .score {
              font-size: 24rpx;
              color: $theme-color;
            }
          }

          .m-b {
            @extend .m-t;
          }
        }

        .line {
          width: 2rpx;
          height: 80rpx;
          background-color: $spLine-color;
          margin-left: 30rpx;
        }

        .h-r {
          @extend .h-l;

          .score {
            color: $textDarkGray-color;
          }
        }
      }

      .comment-tags {
        margin-top: 20rpx;
        display: flex;
        background-color: white;
        padding: 30rpx;
        width: auto;
        flex-wrap: wrap;
        padding-top: 12rpx;

        .tag-item {
          background-color: white;
          border: 2rpx solid $spLine-color;
          padding: 0 16rpx;
          margin-right: 20rpx;
          margin-top: 18rpx;
          align-items: center;
          justify-content: center;
          line-height: 50rpx;

          span {
            font-size: 24rpx;
            color: $textDarkGray-color;
          }
        }

        .tag-item:first-child {
          background-color: #fff7e2;
          border: 2rpx solid#F0EDBA;

          span {
            color: #e7ac40;
          }
        }
      }

      .comment-list {
        margin-top: 20rpx;
        display: flex;
        flex-direction: column;

        .item-c {
          display: flex;
          overflow: hidden;
          background-color: white;
          border-bottom: 2rpx solid $spLine-color;

          .item-l {
            margin-left: 30rpx;
            margin-top: 20rpx;

            img {
              width: 70rpx;
              height: 70rpx;
              border-radius: 35rpx;
            }
          }

          .item-r {
            display: flex;
            flex-direction: column;
            background-color: white;
            margin-left: 20rpx;
            margin-top: 20rpx;
            margin-right: 30rpx;
            flex: 1;

            .h-r {
              display: flex;
              flex-direction: column;
              flex: 1;

              .r-t {
                display: flex;
                justify-content: space-between;

                .name {
                  font-size: 32rpx;
                  color: $textBlack-color;
                }

                .date {
                  font-size: 20rpx;
                  color: $textGray-color;
                }
              }

              .r-b {
                display: flex;
                align-items: center;

                .b-l {
                  display: flex;
                  align-items: center;

                  i {
                    font-size: 20rpx;
                    color: $theme-color;
                  }
                }

                .b-r {
                  font-size: 201rpx;
                  color: $textGray-color;
                  margin-left: 20rpx;
                }
              }
            }

            .r-comtent {
              display: flex;
              margin-top: 10rpx;

              span {
                font-size: 24rpx;
                color: $textBlack-color;
              }
            }

            .r-imgs {
              display: flex;
              flex-direction: row;
              margin-top: 10rpx;

              .single {
                margin-top: 10rpx;

                img {
                  width: 300rpx;
                  height: 300rpx;
                }
              }

              .double {
                img {
                  width: 160rpx;
                  height: 160rpx;
                  margin-right: 16rpx;
                }
              }

              .four {
                display: flex;
                width: 300rpx;
                flex-wrap: wrap;
                justify-content: space-between;

                img {
                  width: 140rpx;
                  height: 140rpx;
                  margin: 10rpx 0;
                }
              }
            }

            .food-name {
              display: flex;
              flex-direction: column;
              margin-top: 10rpx;

              .name-t {
                display: flex;

                i {
                  font-size: 24rpx;
                  color: $textGray-color;
                }

                span {
                  font-size: 24rpx;
                  color: #777d8a;
                  margin-left: 20rpx;
                }
              }

              .name-b {
                @extend .name-t;
                margin-top: 8rpx;

                span {
                  color: $textBlack-color;
                }
              }
            }

            .reply-c {
              display: flex;
              background-color: #f4f4f4;
              padding: 20rpx 14rpx;
              margin-top: 20rpx;
              margin-bottom: 30rpx;

              span {
                color: $textGray-color;
                font-size: 24rpx;
              }
            }
          }
        }

        .item-c:last-child {
          margin-bottom: 220rpx;
        }
      }
    }
  }

  .shop-info {
    display: flex;
    position: fixed;
    top: 220rpx;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .address {
      display: flex;
      align-items: center;
      height: 70rpx;
      margin-top: 20rpx;
      background-color: white;
      padding: 0 20rpx;

      i {
        font-size: 38rpx;
        color: $textGray-color;
      }

      i:last-child {
        color: $textBlack-color;
      }

      span {
        flex: 1;
        margin: 0 20rpx;
        font-size: 24rpx;
        color: $textBlack-color;
      }
    }

    .archive {
      @extend .address;

      i:last-child {
        font-size: 24rpx;
        color: $textGray-color;
      }
    }

    .delivery {
      display: flex;
      flex-direction: column;
      margin-top: 20rpx;
      background-color: white;
      padding: 0 16rpx;

      .top {
        display: flex;
        align-items: center;
        height: 80rpx;
        padding-left: 10rpx;
        border-bottom: 2rpx solid $spLine-color;

        i {
          font-size: 32rpx;
          color: $textGray-color;
        }

        span {
          font-size: 24rpx;
          color: $textBlack-color;
          margin: 0 20rpx;
        }
      }

      .btm {
        @extend .top;
        border-bottom: 0 solid $spLine-color;
      }

      .notice {
        font-size: 24rpx;
        display: flex;
        align-items: center;
        padding-left: 10rpx;
        border-bottom: 2rpx solid $spLine-color;
        border-bottom: 0 solid $spLine-color;
      }
    }

    .service {
      display: flex;
      flex-direction: column;
      margin-top: 20rpx;
      background-color: white;
      padding: 0 16rpx;

      .top {
        display: flex;
        align-items: center;
        height: 80rpx;
        padding-left: 14rpx;
        border-bottom: 2rpx solid $spLine-color;

        i {
          font-size: 28rpx;
          color: $textGray-color;
        }

        .l {
          font-size: 24rpx;
          color: $textBlack-color;
          margin-left: 20rpx;
        }

        .k {
          width: 30rpx;
          height: 30rpx;
          align-items: center;
          justify-content: center;
          display: flex;
          text-align: center;
          border: 2rpx solid #0095d8;
          color: #0095d8;
          font-size: 20rpx;
          margin-left: 10rpx;
        }

        .v {
          font-size: 24rpx;
          color: $textBlack-color;
          margin-left: 10rpx;
        }
      }

      .discounts {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 0 16rpx;
        padding-bottom: 20rpx;

        .item {
          display: flex;
          align-items: center;
          height: 60rpx;
          margin-top: 10rpx;

          img {
            width: 30rpx;
            height: 30rpx;
          }

          span {
            font-size: 24rpx;
            color: $textBlack-color;
            margin-left: 20rpx;
          }
        }
      }
    }
  }

  .footer-c {
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 0;
    height: 100rpx;
    background-color: #333;
    z-index: 990;
    width: 100%;

    .c-t {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50rpx;
      background-color: #ffefd2;

      span {
        font-size: 20rpx;
        color: $textBlack-color;
      }
    }

    .c-m {
      display: flex;
      justify-content: center;
      height: 100rpx;
      margin-left: 140rpx;

      .l {
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: space-around;

        .price {
          font-size: 24rpx;
          color: white;

          span {
            font-size: 40rpx;
            color: white;
          }
        }

        .m-l {
          display: flex;
          align-items: center;
          background-color: #2f2f2f;

          .l-l {
            font-size: 24rpx;
            color: $textDarkGray-color;
          }

          .l-m {
            width: 2rpx;
            height: 20rpx;
            background-color: $textDarkGray-color;
            margin: 0 20rpx;
          }

          .l-r {
            font-size: 24rpx;
            color: $textDarkGray-color;
          }
        }
      }

      .m-r {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 200rpx;
        height: 100rpx;
        background-color: #2f2f2f;

        span {
          font-size: 32rpx;
          color: $textDarkGray-color;
          font-weight: bold;
        }
      }
    }

    .cart-c {
      position: absolute;
      left: 20rpx;
      bottom: -1rpx;
      z-index: 991;

      i {
        font-size: 75rpx;
        background-size: cover;
      }

      span {
        position: absolute;
        right: 0;
        top: 20rpx;
        background-color: $mtRed-color;
        width: 30rpx;
        height: 30rpx;
        border-radius: 15rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20rpx;
      }
    }
  }

  .sku-modal {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.3);
    z-index: 996;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;

    .modal-c {
      display: flex;
      flex-direction: column;
      background-color: white;
      width: 90%;
      margin-right: 40rpx;
      margin-left: 40rpx;
      border-radius: 10rpx;

      .header {
        display: flex;
        flex-direction: column;

        .title {
          font-size: 32rpx;
          color: $textDarkGray-color;
          align-self: center;
          margin-top: 20rpx;
        }

        .attrs {
          display: flex;
          flex-direction: column;
          margin: 0 20rpx;
          margin-top: 20rpx;

          .name {
            font-size: 28rpx;
            color: $textBlack-color;
          }

          .sku {
            display: flex;
            flex-direction: row;
            width: 100%;
            flex-wrap: wrap;
            margin-bottom: 20rpx;

            .item {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 140rpx;
              height: 50rpx;
              border: 2rpx solid $spLine-color;
              border-radius: 4rpx;
              margin-top: 20rpx;
              margin-right: 20rpx;

              span {
                font-size: 24rpx;
                color: $textBlack-color;
              }
            }

            .selected {
              background-color: #fff9f4;
              border: 2rpx solid $theme-color;

              span {
                color: $theme-color;
              }
            }
          }
        }
      }

      .footer {
        display: flex;
        align-items: center;
        background-color: $page-bgcolor;
        height: 100rpx;
        border-bottom-right-radius: 10rpx;
        border-bottom-left-radius: 10rpx;
        padding: 0 20rpx;

        .f-l {
          display: flex;
          align-items: center;
          flex: 1;

          .price {
            font-size: 36rpx;
            color: $mtRed-color;
            font-weight: bold;
          }

          .sku {
            font-size: 20rpx;
            color: $textBlack-color;
            margin-left: 20rpx;
          }
        }

        .f-r {
          display: flex;
          align-items: center;

          .shopping-c {
            display: flex;
            align-items: center;
            height: 60rpx;
            border-radius: 30rpx;
            padding: 0 20rpx;
            background-color: $theme-color;

            i {
              font-size: 28rpx;
              color: $textBlack-color;
            }

            span {
              font-size: 24rpx;
              color: $textBlack-color;
              margin-left: 10rpx;
            }
          }

          .add {
            display: flex;
            flex-direction: row;
            align-items: center;

            span {
              font-size: 24rpx;
              color: $textDarkGray-color;
              margin: 0 20rpx;
            }
          }
        }
      }
    }

    .cancle {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 40rpx;
      width: 70rpx;
      height: 70rpx;
      border-radius: 35rpx;
      background: rgba($color: #000000, $alpha: 0.5);
      border: 2rpx solid $textGray-color;

      i {
        font-size: 32rpx;
        color: white;
      }
    }
  }

  .previewModal {
    @extend .sku-modal;

    .modal-c {
      .header-p {
        display: flex;
        flex-direction: column;

        .item-img {
          width: 100%;
          height: 400rpx;
          background-color: #e7ac40;
          border-top-left-radius: 10rpx;
          border-top-right-radius: 10rpx;
        }

        .title {
          font-size: 28rpx;
          color: $textBlack-color;
          font-weight: bold;
          margin-left: 16rpx;
          margin-top: 16rpx;
        }

        .saled {
          display: flex;
          align-items: center;
          flex-direction: row;
          margin: 0 16rpx;
          margin-top: 10rpx;

          .l {
            font-size: 20rpx;
            color: $textDarkGray-color;
          }

          .r {
            @extend .l;
            margin-left: 30rpx;
          }
        }

        .tags-c {
          display: flex;
          align-items: center;
          margin: 0 16rpx;
          margin-top: 10rpx;
          flex-wrap: wrap;

          img {
            width: 60rpx;
            height: 30rpx;
            background-size: cover;
          }
        }

        .desc {
          font-size: 20rpx;
          color: $textDarkGray-color;
          margin-left: 16rpx;
          margin-top: 30rpx;
          margin-bottom: 20rpx;
        }
      }

      .footer-p {
        display: flex;
        align-items: center;
        height: 80rpx;
        background-color: $page-bgcolor;
        padding: 0 20rpx;
        border-bottom-left-radius: 10rpx;
        border-bottom-right-radius: 10rpx;

        .l {
          font-size: 36rpx;
          color: $mtRed-color;
          flex: 1;
          font-weight: bold;
        }

        .r {
          display: flex;
          align-items: center;

          .add-c {
            display: flex;
            align-items: center;

            .c-l {
              display: flex;
              align-items: center;
            }

            span {
              font-size: 20rpx;
              color: $textBlack-color;
              margin: 0 20rpx;
            }
          }

          .attr {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: $theme-color;
            padding: 8rpx 12rpx;
            border-radius: 25rpx;
            position: relative;

            span {
              font-size: 20rpx;
              color: $textBlack-color;
            }

            .count {
              width: 30rpx;
              height: 30rpx;
              background-color: $mtRed-color;
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              color: white;
              font-size: 20rpx;
              right: 0;
              top: -14rpx;
              border-radius: 15rpx;
            }
          }
        }
      }
    }
  }
}
</style>