<template>
  <div class="container" v-if="reFresh">
        <div class="b-mid" v-if="show">
      <span class="mid-l">所属分类:</span>
      <div class="mid-r" @click="updateCategoryClick">
        <span>{{parentCategoryName}}</span>
        <i class="icon my_iconfont iconright"></i>
      </div>
    </div>
    <div class="name">
      <span>分类名称：</span>
      <input
        maxlength="8"
        placeholder="请填写分类名称(8字内)"
        placeholder-style="font-size: 24rpx"
        v-model="category.name"
      >
    </div>
    <div class="submit-btn" @click="createCategory">
      <span>保存</span>
    </div>
    <mpvue-picker
      ref="mpvuePicker"
      :mode="mode"
      :pickerValueDefault="pickerValueDefault"
      @onConfirm="onConfirm"
      :pickerValueArray="pickerValueArray"
    ></mpvue-picker>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import mpButton from "mpvue-weui/src/button";
import mpPicker from "mpvue-weui/src/picker";
import mpUploader from "mpvue-weui/src/uploader";
import { getFetch, postFetch } from "@/network/request/HttpExtension";
import { GOODS_URL_PREFIX } from "@/constants/hostConfig";
import mpvuePicker from "mpvue-picker";

export default {
  components: {
    mpButton,
    mpPicker,
    mpvuePicker,
    mpUploader
  },
  data() {
    return {
      parentCategoryName: undefined,
      parentCategory: {
        categoryName: undefined
      },
      pickerValueArray: [],
      show: false,
      reFresh: true,
      name: undefined,
      category: {
        name: undefined
      },
      categoryArray: [],
      pickerValueDefault: [],
      active: false,
      goodsState: undefined,
      item: {
        gender: 1
      },
      type: undefined,
      img: undefined    
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
    updateCategoryClick() {
      if (this.categoryArray.length > 0) {
        this.pickerValueArray = this.categoryArray;
        this.pickerValueDefault = [];
        this.$refs.mpvuePicker.show();
      }
    },
    onConfirm(e) {
        this.parentCategory.categoryName = e.label;
        this.parentCategoryName = this.parentCategory.categoryName
        this.parentCategory.categoryId = e.value[0];
    },
    createCategory() {
      if (!this.category.name || !this.category.name.trim()) {
        wx.showToast({
          title: "分类名称不能为空!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      if (this.parentCategory.categoryId) {
         this.category.parentId = this.parentCategory.categoryId
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
    this.parentCategory = {}
    this.parentCategory.categoryName = undefined;
    this.parentCategoryName = this.parentCategory.categoryName
    if (options.type==0) {
      this.show = false;
    } else if (options.type==1) {
            this.show = true;
          getFetch(
      "/category/list/" + this.userInfo.shopId,
      { status: 1 },
      true
    ).then(response => {
      var list = response.result;
      for (var index in list) {
        var data = {};
        data.label = list[index].name;
        data.value = list[index].categoryId;
        this.categoryArray.push(data);
      }
      if (!options.id) {
        this.parentCategory.categoryName = this.categoryArray[0].label;
        this.parentCategoryName = this.parentCategory.categoryName
        this.parentCategory.categoryId = this.categoryArray[0].value;
      }
    });
    }
    if (options.id) {
      getFetch('/category/' + options.id, {}, true).then(response => {
        this.category = response.result
        if (this.category.parentId) {
            this.parentCategory.categoryName = this.category.parentCategory.name;
            this.parentCategoryName = this.parentCategory.categoryName
            this.parentCategory.categoryId = this.category.parentCategory.categoryId;
        }
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
    span {
      font-size: 28rpx;
      color: $textBlack-color;
      width: 160rpx;
    }
    input {
      flex: 1;
    }
  }
}
</style>
