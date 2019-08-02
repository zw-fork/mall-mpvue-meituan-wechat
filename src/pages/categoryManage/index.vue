<template>
  <div class="container" v-if="reFresh">
    <div class="name">
      <span>分类名称：</span>
      <input
        maxlength="10"
        placeholder="请填写分类名称(10字内)"
        placeholder-style="font-size: 24rpx"
        v-model="name"
      >
    </div>
    <div class="submit-btn" @click="createCategory2">
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
    <input-dialog
      :is-model="showCategory"
      @childFn="showCategory = !showCategory"
      @categoryName="createCategory2"
    />
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
      name: undefined,
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
    ...mapActions("shop", ["createCategory", "createShop"]),
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
      this.goods.shopId = this.userInfo.shopId;
      this.goods.shopName = this.userInfo.shopName;
      this.goods.goodsPrice = parseFloat(this.goods.goodsPrice);
      this.uploadImg({ goodsModel: this.goods });
    },
    createCategory2() {
      if (!this.name || !this.name.trim()) {
        wx.showToast({
          title: "分类名称不能为空!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      var category = {};
      category.shopId = this.userInfo.shopId;
      category.name = this.name;
      var categoryName = this.name;
      postFetch("/category/" + category.shopId, category, false).then(
        response => {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          console.log(response);
          prevPage.setData({
            categoryName: categoryName,
            categoryId: response.result.categoryId
          });
          wx.navigateBack({ delta: 1, categoryName: categoryName });
        }
      );
    },
    onConfirm(e) {
      if (this.type == "category") {
        this.goods.categoryName = e.label;
        this.goods.categoryId = e.value[0];
      } else {
        this.goods.status = e.value[0];
        this.goods.statusName = e.label;
      }
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
  onShow(options) {
    this.name = ''
  }
};
</script>

<style lang="scss" scoped>
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
