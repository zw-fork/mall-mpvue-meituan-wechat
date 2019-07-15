<template>
  <div class="container">
    <div class="content">
      <div class="header-c">
        <div class="header-l">
          <i
            class="icon iconfont iconlocation"
            :style="{color: '#434343', 'font-size': 38 + 'rpx'}"
          ></i>
          <span @click="updateWxAddress">{{address? address : "定位中..."}}</span>
          <i
            @click="updateAddress"
            class="icon iconfont icondingwei"
            :style="{color: '#434343', 'font-size': 34 + 'rpx'}"
            style="position:absolute;right:30rpx;"
          ></i>
        </div>
      </div>
      <div class="category-list">
        <scroll-view class="item-list" :scroll-y="true">
          <div
            class="item"
            v-for="(item, index) in shopList"
            :key="index"
            @click="shoppingCartClick(item)"
          >
            <div class="item-l">
              <i style="font-size:100rpx;color:#d81e06;" class="icon iconfont icondianpu"></i>
            </div>
            <div class="item-r">
              <div class="r-t">
                <span class="shop-name">{{item.shopName}}</span>
              </div>
              <div class="r-m">
                <span class="m-l">起送 ¥{{item.min_price}}</span>
                <div class="m-m"></div>
                <span class="m-r">营业时间: 全天</span>
                <div class="m-m"></div>
                <span class="m-r">距离：{{item.distance}}km</span>
              </div>
              <div class="r-m">
                <span class="m-l">地址：{{item.wxAddress.address}}</span>
              </div>
            </div>
          </div>
          <div
            v-if="!shopList || shopList.length < 1"
            class="item"
            style="display: flex;justify-content: center;align-items: center;top:40%"
          >当前地址无商铺信息!</div>
        </scroll-view>
      </div>
    </div>
  </div>
</template>

<script>
import { queryHomeHeadCategory } from "@/action/action";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { getFetch } from "@/network/request/HttpExtension";
import QQMapWX from "qqmap-wx-jssdk";

export default {
  data() {
    return {
      address: undefined,
      shopList: [],
      location: {}
    };
  },
  methods: {
    ...mapActions("user", ["wxLocation"]),
    categoryClick() {
      wx.navigateTo({ url: "/pages/categoryList/main" });
    },
    addressClick() {
      wx.navigateTo({ url: "/pages/selectAddress/main" });
    },
    updateWxAddress() {
      var that = this;
      wx.chooseLocation({
        success: function(res) {
          that.address = res.name;
          that.location.lng = res.longitude;
          that.location.lat = res.latitude;
          getFetch(
            "/shop/nearShop",
            {
              longitude: that.location.lng,
              latitude: that.location.lat,
              dis: 21.5
            },
            false
          ).then(response => {
            wx.hideLoading();
            that.shopList = response.result;
          });
        }
      });
    },
    updateAddress() {
      var that = this;
      wx.showLoading({ title: "加载中...", mask: true });
      this.qqmapsdk.reverseGeocoder({
        success(res) {
          console.log(res);
          that.address = res.result.address;
          that.location = res.result.location;
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
    },
    searchClick() {
      this.wxLocation();
      //  wx.navigateTo({url: '/pages/searchList/main'})
    },
    shoppingCartClick(item) {
      if (!item.poster) {
        wx.navigateTo({
          url: "/pages/shoppingCart/main?shopId=" + item.shopId
        });
      }
    }
  },
  computed: {
    ...mapState("user", ["userInfo"])
  },
  onLoad(options) {
    this.qqmapsdk = new QQMapWX({
      key: "2TRBZ-W426X-UEN4V-TVLRM-OP4OT-2XBCL"
    });
    var that = this;
    this.qqmapsdk.reverseGeocoder({
      success(res) {
        console.log(res);
        that.address = res.result.address;
        that.location = res.result.location;
        that.userInfo.location = res.result.location;
        getFetch(
          "/shop/nearShop",
          {
            longitude: res.result.location.lng,
            latitude: res.result.location.lat,
            dis: 21.5
          },
          false
        ).then(response => {
          that.shopList = response.result;
        });
      },
      fail(res) {
        console.log(`res:`, res);
      }
    });
  },
  onPullDownRefresh: function() {
    getFetch(
      "/shop/nearShop",
      {
        longitude: this.location.lng,
        latitude: this.location.lat,
        dis: 21.5
      },
      false
    ).then(response => {
      wx.hideLoading();
      that.shopList = response.result;
    });
  }
};
</script>

<style lang="scss" scoped>
.container {
  .content {
    display: fixed;
    flex-direction: column;
    position: relative;

    .header-c {
      display: flex;
      align-items: center;
      height: 80rpx;
      position: fixed;
      padding: 0 30rpx;
      width: 100%;
      box-sizing: border-box;
      background-color: white;
      z-index: 999;

      .header-l {
        display: flex;
        align-items: center;
        max-width: 100%;

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
        background-color: $page-bgcolor;
        height: 60rpx;
        border-radius: 30rpx;
        margin-left: 30rpx;
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
        }
      }
    }

    .category-c {
      height: 360rpx;
      background-color: white;
      padding-top: 100rpx;

      .grid-c {
        height: 340rpx;
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
            width: 80rpx;
            height: 80rpx;
            border-radius: 40rpx;
          }

          span {
            font-size: 20rpx;
            color: $textBlack-color;
            margin-top: 10rpx;
          }
        }
      }
    }

    .ad-c {
      display: flex;
      height: 200rpx;
      background-color: white;
      margin: 20rpx;

      .ad-img {
        height: 200rpx;
        width: 100%;
        background-size: cover;
      }
    }

    .b-banner {
      display: flex;
      flex-direction: column;

      .recommended {
        display: flex;
        align-items: center;
        height: 160rpx;
        margin: 20rpx;
        margin-top: 0;

        img {
          height: 160rpx;
          width: 100%;
          background-size: cover;
        }
      }

      .hot-sale {
        display: flex;
        background-color: white;
        height: 160rpx;
        justify-content: space-between;
        margin: 0 20rpx;

        .item {
          display: flex;
          flex-direction: column;
          width: 160rpx;
          padding: 0 20rpx;
          height: 160;

          .img-c {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            img {
              width: 160rpx;
              height: 120rpx;
              border-radius: 8rpx;
            }

            .name-c {
              display: flex;
              align-items: center;
              position: absolute;
              height: 30rpx;
              bottom: 0;
              background: rgba($color: #000000, $alpha: 0.3);
              width: 160rpx;

              .name {
                font-size: 20rpx;
                color: white;
                margin: 0 10rpx;
                height: 30rpx;
                overflow: hidden;
              }
            }
          }

          .price {
            font-size: 24rpx;
            color: $mtRed-color;
            margin: 10rpx 0;
          }
        }
      }
    }

    .section {
      display: flex;
      align-items: center;
      margin: 20rpx;
      margin-top: 50%;
      justify-content: center;
      box-sizing: border-box;

      .l {
        height: 2rpx;
        width: 60rpx;
        background-color: $textDarkGray-color;
      }

      .m {
        font-size: 32rpx;
        color: $textBlack-color;
        margin: 0 20rpx;
        font-weight: bold;
      }

      .r {
        height: 2rpx;
        width: 60rpx;
        background-color: $textDarkGray-color;
      }
    }

    .category-list {
      display: flex;
      margin-top: 80rpx;
      flex-direction: column;

      .filter-bar {
        display: flex;
        align-items: center;
        padding: 0 20rpx;
        background-color: white;
        height: 70rpx;
        border-top: 2rpx solid $spLine-color;
        border-bottom: 2rpx solid $spLine-color;

        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;

          span {
            font-size: 24rpx;
            color: $textDarkGray-color;
          }

          i {
            font-size: 24rpx;
            color: $textDarkGray-color;
            margin-left: 10rpx;
          }
        }

        .item:first-child {
          span {
            color: $textBlack-color;
          }
        }
      }

      .item-list {
        display: block;
        position: fixed;
        top: 70rpx;
        bottom: 0rpx;
        width: 100%;
        background-color: white;

        .header {
          display: flex;
          align-items: center;
          background-color: white;
          justify-content: space-around;

          .item {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f8f8f8;
            flex: 1;
            margin-left: 20rpx;
            padding: 10rpx 0;

            span {
              font-size: 20rpx;
              color: $textDarkGray-color;
            }
          }

          .item:last-child {
            margin-right: 20rpx;
          }
        }

        .item {
          display: flex;
          background-color: white;
          margin: 20rpx;

          .item-l {
            display: flex;
            width: 160rpx;
            height: 160rpx;
            position: relative;

            img {
              width: 160rpx;
              height: 120rpx;
            }

            .tag {
              position: absolute;
              width: 100rpx;
              height: 60rpx;
            }
          }

          .item-r {
            margin-left: 40rpx;
            flex-direction: column;
            flex: 1;

            .r-t {
              display: flex;
              flex-direction: column;

              .shop-name {
                font-size: 30rpx;
                color: $textBlack-color;
                font-weight: bold;
              }

              .t-c {
                display: flex;
                align-items: center;
                margin-top: 10rpx;

                .c-l {
                  display: flex;
                  flex: 1;

                  .l-l {
                    display: flex;

                    i {
                      font-size: 24rpx;
                      color: $theme-color;
                      margin-right: 10rpx;
                    }
                  }

                  .l-m {
                    font-size: 24rpx;
                    color: $textBlack-color;
                    margin-left: 10rpx;
                  }

                  .l-r {
                    font-size: 24rpx;
                    color: $textBlack-color;
                    margin-left: 20rpx;
                  }
                }

                .c-r {
                  display: flex;
                  align-items: center;

                  .r-l {
                    font-size: 24rpx;
                    color: $textBlack-color;
                  }

                  .r-m {
                    width: 2rpx;
                    height: 20rpx;
                    background-color: $textGray-color;
                    margin: 0 10rpx;
                  }

                  .r-r {
                    font-size: 24rpx;
                    color: $textBlack-color;
                  }
                }
              }
            }

            .r-m {
              display: flex;
              align-items: center;
              margin-top: 10rpx;

              .m-l {
                font-size: 24rpx;
                color: $textBlack-color;
              }

              .m-m {
                width: 2rpx;
                height: 20rpx;
                margin: 0 10rpx;
                background-color: $textGray-color;
              }

              .m-r {
                font-size: 24rpx;
                color: $textBlack-color;
              }
            }

            .r-b {
              display: flex;
              align-items: center;
              margin-top: 10rpx;

              .b-l {
                color: #09cfb5;
                font-size: 20rpx;
                border: 2rpx solid #09cfb5;
                text-align: center;
                padding: 0 8rpx;
              }

              .b-r {
                @extend .b-l;
                margin-left: 10rpx;
              }
            }

            .activity-c {
              display: flex;
              flex-direction: column;

              .ac-item {
                display: flex;
                align-items: center;
                margin-top: 20rpx;

                .ac {
                  display: flex;
                  align-items: center;

                  .ac-l {
                    width: 30rpx;
                    height: 30rpx;
                    background-size: cover;
                  }

                  .ac-r {
                    color: $textDarkGray-color;
                    font-size: 20rpx;
                    margin-left: 10rpx;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>