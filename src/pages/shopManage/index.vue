<template>
  <div class="container" v-if="reFresh">
    <div class="name" style="height: 65rpx;">
      <span>店铺名称：</span>
      <input
        :disabled="userInfo.role != 3"
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
        :disabled="userInfo.role != 3"
        maxlength="30"
        placeholder="详细地址,如:1单元1楼1号"
        placeholder-style="font-size: 24rpx"
        v-model="shop.building"
      >
    </div>
    <div class="name" style="height: 65rpx;">
      <span>起送金额：</span>
      <input
        type="number"
        maxlength="3"
        placeholder="例如:1"
        placeholder-style="font-size: 24rpx"
        v-model="shop.min_price"
      >
      <div class="mid-r" @click="showSinglePicker">元</div>
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
        <span>{{statusName}}</span>
        <i class="icon iconfont iconright"></i>
      </div>
    </div>
    <div class="phone">
      <span>店铺图片：</span>
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
    <mpvue-picker
      ref="mpvuePicker"
      :mode="mode"
      :pickerValueDefault="pickerValueDefault"
      @onChange="onChange"
      @onConfirm="onConfirm"
      @onCancel="onCancel"
      :pickerValueArray="pickerValueArray"
    ></mpvue-picker>
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
import inputDialog from "@/components/inputDialog";
import mpUploader from "mpvue-weui/src/uploader";
import { getFetch, postFetch } from "@/network/request/HttpExtension";
import { GOODS_URL_PREFIX } from "@/constants/hostConfig";
import mpvuePicker from "mpvue-picker";

export default {
  components: {
    mpButton,
    mpvuePicker,
    mpUploader,
    inputDialog
  },
  data() {
    return {
      cWidth: undefined,
      cHeight: undefined,
      reFresh: true,
      statusName: "",
      shop: {
        statusName: "停服",
        status: 0,
        communityName: undefined,
        communityId: undefined,
        tel: [],
        phone: undefined,
        pic_url: undefined,
        wxAddress: {
          name: ""
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
      this.shop.wechat = true;
      this.shop.pic_url = "";
      var that = this.shop;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(photo) {
          that.pic_url = photo.tempFilePaths[0];
        }
      });
    },
    updateWxAddress() {
      if (this.userInfo.role == 3) {
        var that = this;
        wx.chooseLocation({
          success: function(res) {
            if (!that.shop.wxAddress) {
              that.shop.wxAddress = {};
            }
            that.shop.wxAddress = res;
          }
        });
      }
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
      this.statusName = e.label;
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
      if (!this.shop.phone) {
        wx.showToast({
          title: "电话不能为空!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      if (
        !this.shop.wxAddress ||
        !this.shop.wxAddress.name ||
        !this.shop.wxAddress.name.trim()
      ) {
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
      wx.showLoading({ title: "加载中...", mask: true });
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
    if (
      (options.id && this.userInfo.role == 3) ||
      (shopId && this.userInfo.role == 2)
    ) {
      wx.showLoading({ title: "加载中...", mask: true });
      var userId = options.id;
      if (!userId) {
        userId = this.userInfo.id;
      }
      getFetch("/shop/myShop/" + userId, {}, false).then(response => {
        this.shop = response.result || {};
        if (this.shop.shopId) {
          if (this.shop.tel.length > 0) {
            this.shop.phone = this.shop.tel[0];
          }
          for (var index in this.statusArray) {
            if (this.shop.status == this.statusArray[index].value) {
              this.statusName = this.statusArray[index].label;
            }
          }
        } else {
          this.shop = {
            wechat: true,
            statusName: "停业",
            status: 3,
            communityName: undefined,
            communityId: undefined,
            tel: [],
            phone: undefined,
            pic_url: undefined,
            wxAddress: {
              name: ""
            }
          };
          this.shop.userid = userId;
        }
        wx.hideLoading();
      });
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