<template>
  <div class="container" v-if="reFresh">
        <div class="b-mid" v-if="show">
      <span class="mid-l">所属分类:</span>
      <div class="mid-r" @click="updateCategoryClick">
        <span>{{parentCategory.categoryName}}</span>
        <i class="icon iconfont iconright"></i>
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
        :mode="mode3"
        :deepLength="deepLength3"
        ref="mpvuePicker3"
        :pickerValueArray="mulLinkageTwoPicker3"
        :pickerValueDefault="pickerValueDefault3"
        @onConfirm="onConfirm">
      </mpvue-picker>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import mpPicker from "mpvue-weui/src/picker";
import { getFetch, postFetch } from "@/network/request/HttpExtension";
import mpvuePicker from "mpvue-picker";

export default {
  components: {
    mpvuePicker
  },
  data() {
    return {
      parentCategory: {
        categoryName: undefined
      },
      show: false,
      reFresh: true,
      name: undefined,
      category: {
        name: undefined
      },
      categoryArray: [],
      pickerValueDefault: [],
      active: false,
      type: undefined,
      img: undefined,
      mode3: 'multiLinkageSelector',
      deepLength3: 2,
      mulLinkageTwoPicker3: [
        {
          label: '火车',
          value: 10,
          children: [
            {
              label: '火车1',
              value: 11,
              children: [
                {
                  label: '火车2',
                  value: 12,
                  children: []
                },
                {
                  label: '火车3',
                  value: 13,
                  children: []
                }
              ]
            }
          ]
        },
        {
          label: '火车20',
          value: 210,
          children: [
          ]
        }
      ],
      pickerValueDefault3: [0, 0]    
      };
  },
  computed: {
    ...mapState("user", ["userInfo"])
  },
  methods: {
    updateCategoryClick() {
      console.log( this.parentCategory.categoryName)
      this.$refs.mpvuePicker3.show();  
    },
    onConfirm(e) {
        this.parentCategory.categoryName = e.label;
        this.parentCategory.categoryId = e.value[1];
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
      var mulLinkageTwoPicker3 = [];
      for (var index in list) {
        var data = {};
        data.label = list[index].name;
        data.value = list[index].categoryId;
        data.children = [];
        var children = list[index].childrenCategory;
        if (children.length>0) {
          for (var index2 in children) {
              var child = {};
              child.label = children[index2].name;
              child.value = children[index2].categoryId;
              data.children.push(child);
          }
        } else {
          var child = {};
          child.label = '';
          child.value = '';
          data.children.push(child);
        }
        mulLinkageTwoPicker3.push(data);
      } 
      this.mulLinkageTwoPicker3 = mulLinkageTwoPicker3;
      this.pickerValueDefault3 =[0, 0]    
      if (!options.id) {
        this.parentCategory.categoryName = this.categoryArray[0].label;
        this.parentCategory.categoryId = this.categoryArray[0].value;
      }
    });
    }
    if (options.id) {
      getFetch('/category/' + options.id, {}, true).then(response => {
        this.category = response.result
        if (this.category.parentId) {
            this.parentCategory.categoryName = this.category.parentCategory.name;
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
