<template>
  <div class="container" v-if="reFresh">
    <div class="name" style="height: 70rpx;">
      <span>店铺名称：</span>
      <input placeholder="请填写商品名称" placeholder-style="font-size: 24rpx" v-model="shop.shopName"/>
    </div>
    <div class="name">
      <span>电话：</span>
      <div>
        <div class="tel"  v-for="(item, index) in shop.tel" :key="index">
      <input  type="number" placeholder="请填写手机号码" placeholder-style="font-size: 24rpx" v-model="shop.tel[index]" maxlength="11"/>
      <i v-if="index==shop.tel.length-1" @click="createCategory" class="icon mt-delete-o" style="font-size: 30rpx"></i>
      <i v-if="index==shop.tel.length-1" style="margin-left:30rpx;font-size: 32rpx" @click="createCategory" class="icon mt-add-o"></i>
      </div>        
      </div>
    </div>
    <div class="name"  style="height: 70rpx;">
      <span>店铺地址：</span>
      <input placeholder="请填写商品价格" placeholder-style="font-size: 24rpx" v-model="shop.address"/>
    </div>
    <div class="b-mid" @click="remarkClick">
        <span class="mid-l">商店状态:</span>
        <div class="mid-r" @click="showSinglePicker">
          <span>{{shop.statusName}}</span>
          <i class="icon mt-arrow-right-o"></i>
        </div>
    </div>
    <div class="submit" @click="updateShop">
      <span>保存</span>
    </div>
    <mp-picker ref="mpvuePicker" :mode="mode" :deepLength=deepLength :pickerValueDefault="pickerValueDefault" @onChange="onChange" @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mp-picker>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import mpButton from 'mpvue-weui/src/button';
import mpPicker from 'mpvue-weui/src/picker';
import inputDialog from '@/components/inputDialog';
import mpUploader from 'mpvue-weui/src/uploader';
import {getFetch, postFetch} from '@/network/request/HttpExtension'
import {GOODS_URL_PREFIX} from '@/constants/hostConfig'

export default {
  components: {
      mpButton,
      mpPicker,
      mpUploader,
      inputDialog
    },
   data() {
    return {
      reFresh:true,
      shop:{
        statusName : '营业中',
        status : 1,
      },
      goods : {
        statusName : '上架',
        status : 1,
        picture: undefined
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
          label: '打烊',
          value: 0
        },
        {
          label: '营业中',
          value: 1
        },
        {
          label: '关店',
          value: 2
        }
      ],
      type : undefined,
      img: undefined,
      category: undefined
    }},
  computed: {
    ...mapState("address", ["myAddress"]),
    ...mapState("user", ["userInfo"]),
    path() {
      return `${GOODS_URL_PREFIX}`
    },
  },
    methods: {
      ...mapActions("user", ["uploadImg"]),
      ...mapActions("shop", ["createShop"]),
      deleteImg() {
        this.goods.picture = undefined
      },
      createCategory() {
        wx.navigateTo({url: '/pages/categoryManage/main'})
      },
    onConfirm(e) {
      if (this.type == 'status') {
        this.goods.status = e.value[0]
        this.goods.statusName = e.label
      } else {
        this.goods.categoryName = e.label
        this.goods.categoryId = e.value[0]
      }
      console.log(this.goods.categoryName)
    },
    updateShop() {
      this.createShop({shop:this.shop})
    },
    showSinglePicker() {
      this.pickerValueArray = this.statusArray;
      this.mode = 'selector';
      this.type = 'status';
      this.pickerValueDefault = [];
      this.$refs.mpvuePicker.show();
    }
  },
  onLoad(options) 
  {
    wx.showLoading({title: '加载中...', mask: true})
    getFetch('/shop/' + this.userInfo.shopId, {}, false).then(response => {
      this.shop = response.result
                for (var index in this.statusArray) {
            if (this.shop.status == this.statusArray[index].value) {
              this.shop.statusName = this.statusArray[index].label
            }
          }
      wx.hideLoading()
    })
  }
}
</script>

<style lang="scss" scoped>
.tel{
  align-items:center;
  display: flex;
}
.deleteImg {
  height:30rpx;
  width:30rpx;
  right:35rpx;
  top:-120rpx;
  position:relative;
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
      flex: 2;
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
