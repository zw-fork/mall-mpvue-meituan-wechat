<template>
  <div class="container" v-if="reFresh">
    <div class="name">
      <span>商品名称：</span>
      <input
        placeholder="请填写商品名称(30字内)"
        maxlength="30"
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
    <div class="b-mid" @click="remarkClick">
      <span class="mid-l">商品状态:</span>
      <div class="mid-r" @click="showSinglePicker">
        <span>{{goods.statusName}}</span>
        <i class="icon iconfont iconright"></i>
      </div>
    </div>
    <div class="submit-btn" @click="uploadFile">
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
      goods: {
        statusName: "上架",
        status: 1,
        picture: undefined
      },
      showCategory: false,
      pickerValueArray: [], // picker 数组值
      pickerValueDefault: [], // 初始化值
      active: false,
      clazzA: "icon mt-selected-o",
      styleA: "color: #F9D173",
      clazzB: "icon mt-unselected-o",
      styleB: "color: #333",
      goodsState: undefined,
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
        {
          label: "类型A",
          value: 0
        },
        {
          label: "类型B",
          value: 1
        },
        {
          label: "类型C",
          value: 2
        }
      ],
      item: {
        gender: 1
      },
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
    },
    selectedStyle() {
      return this.item.gender ? "color: #F9D173;" : "color: #333;";
    }
  },
  methods: {
    ...mapActions("user", ["uploadImg"]),
    ...mapActions("shop", ["createShop"]),
    deleteImg() {
      this.goods.picture = undefined;
    },
    uploadImg2() {
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
          that.goods.wechat = true;
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
      debugger
      this.goods.min_price = parseFloat(this.goods.min_price);
      if (typeof this.goods.min_price !== "number" || isNaN(this.goods.min_price)) {
        wx.showToast({
          title: "商品价格应为数字!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      this.goods.shopId = this.userInfo.shopId;
      this.goods.shopName = this.userInfo.shopName;
      this.uploadImg({ goodsModel: this.goods });
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
      console.log(this.goods.categoryName);
    },
    updateCategoryClick() {
      this.pickerValueArray = this.categoryArray;
      this.mode = "selector";
      this.type = "category";
      this.pickerValueDefault = [];
      this.$refs.mpvuePicker.show();
    },
    showSinglePicker() {
      this.pickerValueArray = this.statusArray;
      this.mode = "selector";
      this.type = "status";
      this.pickerValueDefault = [];
      this.$refs.mpvuePicker.show();
    },
    upLoadSuccess(res) {
      this.img = res.files[0];
      console.log(res);
    },
    upLoadFail(res) {
      console.log(res);
    },
    upLoadComplete() {
      console.log("complete");
    },
    uploadDelete(res) {
      console.log(res);
    }
  },
  onLoad(options) {
    this.goods = {
      statusName: "上架",
      status: 1,
      categoryName: "未分类",
      picture: undefined
    };
    getFetch(
      "/category/list/" + this.userInfo.shopId,
      { status: 1 },
      false
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
          "/goods/" + this.userInfo.shopId,
          { goodsId: options.id },
          false
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
              }
            }
          }
        });
      }
    });
  },
  onShow(options) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    if (currPage.data.categoryName) {
      this.goods.categoryName = currPage.data.categoryName;
      this.goods.categoryId = currPage.data.categoryId;
      var data = {};
      data.label = currPage.data.categoryName;
      data.value = currPage.data.categoryId;
      this.categoryArray.push(data);
    }
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
