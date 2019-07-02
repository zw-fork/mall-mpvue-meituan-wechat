<template>
  <div class="container">
    <div class="header-c">
      <div class="header-l">
        <i class="icon iconfont iconlocation" :style="{color: '#434343', 'font-size': 38 + 'rpx'}"></i>
        <span>成都市</span>
      </div>
      <div class="header-r">
        <div class="search-bar">
          <i class="icon mt-search-o"></i>
          <input
            placeholder="请输入小区"
            @input="getsuggest"
            @keyup.enter="getCommunity"
            placeholder-style="font-size: 24rpx"
            v-model="addressModel.address"
          >
          <div class="cancle" v-if="keyword" @click="cancle">
            <i class="icon qb-icon-cancle-o"></i>
          </div>
        </div>
      </div>
      <div class="header-l" style="margin: 0 10rpx;" @click="getCommunity">
        <span>搜索</span>
      </div>
    </div>
    <div class="my-address">
      <div class="list-c">
        <div
          class="item"
          v-for="(item, index) in communityList"
          :key="index"
          @click="updateShop(item)"
        >
          <span class="i-t">{{item.address}}({{item.district}})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { postFetch } from "@/network/request/HttpExtension";
import QQMapWX from "qqmap-wx-jssdk";

export default {
  data() {
    return {
      keyword: true,
      communityList: [],
      addressModel: {}
    };
  },
  computed: {
    ...mapState("address", ["myAddress"]),
    ...mapState("user", ["userInfo"])
  },
  methods: {
    ...mapActions("address", ["getAddressDataAction"]),
    ...mapActions("shop", ["getShopListDataAction"]),
    addAddress() {
      wx.navigateTo({ url: "/pages/addAddress/main" });
    },
    updateShop(item) {
      getApp().globalData.community = item;
      this.userInfo.addressModel = item;
      this.userInfo.addressModel.communityId = item.id;
      this.getShopListDataAction({ communityId: item.id });
    },
    //触发关键词输入提示事件
    getsuggest(event) {
      if (event.mp.detail.value != '南城') {
        return;
      }
      var _this = this;
      //调用关键词提示接口
      this.qqmapsdk.getSuggestion({
        //获取输入框值并设置keyword参数
        keyword: event.mp.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
        region:'成都', //设置城市名，限制关键词所示的地域范围，非必填参数
        success: function(res) {
          //搜索成功后的回调
          console.log(res);
          var sug = [];
          for (var i = 0; i < res.data.length; i++) {
            sug.push({
              // 获取返回结果，放到sug数组中
              title: res.data[i].title,
              id: res.data[i].id,
              addr: res.data[i].address,
              city: res.data[i].city,
              district: res.data[i].district,
              latitude: res.data[i].location.lat,
              longitude: res.data[i].location.lng
            });
          }
          _this.setData({
            //设置suggestion属性，将关键词搜索结果以列表形式展示
            suggestion: sug
          });
        },
        fail: function(error) {
          console.error(error);
        },
        complete: function(res) {
          console.log(res);
        }
      });
    },
    getCommunity() {
      wx.showLoading({ title: "加载中...", mask: true });
      this.qqmapsdk.reverseGeocoder({
        success(res) {
          console.log(res);
          that.address = res.result.address;
          getFetch(
            "/shop/nearShop",
            {
              longitude: res.result.location.lng,
              latitude: res.result.location.lat,
              dis: 21.5
            },
            false
          ).then(response => {
            wx.hideLoading();
            that.shopList = response.result;
          });
        },
        fail(res) {
          console.log(`res:`, res);
        }
      });
      postFetch("/address/list", this.addressModel, false).then(response => {
        this.communityList = response.result;
        wx.hideLoading();
      });
    }
  },
  onShow(options) {
    (this.communityList = []), (this.addressModel = {});
    this.qqmapsdk = new QQMapWX({
      key: "2TRBZ-W426X-UEN4V-TVLRM-OP4OT-2XBCL"
    });
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  .header-c {
    display: flex;
    align-items: center;
    height: 100rpx;
    background-color: white;
    padding: 0 10rpx;
    border-bottom: 2rpx solid $spLine-color;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    .header-l {
      display: flex;
      align-items: center;
      span {
        font-size: 28rpx;
        color: $textBlack-color;
        margin: 0 10rpx;
      }
    }
    .header-r {
      display: flex;
      align-items: center;
      flex: 1;
      .search-bar {
        align-items: center;
        justify-content: center;
        display: flex;
        flex: 1;
        background-color: #f6f6f6;
        height: 70rpx;
        border-radius: 8rpx;
        padding-left: 20rpx;
        i {
          margin-right: 10rpx;
          color: #999999;
          font-size: 32rpx;
        }
        input {
          display: flex;
          flex: 1;
          width: 100%;
          font-size: 28rpx;
          height: 32rpx;
          margin-top: 5rpx;
        }
        .cancle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50rpx;
          height: 60rpx;
          margin-left: 20rpx;
          i {
            color: #999999;
            font-size: 40rpx;
          }
        }
      }
    }
  }
  .location-c {
    display: flex;
    align-items: center;
    height: 88rpx;
    background-color: white;
    padding: 0 30rpx;
    border-bottom: 2rpx solid $spLine-color;
    margin-top: 100rpx;
    .c-l {
      font-size: 32rpx;
      color: $textBlack-color;
      flex: 1;
    }
    .c-r {
      display: flex;
      align-items: center;
      i {
        font-size: 36rpx;
        color: $theme-color;
      }
      span {
        font-size: 28rpx;
        color: $theme-color;
        margin-left: 10rpx;
      }
    }
  }
  .my-address {
    display: flex;
    flex-direction: column;
    background-color: white;
    border-bottom: 2rpx solid $spLine-color;
    padding-top: 100rpx;
    .header {
      display: flex;
      align-items: center;
      padding: 10rpx 30rpx;
      background-color: white;
      i {
        font-size: 28rpx;
        color: $textDarkGray-color;
      }
      span {
        font-size: 24rpx;
        color: $textDarkGray-color;
        margin-left: 20rpx;
      }
    }
    .list-c {
      display: flex;
      flex-direction: column;
      margin-left: 40rpx;
      margin-right: 20rpx;
      .item {
        display: flex;
        flex-direction: column;
        height: 100rpx;
        background-color: white;
        justify-content: center;
        border-bottom: 2rpx solid $spLine-color;
        .i-t {
          font-size: 28rpx;
          color: $textBlack-color;
        }
        .i-b {
          display: flex;
          align-items: center;
          margin-top: 10rpx;
          .b-l {
            font-size: 20rpx;
            color: $textDarkGray-color;
          }
          .b-m {
            font-size: 20rpx;
            color: $textDarkGray-color;
            margin-left: 20rpx;
          }
          .b-r {
            font-size: 20rpx;
            color: $textDarkGray-color;
            margin-left: 60rpx;
          }
        }
      }
    }
    .footer {
      display: flex;
      align-items: center;
      height: 88rpx;
      margin-left: 70rpx;
      span {
        font-size: 24rpx;
        color: $textDarkGray-color;
      }
      i {
        font-size: 32rpx;
        color: $textDarkGray-color;
        margin-left: 10rpx;
      }
    }
  }
  .nearby-address {
    display: flex;
    flex-direction: column;
    background-color: white;
    padding-top: 30rpx;
    margin-bottom: 88rpx;
    .header {
      display: flex;
      align-items: center;
      padding: 10rpx 30rpx;
      i {
        font-size: 38rpx;
        color: $textDarkGray-color;
      }
      span {
        font-size: 24rpx;
        color: $textDarkGray-color;
        margin-left: 20rpx;
      }
    }
    .list-c {
      display: flex;
      flex-direction: column;
      margin-left: 70rpx;
      margin-right: 20rpx;
      background-color: magenta;
      .item {
        display: flex;
        flex-direction: column;
        height: 88rpx;
        background-color: white;
        justify-content: center;
        border-bottom: 2rpx solid $spLine-color;
        span {
          font-size: 28rpx;
          color: $textBlack-color;
        }
      }
      .item:last-child {
        border-bottom: 0rpx solid $spLine-color;
      }
    }
  }
  .footer-c {
    display: flex;
    align-items: center;
    height: 88rpx;
    background-color: white;
    position: fixed;
    bottom: 0;
    width: 100%;
    justify-content: center;
    border-top: 2rpx solid $spLine-color;
    i {
      font-size: 36rpx;
      color: $theme-color;
    }
    span {
      font-size: 28rpx;
      color: $textBlack-color;
      margin-left: 10rpx;
    }
  }
}
</style>
