<template>
  <div class="container">
    <div class="name">
      <span>商品名称：</span>
      <input placeholder="请填写商品名称" placeholder-style="font-size: 24rpx" auto-focus v-model="goods.name"/>
    </div>
    <div class="name">
      <span>商品描述：</span>
      <input placeholder="请填写商品描述" placeholder-style="font-size: 24rpx" auto-focus v-model="goods.description"/>
    </div>
    <div class="phone"> 
      <span>商品图片：</span>
    <div style="margin-left:150rpx;top:100rpx;margin-top:-45rpx">
    <mp-uploader @upLoadSuccess="upLoadSuccess" @upLoadFail="upLoadFail" @upLoadComplete="upLoadComplete" @uploadDelete="uploadDelete" :maxLength=2 :showTip=false :count=1></mp-uploader>    
    </div>
    </div>
    <div class="name">
      <span>商品价格：</span>
      <input placeholder="请填写商品价格" placeholder-style="font-size: 24rpx" auto-focus v-model="goods.goodsPrice"/>
    </div>
    <div class="b-mid">
        <div class="mid-l">
          <span>商品分类:</span>
           <i @click="showCategory = !showCategory" class="icon mt-add-o"></i>
        </div>
        <div class="mid-r" @click="updateCategoryClick">
          <span>{{goods.categoryName ? goods.categoryName : '未分类'}}</span>
           <i class="icon mt-arrow-right-o"></i>
        </div>
    </div>
    <div class="b-mid" @click="remarkClick">
        <span class="mid-l">商品状态:</span>
        <div class="mid-r" @click="showSinglePicker">
          <span>{{goods.status}}</span>
          <i class="icon mt-arrow-right-o"></i>
        </div>
    </div>
    <div class="b-mid" @click="remarkClick">
        <span class="mid-l">商品描述:</span>
        <div class="mid-r">
          <span>请输入商品描述信息</span>
          <i class="icon mt-arrow-right-o"></i>
        </div>
    </div>
    <div class="submit" @click="uploadFile">
      <span>保存地址</span>
    </div>
    <mp-picker ref="mpvuePicker" :mode="mode" :deepLength=deepLength :pickerValueDefault="pickerValueDefault" @onChange="onChange" @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mp-picker>
  <input-dialog :is-model="showCategory" @childFn="showCategory = !showCategory" @categoryName="createCategory2"/>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import mpButton from 'mpvue-weui/src/button';
import mpPicker from 'mpvue-weui/src/picker';
import inputDialog from '@/components/inputDialog';
import mpUploader from 'mpvue-weui/src/uploader';
import {getFetch} from '@/network/request/HttpExtension'

export default {
  components: {
      mpButton,
      mpPicker,
      mpUploader,
      inputDialog
    },
   data() {
    return {
      goods : {
        statusName : '上架',
        status : 1
      },
      showCategory: false,
      pickerValueArray: [], // picker 数组值
      pickerValueDefault: [], // 初始化值
      active : false,
      clazzA : 'icon mt-selected-o',
      styleA : 'color: #F9D173',
      clazzB : 'icon mt-unselected-o',
      styleB : 'color: #333',
      goodsState: undefined,
      statusArray: [
        {
          label: '上架',
          value: 1
        },
        {
          label: '下架',
          value: 0
        },
        {
          label: '缺货',
          value: 2
        }
      ],
      categoryArray: [
        {
          label: '类型A',
          value: 0
        },
        {
          label: '类型B',
          value: 1
        },
        {
          label: '类型C',
          value: 2
        }
      ],
      item : {
        gender : 1
      },
      type : undefined,
      img: undefined,
      category: undefined
    }},
  computed: {
    ...mapState("address", ["myAddress"]),
    ...mapState("user", ["userInfo"]),
    ...mapState("shoppingCart", ["shopInfo"]),
    selectedStyle() {
      return this.item.gender? 'color: #F9D173;' : 'color: #333;'
    }
  },
    methods: {
      ...mapActions("user", ["uploadImg"]),
      ...mapActions("shop", ["createCategory", "createShop"]),
      uploadFile() {
        this.goods.shopId = this.shopInfo.shopId
        this.goods.shopName = this.shopInfo.shopName
        this.uploadImg({img : this.img, goodsInfo: this.goods})
      },
      createCategory2(name) {
        var category = {}
        category.shopId = 1
        category.name = name
        this.createCategory({'category' :category})
        console.log(name);
      },
          onChange(e) {
           
      console.log(e);
    },
    onCancel(e) {
      console.log(e);
    },
    onConfirm(e) {
      if (this.type == 'category') {
        this.goods.categoryName = e.label
        this.goods.categoryId = e.value[0]
      } else {
        this.goods.status = e.value[0]
        this.goods.statusName = e.label
      }
    },
    updateCategoryClick() {
      this.pickerValueArray = this.categoryArray;
      this.mode = 'selector';
      this.type = 'category';
      this.pickerValueDefault = [];
      this.$refs.mpvuePicker.show();
    },
    showSinglePicker() {
      this.pickerValueArray = this.statusArray;
      this.mode = 'selector';
      this.type = 'status';
      this.pickerValueDefault = [];
      this.$refs.mpvuePicker.show();
    },
    upLoadSuccess(res) {
      this.img = res.files[0]
      console.log(res);
    },
    upLoadFail(res) {
      console.log(res);
    },
    upLoadComplete() {
      console.log('complete');
    },
    uploadDelete(res) {
      console.log(res);
    }
  },
  onLoad(options) 
  {
    getFetch('/category/list/' + 1, {}, false).then(response => {
      var list = response.result
      var categoryArray = []
      for (var index in list) {
        var data = {}
        data.label = list[index].name
        data.value = list[index].categoryId
        categoryArray.push(data)
      }
      this.categoryArray = categoryArray
    })
  },
}
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
