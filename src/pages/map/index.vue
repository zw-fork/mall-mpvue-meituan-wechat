<template>
  <div class="container">
    <map v-if="myAddress" id="myMap" style="width: 100%; height: 100%;" :latitude="myAddress.location.lat" :longitude="myAddress.location.lng" :markers="markers" show-location></map>
  </div>
</template>

<script>
import QQMapWX from "qqmap-wx-jssdk";

  export default {
    data() {
      return {
        address: undefined,
        myAddress: undefined,
        shopList: [],
        markers: [],
        covers: [],
      };
    },
    onLoad(options) {
      this.qqmapsdk = new QQMapWX({
        key: "2TRBZ-W426X-UEN4V-TVLRM-OP4OT-2XBCL"
      });
      var that = this;
      this.qqmapsdk.reverseGeocoder({
        success(res) {
          that.address = res.result.address;
          that.myAddress = res.result
          that.markers = [{
            latitude: res.result.location.lat,
            longitude: res.result.location.lng,
            name: 'T.I.T 创意园'
          },
          {
            latitude: 30.589527,
            longitude: 104.065660,
            iconPath: '/static/images/location.png',
            name: '九方'
          }, {
            latitude: 30.601582,
            longitude: 104.061530,
            iconPath: '/static/images/location.png',
            name: '欧尚'
          }];
        },
        fail(res) {
          console.log(`res:`, res);
        }
      });
    }
  };
</script>

<style lang="scss" scoped>
  .tag-c {
    display: flex;
    flex-wrap: wrap;
    background-color: white;

    .tag {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100rpx;
      height: 50rpx;
      border: 2rpx solid $spLine-color;
      margin-left: 30rpx;

      span {
        font-size: 20rpx;
        color: $textBlack-color;
      }
    }
  }

  input {
    font-size: 28rpx;
  }

  .container {
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .name {
      align-items: center;
      margin-left: 30rpx;
      padding-right: 30rpx;
      height: 100rpx;
      border-bottom: 2rpx solid $spLine-color;

      span {
        font-size: 32rpx;
        color: $textBlack-color;
        width: 160rpx;
      }

      input {
        flex: 1;
      }
    }

    .sex {
      display: flex;
      align-items: center;
      margin-left: 30rpx;
      padding-right: 30rpx;
      height: 80rpx;
      border-bottom: 2rpx solid $spLine-color;

      .l {
        width: 160rpx;
      }

      .m {
        display: flex;

        i {
          font-size: 32rpx;
          color: $theme-color;
        }

        span {
          font-size: 32rpx;
          color: $textBlack-color;
          margin-left: 20rpx;
        }
      }

      .r {
        display: flex;
        margin-left: 60rpx;

        i {
          font-size: 38rpx;
          color: $textGray-color;
        }

        span {
          font-size: 32rpx;
          color: $textBlack-color;
          margin-left: 20rpx;
        }
      }
    }

    .phone {
      align-items: center;
      margin-left: 30rpx;
      padding-right: 30rpx;
      height: 100rpx;
      border-bottom: 2rpx solid $spLine-color;

      span {
        font-size: 32rpx;
        color: $textBlack-color;
        width: 160rpx;
      }

      input {
        flex: 1;
      }
    }

    .address {
      display: flex;
      align-items: center;
      margin-left: 30rpx;
      padding-right: 30rpx;
      height: 88rpx;
      border-bottom: 2rpx solid $spLine-color;

      .l {
        font-size: 32rpx;
        color: $textBlack-color;
        width: 160rpx;
      }

      .m {
        display: flex;
        flex: 1;

        i {
          font-size: 38rpx;
          color: $textGray-color;
        }

        span {
          font-size: 32rpx;
          margin-left: 10rpx;
          margin-top: 10rpx;
        }
      }

      .r {
        i {
          font-size: 28rpx;
          color: $textGray-color;
        }
      }
    }

    .house-num {
      display: flex;
      align-items: center;
      margin-left: 30rpx;
      padding-right: 30rpx;
      height: 88rpx;
      border-bottom: 2rpx solid $spLine-color;

      span {
        font-size: 28rpx;
        color: $textBlack-color;
        width: 160rpx;
      }

      input {
        flex: 1;
      }
    }

    .submit {
      margin: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 76rpx;
      background-color: $theme-color;
      border-radius: 8rpx;

      span {
        font-size: 28rpx;
        color: $textBlack-color;
      }
    }
  }
</style>