<template>
  <div>
    <div class="container" @click="update" @mousedown="update" @scroll="update">
      <div class="header-c">
        <div class="header">
          <div class="header-r" @click="scanClick()">
            <img class="item-img" src="/static/images/scan.png">
          </div>
          <div class="header-m">
            <i class="icon iconfont iconsearch"></i>
            <input placeholder="根据手机号搜索人员" placeholder-style="font-size: 24rpx" v-model="name">
          </div>
          <div class="header-r" style="margin: 0 10rpx;">
            <span @click="getGoods()">搜索</span>
          </div>
        </div>
        <div class="cate-c">
          <span
            class="c-l"
            :style="{'font-weight': pageIndex == null  ? 'bold;' : null}"
            style="text-align:center;width:34%;"
            @click="updateGoodsList(null)"
          >全部</span>
          <span
            class="c-m"
            :style="{'font-weight': pageIndex === 1 ? 'bold;' : null}"
            style="text-align:center;width:33%;"
            @click="updateGoodsList(1)"
          >店主</span>
          <span
            class="c-m"
            :style="{'font-weight': pageIndex === 2 ? 'bold;' : null}"
            style="text-align:center;width:33%;"
            @click="updateGoodsList(2)"
          >店员</span>
        </div>
      </div>
      <div class="list-c">
        <scroll-view class="list-r" :scroll-y="true" :scroll-top="scrollTop" @scrolltolower="lower">
          <div class="item-list" v-for="(item, index) in list.datas" :key="index">
            <div class="item">
              <div class="item-l">
                <img :src="item.avatarUrl">
              </div>
              <div class="item-r">
                <span class="sub-title">微信昵称：{{item.nickname}}</span>
                <span class="sub-title">姓名：{{item.realname}}</span>
                <span class="sub-title">电话号码：{{item.tel}}</span>
                <span class="sub-title" v-if="item.role == 0">角色：顾客</span>
                <span class="sub-title" v-else-if="item.role == 1">角色：店员</span>
                <span class="sub-title" v-else-if="item.role == 2">角色：店主</span>
                <span class="sub-title" v-else-if="item.role == 3">角色：管理员</span>
                <span class="sub-title" v-if="item.status==1">未关注公众号，不可接收订单消息</span>
                <span class="sub-title" v-else-if="item.status==2">同意关注公众号/不同意公众关注号</span>
                <span class="sub-title" v-else-if="item.status==3">已关注公众号，可接收订单消息</span>
                <div
                  class="r-t"
                  v-if="(item.role == 1 && userInfo.role== 2 ) || (item.id == userInfo.id && userInfo.role== 1) || userInfo.role== 3"
                >
                  <div class="add-item">
                    <div class="add-r" @click.stop="manageGoods($event, item)">
                      <i class="icon iconfont icondian"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
    <div class="editGoods" :style="divStyle" v-if="showEdit">
      <div @click="editGoods" v-if="userInfo.role==3 && selectGoods.role != 1">
        <i class="icon iconfont iconedit"></i>
        <span style="color:white;text-align: center;">店铺</span>
      </div>
      <div @click="upGoods">
        <i class="icon iconfont iconshangjia1"></i>
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

export default {
  data() {
    return {
      selectGoods: undefined,
      show: false,
      divStyle: "",
      showEdit: false,
      showCart: false,
      tagIndex: 0,
      scrollTop: undefined,
      pageIndex: undefined,
      left: "40rpx",
      currentScroll: 0,
      stars: [1, 2, 3, 4],
      cartGoodsList1: [],
      list: {
        datas: []
      },
      name: ""
    };
  },
  mounted() {
    this.getGoods();
  },
  computed: {
    ...mapState("shoppingCart", [
      "cartMap",
      "shopInfo",
      "commentInfo",
      "visibleSkuModal",
      "visibleItemModal",
      "skuInfo",
      "previewInfo"
    ]),
    ...mapState("user", ["userInfo"]),
    ...mapState("submitOrder", ["orderDetail"]),
    lineStyle() {
      return "bold;";
    },
    path() {
      return `${GOODS_URL_PREFIX}`;
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
    //滚动条滚到底部或右边的时候触发
    lower(e) {
      if (this.list.page > 0) {
        wx.showLoading({ title: "加载中...", mask: true });
        var data = {};
        data.page = this.list.page;
        getFetch("/wechat/userList", data, false).then(response => {
          var goodsList = response.result.list;
          this.list.page = response.result.nextPage;
          this.list.datas = [...this.list.datas, ...goodsList];
          wx.hideLoading();
        });
      }
    },
    updateGoodsList(status) {
      this.list.page = 1;
      this.scrollTop = 0;
      this.pageIndex = status;
      this.getGoods();
    },
    addGoods() {
      wx.navigateTo({ url: "/pages/goodsManage/main" });
    },
    updateGoods(goodsModel) {
      getFetch(
        "wechat/updateStaff/" +
          "/" +
          this.userInfo.id +
          "/" +
          this.selectGoods.id,
        {},
        false
      ).then(response => {
        this.showEdit = false;
        this.updateGoodsList(this.pageIndex);
      });
    },
    upGoods() {
      var that = this;
      wx.showModal({
        content: "确定删除当前员工吗？",
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
    editGoods() {
      if (!this.selectGoods.tel || !this.selectGoods.realname) {
        wx.showToast({
          title: "姓名和电话不能为空!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      var id = this.selectGoods.id;
      wx.navigateTo({
        url: "/pages/shopManage/main?id=" + id
      });
    },
    update() {
      this.showEdit = false;
      return false;
    },
    manageGoods(e, item) {
      this.selectGoods = item;
      this.showEdit = true;
      this.divStyle = "top:" + (2 * e.target.y - 50) + "rpx;";
      return false;
    },
    scanClick() {
      wx.scanCode({
        success: res => {
          console.log(res.result);
          getFetch("qrcode/addShop?sessionId=" + res.result, {}, false).then(
            response => {
              this.getGoods();
            }
          );
        }
      });
    },
    getGoods() {
      wx.showLoading({ title: "加载中...", mask: true });
      var data = {};
      data.tel = this.name.trim();
      if (this.pageIndex != undefined) {
        data.status = this.pageIndex;
      }
      if (this.userInfo.role != 3) {
        data.shopId = this.userInfo.shopId;
      }
      getFetch("/wechat/userList", data, false).then(response => {
        this.list.datas = response.result.list;
        this.list.page = response.result.nextPage;
        wx.hideLoading();
      });
    },
    categoryClick(item, index) {
      this.tagIndex = index;
      var categoryId = item.categoryId;
      this.getCategoryMenuDataAction({ categoryId, index });
    },
    menuClick() {
      this.left = 40 + "rpx";
      this.pageIndex = 0;
    },
    shopClick() {
      this.left = 182 + "rpx";
      this.pageIndex = 1;
    },
    skuClick(item, index) {
      this.selectSkuAction({ item, index });
    },
    addClick(item, index, categoryIndex) {
      item.oldData = true;
      this.addItemAction({ item, index, categoryIndex });
    },
    reduceClick(item, index, categoryIndex) {
      item.oldData = true;
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
    }
  },
  onShow(options) {
    this.showEdit = false;
    this.getGoods();
  }
};
</script>

<style lang="scss" scoped>
.header-c {
  display: flex;
  flex-direction: column;
  .cate-c {
    display: flex;
    height: 70rpx;
    align-items: center;
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
.header-m {
  display: flex;
  align-items: center;
  flex: 1;
  background-color: #fff;
  height: 60rpx;
  border-radius: 30rpx;
  margin-left: 20rpx;
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
.container {
  display: flex;
  flex-direction: column;
  background-color: $page-bgcolor;
  position: relative;
  .header-c {
    display: flex;
    flex-direction: column;
    .header-r {
      display: flex;
      align-items: center;
      span {
        font-size: 32rpx;
        color: $textBlack-color;
        margin: 0 10rpx;
      }
      i {
        font-size: 32rpx;
        color: $textBlack-color;
        margin: 0 10rpx;
      }
      img {
        height: 55rpx;
        width: 55rpx;
        margin-left: 20rpx;
      }
    }
    .header {
      display: flex;
      align-items: center;
      height: 80rpx;
      .h-l {
        display: flex;
        margin-left: 16rpx;
        .shop-logo {
          height: 120rpx;
          width: 120rpx;
          border-radius: 8rpx;
        }
      }
      .h-r {
        display: flex;
        flex-direction: column;
        margin: 0 20rpx;
        .r-t {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .t-l {
            font-size: 20rpx;
            color: white;
          }
          .s-l {
            margin: 0 20rpx;
            width: 2rpx;
            height: 30rpx;
            background-color: white;
          }
          .t-m {
            font-size: 20rpx;
            color: white;
          }
          .s-r {
            margin: 0 20rpx;
            width: 2rpx;
            height: 30rpx;
            background-color: white;
          }
        }
        .r-m {
          font-size: 20rpx;
          color: white;
          line-height: 30rpx;
          height: 30rpx;
          overflow: hidden;
          margin: 10rpx 0;
        }
        .r-b {
          display: flex;
          align-items: center;
          .b-l {
            width: 30rpx;
            height: 30rpx;
            background-color: #ff616d;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            font-size: 20rpx;
          }
          .b-r {
            font-size: 20rpx;
            color: white;
            flex: 1;
            margin-left: 20rpx;
          }
          i {
            font-size: 20rpx;
            color: white;
          }
        }
      }
    }
  }
  .list-c {
    display: flex;
    position: fixed;
    top: 150rpx;
    width: 100%;
    bottom: 0rpx;
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
            .add-r {
              i {
                font-size: 54rpx;
              }
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
              .add-item {
                display: flex;
                align-items: center;
                .add-l {
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  i {
                    font-size: 50rpx;
                  }
                  span {
                    font-size: 32rpx;
                    margin: 0 20rpx;
                  }
                }
                .add-r {
                  i {
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
                  font-size: 20rpx;
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
      img {
        width: 88rpx;
        height: 88rpx;
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
