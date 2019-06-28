<template>
  <div class="container" v-if="reFresh">
    <div class="name" style="height: 65rpx;">
      <span>店铺名称：</span>
      <input
        disabled="disabled"
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
    <div class="b-mid" v-if="!shop.shopId">
      <span class="mid-l">小区名称:</span>
      <div class="mid-r" @click="addressClick">
        <span>{{shop.communityName}}</span>
        <i class="icon iconfont iconright"></i>
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
    <div class="b-mid" @click="remarkClick" v-if="shop.shopId" style="height: 65rpx;">
      <span class="mid-l">商店状态:</span>
      <div class="mid-r" @click="showSinglePicker">
        <span>{{shop.statusName}}</span>
        <i class="icon iconfont iconright"></i>
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
      reFresh: true,
      shop: {
        statusName: undefined,
        status: undefined,
        communityName: undefined,
        communityId: undefined,
        tel: [],
        phone: undefined,
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
          label: "打烊",
          value: 0
        },
        {
          label: "营业",
          value: 1
        },
        {
          label: "停业",
          value: 2
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
    updateWxAddress() {
      var that = this;
      wx.chooseLocation({
        success: function(res) {
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
    deleteImg() {
      this.goods.picture = undefined;
    },
    createCategory() {
      wx.navigateTo({ url: "/pages/categoryManage/main" });
    },
    onConfirm(e) {
      if (this.type == "status") {
        this.goods.status = e.value[0];
        this.goods.statusName = e.label;
      } else {
        this.goods.categoryName = e.label;
        this.goods.categoryId = e.value[0];
      }
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
      if (!this.shop.building) {
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
    if (this.userInfo.shopId) {
      wx.showLoading({ title: "加载中...", mask: true });
      getFetch("/shop/" + this.userInfo.shopId, {}, false).then(response => {
        this.shop = response.result;
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
        status: undefined,
        tel: [],
        phone: undefined
      };
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
    font-size: 28rpx;
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