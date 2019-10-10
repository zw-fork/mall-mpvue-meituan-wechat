<template>
  <div class="container" v-if="reFresh">
        <div class="b-mid" v-if="show">
      <span class="mid-l">所属分类:</span>
      <div class="mid-r" @click="showSinglePicker">
        <span>3333</span>
        <i class="icon iconfont iconright"></i>
      </div>
    </div>
    <div class="name">
      <span>分类名称：</span>
      <input
        maxlength="10"
        placeholder="请填写分类名称(10字内)"
        placeholder-style="font-size: 24rpx"
        v-model="category.name"
      >
    </div>
    <div class="submit-btn" @click="createCategory">
      <span>保存</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import mpButton from "mpvue-weui/src/button";
import mpPicker from "mpvue-weui/src/picker";
import mpUploader from "mpvue-weui/src/uploader";
import { getFetch, postFetch } from "@/network/request/HttpExtension";
import { GOODS_URL_PREFIX } from "@/constants/hostConfig";

export default {
  components: {
    mpButton,
    mpPicker,
    mpUploader
  },
  data() {
    return {
      show: false,
      reFresh: true,
      name: undefined,
      category: {},
      pickerValueArray: [], // picker 数组值
      pickerValueDefault: [], // 初始化值
      active: false,
      goodsState: undefined,
      item: {
        gender: 1
      },
      type: undefined,
      img: undefined,
      category: undefined
    };
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    path() {
      return `${GOODS_URL_PREFIX}`;
    },
    selectedStyle() {
      return this.item.gender ? "color: #F9D173;" : "color: #333;";
    }
  },
  methods: {
    createCategory() {
      if (!this.category.name || !this.category.name.trim()) {
        wx.showToast({
          title: "分类名称不能为空!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      postFetch("/category", this.category, false).then(
        response => {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            categoryName: response.result.name,
            categoryId: response.result.categoryId
          });
          wx.navigateBack({ delta: 1, categoryName:  response.result.name });
        }
      );
    }
  },
  onLoad(options) {
    if (options.type==0) {
      this.show = false;
    } else if (options.type==1) {
      this.show = true;
    }
    if (options.id) {
      getFetch('/category/' + options.id, {}, false).then(response => {
        this.category = response.result
      })
    }else {
      this.category = {
        shopId : this.userInfo.shopId
      }
    }
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
        font-size: 28rpx;
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
        font-size: 28rpx;
        color: $textBlack-color;
        margin-left: 20rpx;
      }
    }
    span {
      font-size: 28rpx;
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
