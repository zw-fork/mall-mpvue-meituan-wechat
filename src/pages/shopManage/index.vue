<template>
  <div class="container" v-if="reFresh">
    <div class="name" style="height: 65rpx;">
      <span>店铺名称：</span>
      <input
        maxlength="20"
        placeholder="请填写商品名称(20字内)"
        placeholder-style="font-size: 24rpx"
        v-model="shop.shopName"
      >
    </div>
    <div class="name">
      <span>电话：</span>
      <div>
        <input
          type="number"
          placeholder="请填写手机号码"
          placeholder-style="font-size: 24rpx"
          v-model="shop.phone"
          maxlength="11"
        >
      </div>
    </div>
    <div class="b-mid" style="height: 65rpx;">
      <span class="mid-l">店铺地址：</span>
      <div class="mid-r" @click="updateWxAddress">
        <span v-if="shop.wxAddress">{{shop.wxAddress.name}}</span>
        <i class="icon iconfont iconright"></i>
      </div>
    </div>
    <div class="name" style="height: 65rpx;">
      <span>门牌号：</span>
      <input
        maxlength="30"
        placeholder="详细地址,如:1单元1楼1号"
        placeholder-style="font-size: 24rpx"
        v-model="shop.building"
      >
    </div>
    <div class="name" style="height: 65rpx;">
      <span>配送范围：</span>
      <input
        type="digit"
        maxlength="5"
        placeholder="例如:1.2"
        placeholder-style="font-size: 24rpx"
        v-model="shop.scope"
      >
      <div class="mid-r" @click="showSinglePicker">公里</div>
    </div>
    <div class="b-mid" style="height: 65rpx;">
      <span class="mid-l">商店状态:</span>
      <div class="mid-r" @click="showSinglePicker">
        <span>{{shop.statusName}}</span>
        <i class="icon iconfont iconright"></i>
      </div>
    </div>
    <div class="phone">
      <span>商品图片：</span>
      <div style="margin-left:150rpx;top:100rpx;margin-top:-45rpx">
        <div style=" display: inline-block;">
          <img
            style=" display: inline-block;"
            v-if="shop.pic_url"
            class="choosed-img"
            :src="shop.wechat? shop.pic_url : (path + shop.pic_url)"
          >
          <i
            style=" display: inline-block;"
            v-if="shop.pic_url"
            class="deleteImg icon iconfont iconclose-circle"
            @click="deleteImg()"
          ></i>
        </div>
        <img
          style=" display: inline-block;"
          class="choosed-img"
          src="/static/images/addphotoes.png"
          alt
          @click="uploadImg2()"
        >
      </div>
    </div>
    <div class="submit-btn" @click="updateShop">
      <span>保存</span>
    </div>
    <mp-picker
      ref="mpvuePicker"
      :mode="mode"
      :deepLength="deepLength"
      :pickerValueDefault="pickerValueDefault"
      @onChange="onChange"
      @onConfirm="onConfirm"
      @onCancel="onCancel"
      :pickerValueArray="pickerValueArray"
    ></mp-picker>
    <canvas
      canvas-id="photo_canvas"
      :style="{width:  cWidth + 'px', 'height': cHeight + 'px'}"
      style="position: absolute;left:-3000px;top:-3000px;"
      class="myCanvas"
    ></canvas>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import mpButton from "mpvue-weui/src/button";
import mpPicker from "mpvue-weui/src/picker";
import inputDialog from "@/components/inputDialog";
import mpUploader from "mpvue-weui/src/uploader";
import { getFetch, postFetch } from "@/network/request/HttpExtension";
import { GOODS_URL_PREFIX } from "@/constants/hostConfig";

export default {
  components: {
    mpButton,
    mpPicker,
    mpUploader,
    inputDialog
  },
  data() {
    return {
      cWidth: undefined,
      cHeight: undefined,
      reFresh: true,
      shop: {
        statusName: undefined,
        status: undefined,
        communityName: undefined,
        communityId: undefined,
        tel: [],
        phone: undefined,
        pic_url: undefined,
        wxAddress: {
          name: undefined
        }
      },
      showCategory: false,
      pickerValueArray: [], // picker 数组值
      pickerValueDefault: [], // 初始化值
      active: false,
      clazzA: "icon mt-selected-o",
      styleA: "color: #F9D173",
      clazzB: "icon mt-unselected-o",
      styleB: "color: #333",
      statusArray: [
        {
          label: "停服",
          value: 0
        },
        {
          label: "营业",
          value: 1
        },
        {
          label: "打烊",
          value: 2
        },
        {
          label: "停业",
          value: 3
        }
      ],
      type: undefined,
      img: undefined,
      category: undefined
    };
  },
  computed: {
    ...mapState("address", ["myAddress"]),
    ...mapState("user", ["userInfo"]),
    path() {
      return `${GOODS_URL_PREFIX}`;
    }
  },
  methods: {
    ...mapActions("user", ["uploadImg"]),
    ...mapActions("shop", ["createShop"]),
    ...mapActions("user", ["wxLocation"]),
    ...mapMutations("user", ["changeUserInfoMut"]),
    deleteImg() {
      this.shop.pic_url = "";
      this.shop.wechat = true;
    },
    uploadImg2() {
      if (this.shop.pic_url) {
        wx.showToast({
          title: "最多只能上传一张图片!",
          icon: "none",
          duration: 2000
        });
        return;
      }
      var that = this;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(photo) {
          that.shop.wechat = true;
          that.shop.pic_url = "";
          wx.getImageInfo({
            src: photo.tempFilePaths[0],
            success: function(res) {
              var ratio = 1;
              var canvasWidth = res.width; //图片原始长宽
              var canvasHeight = res.height;
              while (canvasWidth > 1500 || canvasHeight > 1500) {
                // 保证宽高在400以内
                canvasWidth = Math.trunc(res.width / ratio);
                canvasHeight = Math.trunc(res.height / ratio);
                ratio++;
              }
              that.cWidth = canvasWidth;
              that.cHeight = canvasHeight;
              var ctx = wx.createCanvasContext("photo_canvas");
              ctx.drawImage(
                photo.tempFilePaths[0],
                0,
                0,
                res.width,
                res.height,
                0,
                0,
                canvasWidth,
                canvasHeight
              );
              ctx.draw(false, function() {
                wx.canvasToTempFilePath(
                  {
                    canvasId: "photo_canvas",
                    fileType: "jpg",
                    destWidth: canvasWidth,
                    destHeight: canvasHeight,
                    success: function(res) {
                      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                      that.shop.wechat = true;
                      that.shop.pic_url = res.tempFilePath;
                    }
                  },
                  that
                );
              });
            }
          });
        }
      });
    },
    updateWxAddress() {
      var that = this;
      wx.chooseLocation({
        success: function(res) {
          if (!that.shop.wxAddress) {
            that.shop.wxAddress = {};
          }
          that.shop.wxAddress = res;
        }
      });
    },
    addressClick() {
      wx.navigateTo({ url: "/pages/selectAddress/main" });
    },
    createTel() {
      if (!this.shop.tel) {
        this.shop.tel = [];
      }
      this.shop.tel.push(null);
    },
    deleteTel(index) {
      this.shop.tel.splice(index, 1);
    },
    createCategory() {
      wx.navigateTo({ url: "/pages/categoryManage/main" });
    },
    onConfirm(e) {
      this.shop.status = e.value[0];
      this.shop.statusName = e.label;
    },
    updateShop() {
      if (!this.shop.shopName) {
        wx.showToast({
          title: "店铺名称不能为空!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      if (!this.shop.wxAddress || !this.shop.wxAddress.name.trim()) {
        wx.showToast({
          title: "店铺地址不能为空!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      if (!this.shop.building || !this.shop.building.trim()) {
        wx.showToast({
          title: "门牌号不能为空!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      this.shop.tel = [this.shop.phone];
      this.createShop({ shop: this.shop });
    },
    showSinglePicker() {
      this.pickerValueArray = this.statusArray;
      this.mode = "selector";
      this.type = "status";
      this.pickerValueDefault = [];
      this.$refs.mpvuePicker.show();
    }
  },
  onLoad(options) {
    var shopId = this.userInfo.shopId;
    var userId = this.userInfo.id;
    if (options.id) {
      userId = options.id;
      getFetch("/wechat/getUser/" + options.id, {}, false).then(response => {
        shopId = response.shopId;
        if (shopId) {
          wx.showLoading({ title: "加载中...", mask: true });
          getFetch("/shop/" + shopId, {}, false).then(response => {
            this.shop = response.result || {};
            if (this.shop.tel.length > 0) {
              this.shop.phone = this.shop.tel[0];
            }
            for (var index in this.statusArray) {
              if (this.shop.status == this.statusArray[index].value) {
                this.shop.statusName = this.statusArray[index].label;
              }
            }
            wx.hideLoading();
          });
        } else {
          this.shop = {
            statusName: undefined,
            status: 3,
            tel: [],
            phone: undefined
          };
          this.shop.userid = userId;
        }
      });
    } else if (shopId) {
      wx.showLoading({ title: "加载中...", mask: true });
      getFetch("/shop/" + shopId, {}, false).then(response => {
        this.shop = response.result || {};
        if (this.shop.tel.length > 0) {
          this.shop.phone = this.shop.tel[0];
        }
        for (var index in this.statusArray) {
          if (this.shop.status == this.statusArray[index].value) {
            this.shop.statusName = this.statusArray[index].label;
          }
        }
        wx.hideLoading();
      });
    } else {
      this.shop = {
        statusName: undefined,
        status: 3,
        tel: [],
        wechat: true,
        pic_url: undefined,
        phone: undefined
      };
      this.shop.userid = userId;
    }
  }
};
</script>

<style lang="scss" scoped>
.tel {
  height: 65rpx;
  align-items: center;
  display: flex;
}

.deleteImg {
  height: 30rpx;
  width: 30rpx;
  right: 35rpx;
  top: -120rpx;
  position: relative;
}

.choosed-img {
  margin-left: 20rpx;
  height: 150rpx;
  width: 150rpx;
}

.b-mid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 65rpx;
  margin-left: 30rpx;
  padding-right: 30rpx;
  border-bottom: 2rpx solid $spLine-color;

  .mid-l {
    font-size: 32rpx;
    color: $textBlack-color;
    display: flex;
    align-items: center;

    span {
      font-size: 28rpx;
      color: $textDarkGray-color;
    }

    i {
      font-size: 32rpx;
      color: $textGray-color;
      margin-left: 30rpx;
    }
  }

  .mid-m {
    font-size: 28rpx;
    padding-right: 30rpx;
  }

  .mid-r {
    display: flex;
    align-items: center;

    span {
      font-size: 28rpx;
      color: $textDarkGray-color;
    }

    i {
      font-size: 28rpx;
      color: $textGray-color;
      margin-left: 10rpx;
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
    display: flex;
    align-items: center;
    margin-left: 30rpx;
    padding-right: 30rpx;
    border-bottom: 2rpx solid $spLine-color;
    input {
      flex: 1;
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

    span {
      font-size: 32rpx;
      color: $textBlack-color;
      width: 160rpx;
    }
  }

  .sex {
    display: flex;
    align-items: center;
    margin-left: 30rpx;
    padding-right: 30rpx;
    height: 88rpx;
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
    height: 180rpx;
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
        margin-right: 10rpx;
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
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    color: white;
    background-color: $theme-color;
    border-top: 2rpx solid $spLine-color;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    span {
      font-size: 32rpx;
    }
  }
}
</style>