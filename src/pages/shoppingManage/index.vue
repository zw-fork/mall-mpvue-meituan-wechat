<template>
  <div class="container" @click="update" @mousedown="update">
    <div class="header-c">
      <div class="cate-c">
        <span
          class="c-l"
          :style="{'font-weight': pageIndex === 0 ? lineStyle : null}"
          @click="shopClick(0)"
        >全部</span>
        <span
          class="c-m"
          :style="{'font-weight': pageIndex === 1 ? lineStyle : null}"
          @click="shopClick(1)"
        >在售</span>
        <span class="c-m" @click="shopClick(2)" :style="{'font-weight': pageIndex === 2 ? lineStyle : null}">下架</span>
        <div class="header-r" @click="searchClick" style=" position: absolute;right:10rpx;">
          <i class="icon iconfont iconsearch"></i>
          <span>搜索商品</span>
        </div>
      </div>
    </div>
    <div class="list-c">
      <div class="list-ll">
      <scroll-view class="list-l" :scroll-y="true">
        <div
          class="l-item"
          :class="{active: index === tagIndex}"
          v-for="(item, index) in shopInfo.categoryModelList"
          :key="index"
          @click="categoryClick(item, index)"
        >
          <span>{{item.name}}</span><span v-if="item.status==2">(隐藏)</span>
        </div>
      </scroll-view>
        </div>
        <div>


       <div class="list-r1">    
      <div class="category-c">
        <scroll-view class="l" scroll-x :scroll-into-view="idx">
          <div class="tab-item" :class="{active: index === childIndex}" 
          v-for="(item, index) in datas" :key="index">
              <span :id="'x_' + index" @click="changeCategory(item, index)">{{item.name}}</span>
            </div>
        </scroll-view>
        <div class="r">
          <i class="icon mt-arrow-down-o"></i>
        </div>
      </div>
      </div>
 <div class="list-rr">

      <scroll-view
        class="list-r"
        :scroll-y="true"
        @scrolltolower="lower"
        :scroll-top="scrollTop"
        @scroll="scroll"
        :scroll-into-view="id"
      >
      <div v-for="(item, index) in spus.datas" :key="index">
        <div class="section">
          <span :id="'y_' + index" class="title">{{item.name}}</span>
        </div>
        <div class="item-list" v-for="(goods, index2) in item.goodsList" :key="index2">
          <div class="item" v-if="goods.goodsId">
            <div class="item-l">
              <img :src="path + goods.picture"> 
            </div>
            <div class="item-r">
              <div
                class="div-title"
                v-if="userInfo.role>0 && userInfo.shopId==shopInfo.shopId && showManage"
              >
                <span class="title">{{goods.name}}</span>
                <i
                @click.stop="manageGoods($event, goods, index, index2)"
                  class="icon iconfont icondian"
                  style="float:right;position:relative;display:inline-block"
                ></i>
              </div>
              <span class="title" v-else>{{goods.name}}</span>
              <span class="sub-title">{{goods.barcode}}</span>
              <div class="r-t"> 
                <span class="price">￥{{goods.min_price}}</span><span v-if="goods.status==2">已下架</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </scroll-view>
      </div>
        </div>
    </div>
    <div class="screen_cover" v-show="showCart && productCount > 0" @click="toggleCartList"></div>
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
              <div class="modalFooter">
          <div class="btnCancel" @click="categoryManage">分类管理</div>
          <div @click="addGoods"
            class="btnConfirm"
          >添加商品</div>
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
      childIndex: 0,
      hightArr: [],
      selectGoods: undefined,
      shopId: undefined,
      showEdit: false,
      showManage: false,
      show: false,
      divStyle: "",
      id:undefined,
      idx: undefined,
      scrollTop: undefined,
      currentScroll: 0,
      showCart: false,
      tagIndex: 0,
      goodsValue: {},
      pageIndex: 0,
      left: "40rpx",
      index: undefined,
      index2: undefined,
      cartGoodsList1: []
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
    bottomStyle() {
      if (this.showManage) {
        return "bottom: 0rpx;";
      }
      return "bottom: 100rpx;";
    },
    lineStyle() {
      return "bold;padding-bottom:2px; border-bottom:2px solid #F00;";
    },
    path() {
      return `${GOODS_URL_PREFIX}`;
    },
    datas() {
       if (this.spus.datas) {
        var that = this;
        setTimeout(function(){
　　　　        that.infoScroll();
    　　}, 1500);
    return this.spus.datas;
       }
       return undefined;
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
      "closeShoppingCartAction",
      "selectSkuAction",
      "changeSkuDataMut",
      "attrSelectAction",
      "changeSkuModalDataAction",
      "previewItemAction"
    ]),
    categoryManage() {
      wx.navigateTo({ url: "/pages/categoryList/main" });
    },
    addGoods() {
      wx.navigateTo({ url: "/pages/goodsManage/main" });
    },
        changeCategory(item, index) {
      this.childIndex = index;

      this.id='y_' + index;
    },
      infoScroll(){
    var that = this;
    if (that.spus.datas) {
          var len = that.spus.datas.length;
    var height = 0;
    var hightArr = [];
    for (var i = 0; i < len; i++) { //productList
      //获取元素所在位置
      var query = wx.createSelectorQuery();
      var idView = "#y_" + i;
      query.select(idView).boundingClientRect();
      query.exec(function (res) {
        if (res[0]) {
                  var top = res[0].top;
        hightArr.push(top);
        that.hightArr = hightArr
        }
      });
    };
    }
  },
    copy() {
      wx.setClipboardData({data: this.shopInfo.wechatId});
    },
    updateGoods(goodsModel) {
      postFetch("/goods/upload2", goodsModel, true).then(response => {
        this.showEdit = false;
        this.updateGoodsValue();
        if (goodsModel.status==0) {
                this.scrollTop = this.currentScroll;
            this.getMenuDataAction({
              shopId: this.shopId,
              index: this.tagIndex,
              data: this.goodsValue,
              flag: true
            });
        }
      });
    },
    shopClick(value) {
      this.showEdit = false; 
      this.pageIndex = value;
      this.updateGoodsValue();
      this.getMenuDataAction({
              shopId: this.shopId,
              index: this.tagIndex,
              data: this.goodsValue,
              flag: true
      });
    },
    updateGoodsValue() {
      var data = {};
        if (this.pageIndex == 1) {
          data.categoryStatus = 1;
          data.goodsStatus = 1; 
        } else if (this.pageIndex == 2) {
          data.goodsStatus = 2;       
        }
      this.goodsValue = data;
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
    upGoods() {
      var that = this;
      wx.showModal({
        content: "确定上架当前商品？",
        confirmColor: "#FFC24A",
        success: function(res) {
          if (res.confirm) {
            that.selectGoods.status = 1;
            this.index2 = index2;
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
        url: "/pages/goodsManage/main?id=" + this.selectGoods.goodsId + "&index=" + this.tagIndex + "&childIndex=" + this.childIndex
      });
    },
    manageGoods(e, goods, index, index2) {
      this.selectGoods = goods;
      this.showEdit = true;
      this.index = index;
      this.index2 = index2;
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
      if (this.hightArr.length>0) {
        var scrollTop = e.target.scrollTop;
        var scrollArr = this.hightArr;
        for (var i = 0; i < scrollArr.length; i++) {
          if (scrollTop >= 0 && scrollTop < scrollArr[1] - scrollArr[0]) {
            this.childIndex = 0
            this.idx = 'x_' + this.childIndex;
            break;
          } else if (scrollTop >= scrollArr[i] - scrollArr[0] && scrollTop < scrollArr[i + 1] - scrollArr[0]) {
            this.childIndex = i
            this.idx = 'x_' + this.childIndex;
            break;
          } else if (scrollTop >= scrollArr[scrollArr.length - 1] - scrollArr[0]) {
            this.childIndex = scrollArr.length - 1
            this.idx = 'x_' + this.childIndex;
            break;
          }
        }
      }
    },
    //滚动条滚到底部或右边的时候触发
    lower(e) {
      if (this.spus.page > 0) {
        getFetch(
          "/goods/list/" + this.shopInfo.shopId,
          { page: this.spus.page, categoryId: this.spus.categoryId, status: 1,categoryStatus:1 },
          true
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
    },
    categoryClick(item, index) {
      this.id= undefined;
      this.tagIndex = index;
      this.showEdit = false;
      var categoryId = item.categoryId;
      this.scrollTop = undefined;
      if (this.currentScroll > 0) {
        this.scrollTop = 0;
      }
      var data = this.goodsValue;
      this.getCategoryMenuDataAction({ categoryId, index, data });
    },
    menuClick() {
      this.showEdit = false;
      this.left = 40 + "rpx";
      this.pageIndex = 0;
    },
    skuClick(item, index) {
      this.selectSkuAction({ item, index });
    },
    closeSku() {
      this.changeSkuModalMut(false);
    },
    attrClick(itm, idx, setIdx) {
      this.attrSelectAction({ itm, idx, setIdx });
    },
    closePreview() {
      this.changeItemModalMut(false);
    },
    itemClick(item, index) {
      this.previewItemAction({ item, index });
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
        url: "/pages/goodsList/main?shopId=" + this.shopInfo.shopId
      });
    },
     update() {
      this.showEdit = false;
      return false;
    },
  },
  onShow(options) {
    var data = {};
    if (this.pageIndex == 1) {
      data.categoryStatus = 1;
      data.goodsStatus = 1; 
    } else if (this.pageIndex == 2) {
      data.goodsStatus = 2;       
    }
    this.showEdit = false;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    if (currPage.data.update) {
      this.scrollTop = this.currentScroll;
      this.tagIndex = currPage.data.index;
      this.getMenuDataAction({
        shopId: this.shopId,
        index: this.tagIndex,
        data: data,
        flag: true
      });
    }
  },
  onLoad(options) {
    var data = {};
    this.pageIndex = 0;
    var that = this;
    this.shopId = options.shopId;
    if (!this.shopId) {
      this.shopId = this.userInfo.shopId;
      this.showManage = this.shopId ? true: false;
    }
    this.showCart = false;
    if (this.shopId != this.shopInfo.shopId) {
      this.tagIndex = 0;
    }
    this.getMenuDataAction({
      shopId: this.shopId,
      data: data,
      index: this.tagIndex,
      flag: true
    });
  },
  onShareAppMessage: function() {
    return {
      title: this.shopInfo.shopName,
      path: "/pages/index/main?shopId=" + this.shopInfo.shopId
    };
  }
};
</script>

<style lang="scss" scoped>
.modalFooter {
  box-sizing: border-box;
  display: flex;
  width:100%;
  flex-direction: row;
  height: 80rpx;
  border-top: 1rpx solid #e5e5e5;
  font-size: 26rpx;
  background-color: #f4f4f4;
  line-height: 80rpx;
  position: fixed;
  bottom: 0rpx;
}

.btnCancel {
  width: 50%;
  color: #333;
  text-align: center;
  border-right: 1rpx solid #e5e5e5;
}  

.btnConfirm {
  width: 50%;
  color: #333;
  text-align: center;
}
  .category-c {
    width:80%;
left:0rpx;
top:0rpx;
      display: flex;
      height: 70rpx;
      position: relative;   
      white-space:nowrap;
      background-color: #FAFAFA;
      .l {
              display: flex;
      flex-direction: column;
        line-height: 70rpx;
        white-space: nowrap;
        position: relative;
        	        .active {
          color: $theme-color;
          font-weight: bold;

          }
        .tab-item {
          transition: all 0.2s;
          font-size: 24rpx;
          height: 70rpx;
          display: inline-block;
          color: $textDarkGray-color;
          margin: 0 30rpx;
        }
      }
      .r {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70rpx;
        height: 70rpx;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #FAFAFA;
        flex: 1;
        i {
          font-size: 24rpx;
          color: $textGray-color;
        }
      }
    }
.btn {
    float: left;
    display: flex;
    background-color: $page-bgcolor;
    margin: 10rpx;
    border-radius: 4rpx;

    span {
      font-size: 26rpx;
      margin: 6rpx 10rpx;
    }
  }
.first{
	left: 100px;
	background-color: #0fc;
	float: left;
}
.list-r1 {
  display:flex;
position:absolute;
    bottom: 0rpx;
    top:0rpx;
  height: 70rpx;
    display:flex;
    width:100%;
}
.list-rr {
width: 80%;
bottom: 0px;
top: 70rpx;
display: flex;
position: absolute;
background-color: #FAFAFA; 
    .list-r {
      background-color: white;
      display: flex;
      flex-direction: column;
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
      align-items: center;
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
    top: 70rpx;
    width: 100%;
    bottom: 80rpx;
    .list-ll {
          display: flex;
    top: 200rpx;
    width: 160rpx;
    bottom: 0rpx;
    .list-l {
      display: flex;
      flex-direction: column;
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