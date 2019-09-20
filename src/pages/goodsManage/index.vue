<template>
  <div class="container">
    <div class="name">
      <span>商品名称：</span>
      <input
        placeholder="请填写商品名称(40字内)"
        maxlength="40"
        placeholder-style="font-size: 24rpx"
        v-model="goods.name"
      >
    </div>
    <div class="phone">
      <span>商品图片：</span>
      <div style="margin-left:150rpx;top:100rpx;margin-top:-45rpx">
        <div style=" display: inline-block;">
          <img
            style=" display: inline-block;"
            v-if="goods.picture"
            class="choosed-img"
            :src="goods.wechat? goods.picture : (path + goods.picture)"
            alt
          >
          <i
            style=" display: inline-block;"
            v-if="goods.picture"
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
    <div class="name">
      <span>商品价格：</span>
      <input
        type="digit"
        maxlength="8"
        placeholder="请填写商品价格"
        placeholder-style="font-size: 24rpx"
        v-model="goods.min_price"
      >
    </div>
    <div class="name">
      <span>条形码：</span>
      <input
        placeholder="请填写商品条形码(40字内)"
        maxlength="40"
        type="number"
        placeholder-style="font-size: 24rpx"
        v-model="goods.barcode"
      >
      <i @click="scanClick()" class="icon iconfont iconbarcode"></i>
    </div>
    <div class="b-mid">
      <div class="mid-l">
        <span>商品分类:</span>
        <i @click="createCategory" class="icon iconfont iconplus-circle"></i>
      </div>
      <div class="mid-r" @click="updateCategoryClick">
        <span>{{goods.categoryName}}</span>
        <i class="icon iconfont iconright"></i>
      </div>
    </div>
    <div class="b-mid">
      <span class="mid-l">商品状态:</span>
      <div class="mid-r" @click="showSinglePicker">
        <span>{{name}}</span>
        <i class="icon iconfont iconright"></i>
      </div>
    </div>
    <div class="submit-btn" @click="uploadFile">
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
      goods: {
        statusName: "上架",
        status: 1,
        picture: undefined
      },
      name: "",
      mode: "selector",
      statusArray: [
        {
          label: "上架",
          value: 1
        },
        {
          label: "下架",
          value: 2
        }
      ],
      categoryArray: [
      ],
      pickerValueDefault: [0]
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
    scanClick() {
      wx.scanCode({
        success: res => {
          this.goods.barcode = res.result;
        }
      });
    },
    deleteImg() {
      this.goods.picture = "";
      this.goods.wechat = true;
    },
    uploadImg2() {
      this.goods.wechat = true;
      if (this.goods.picture) {
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
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.goods.picture = res.tempFilePaths[0];
        }
      });
    },
    uploadFile() {
      if (!this.goods.name || !this.goods.name.trim()) {
        wx.showToast({
          title: "商品名称不能为空!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      if (!this.goods.picture || !this.goods.picture.trim()) {
        wx.showToast({
          title: "商品图片不能为空!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      this.goods.min_price = parseFloat(this.goods.min_price);
      if (
        typeof this.goods.min_price !== "number" ||
        isNaN(this.goods.min_price)
      ) {
        wx.showToast({
          title: "商品价格应为数字!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      if (!this.goods.categoryId) {
        wx.showToast({
          title: "商品分类不能为空!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      wx.showLoading({ title: "加载中...", mask: true });
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
            update:true
      });
      this.goods.shopId = this.userInfo.shopId;
      this.goods.shopName = this.userInfo.shopName;
      this.uploadImg({ goodsModel: this.goods });
    },
    createCategory() {
      wx.navigateTo({ url: "/pages/categoryManage/main" });
    },
    updateCategoryClick() {
      if (this.categoryArray.length > 0) {
        this.pickerValueArray = this.categoryArray;
        this.mode = "selector";
        this.type = "category";
        this.pickerValueDefault = [];
        this.$refs.mpvuePicker.show();
      }
    },
    showSinglePicker() {
      this.pickerValueArray = this.statusArray;
      this.mode = "selector";
      this.type = "status";
      this.pickerValueDefault = [];
      this.$refs.mpvuePicker.show();
    },
    showPicker() {
      this.$refs.mpvuePicker.show();
    },
    onConfirm(e) {
      if (this.type == "status") {
        this.goods.status = e.value[0];
        this.goods.statusName = e.label;
        this.name = e.label;
      } else {
        this.goods.categoryName = e.label;
        this.goods.categoryId = e.value[0];
      }
    },
    onChange(e) {
      console.log("A" + e);
    },
    onCancel(e) {
      console.log("B" + e);
    }
  },
  onShow(options) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    if (currPage.data.categoryId) {
      this.goods.categoryName = currPage.data.categoryName;
      this.goods.categoryId = currPage.data.categoryId;
      var data = {};
      data.label = this.goods.categoryName;
      data.value = this.goods.categoryId;
      this.categoryArray.push(data);
    }
  },
  onLoad(options) {
    this.name = "上架";
    this.goods = {
      statusName: "上架",
      status: 1,
      name: "",
      categoryName: "",
      min_price: "",
      barcode: "",
      picture: undefined
    };
    this.goods.picture = "upload/store_wechat/佳乐惠超市/201908240080d.jpg";
    this.goods.min_price = 3;
    this.goods.categoryId = 110;
    this.goods.categoryName = "方便速食"; 
    if (options.barcode) {
          getFetch(
      "/barcode/" + options.barcode,
      {},
      true
    ).then(response => {
      var result = response.result
      if (result) {
        this.goods.name = result.goodsName;
        this.goods.min_price = result.price;
        this.goods.picture = result.ssoImg;
        this.goods.barcode = result.code;
        this.goods.statusName = "上架";
        this.name = "上架";
        this.goods.status = 1;
      }
    })
    }
    getFetch(
      "/category/list/" + this.userInfo.shopId,
      { status: 1 },
      true
    ).then(response => {
      var list = response.result;
      var categoryArray = [];
      for (var index in list) {
        var data = {};
        data.label = list[index].name;
        data.value = list[index].categoryId;
        categoryArray.push(data);
      }
      this.categoryArray = categoryArray;
      if (options.id) {
        getFetch(
          "/goods/list/" + this.userInfo.shopId,
          { goodsId: options.id },
          true
        ).then(response => {
          if (response.result.list.length > 0) {
            this.goods = response.result.list[0];
            for (var index in this.categoryArray) {
              if (this.goods.categoryId == this.categoryArray[index].value) {
                this.goods.categoryName = this.categoryArray[index].label;
              }
            }
            for (var index in this.statusArray) {
              if (this.goods.status == this.statusArray[index].value) {
                this.goods.statusName = this.statusArray[index].label;
                this.name = this.statusArray[index].label;
              }
            }
          }
        });
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.deleteImg {
  font-size: 34rpx;
  top: -120rpx;
  color: red;
  right: 35rpx;
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
  height: 88rpx;
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
    height: 70rpx;
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
    input {
      flex: 1;
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
}
</style>
