<template>
  <div class="container">
    <div class="name">
      <span>联系人：</span>
      <input placeholder="请填写收货人的姓名"
             placeholder-style="font-size: 24rpx"
             auto-focus
             v-model="item.name" />
    </div>
    <div class="phone">
      <span>手机号：</span>
      <input placeholder="请填写收货人手机号码"
             placeholder-style="font-size: 24rpx"
             v-model="item.phone" />
    </div>
    <div class="address">
      <span class="l">收货地址：</span>
      <div class="m">
        <span v-if="!item.wxAddress">点击选择</span>
        <span v-else>{{item.wxAddress.name}}</span>
      </div>
    </div>
    <div class="house-num">
      <span>门牌号：</span>
      <input placeholder="详细地址，例：16号楼5楼301室"
             placeholder-style="font-size: 24rpx"
             v-model="item.house_number" />
    </div>
    <div class="submit-btn"
         @click="saveAddress">
      <span>保存地址</span>
    </div>
    <mp-uploader @upLoadSuccess="upLoadSuccess"
                 @upLoadFail="upLoadFail"
                 @uploadDelete="uploadDelete"
                 :showTip=false
                 :count=1></mp-uploader>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import mpButton from 'mpvue-weui/src/button';

export default {
  components: {
    mpButton
  },
  data() {
    return {
      tags: ['不吃辣', '少放葱'],
      active: false,
      clazzA: 'icolorcon mt-selected-o',
      styleA: 'background-color: #87CEFA',
      clazzB: 'icon mt-unselected-o',
      styleB: 'background-color: none;',
      item: {
        gender: 1
      }
    };
  },
  computed: {
    ...mapState('address', ['myAddress']),
    ...mapState('user', ['userInfo']),
    ...mapState('shoppingCart', ['shopInfo']),
    selectedStyle() {
      return this.item.gender
        ? 'background-color: #87CEFA;'
        : 'background-color: none;';
    }
  },
  methods: {
    ...mapActions('address', ['saveOrUpdateAddress']),
    saveAddress() {
      if (!this.item.name || !this.item.name.trim()) {
        wx.showToast({
          title: "联系人不能为空!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      if (!this.item.phone || !this.item.phone.trim()) {
        wx.showToast({
          title: "手机号不能为空!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      if (!this.item.house_number || !this.item.house_number.trim()) {
        wx.showToast({
          title: "门牌号不能为空!",
          icon: "none",
          duration: 1000
        });
        return;
      }
      this.item.openid = this.userInfo.openid;
      this.saveOrUpdateAddress({ addressModel: this.item });
    },
    updateSex(sex) {
      this.item.gender = sex;
      if (sex) {
        this.styleA = 'background-color: #87CEFA;';
        this.styleB = 'background-color: none;';
      } else {
        this.styleB = 'background-color: #87CEFA;';
        this.styleA = 'background-color: none;';
      }
    }
  },
  onLoad(options) {
    var id = options.id;
    if (id) {
      var addr = this.myAddress;
      for (var index in addr) {
        if (addr[index].id == id) {
          this.item = Object.assign({}, addr[index]);
          break;
        }
      }
    } else {
      this.item = {
        gender: 1
      };
    }
    if (this.shopInfo && this.userInfo.addressModel) {
      this.item.wxAddress = {}
       this.item.wxAddress = this.shopInfo.wxAddress;
    }
    this.updateSex(this.item.gender);
  }
};
</script>

<style lang="scss" scoped>
.tag-c {
  display: flex;
  flex-wrap: wrap;
  background-color: white;
  .tag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100rpx;
    height: 50rpx;
    border: 2rpx solid $spLine-color;
    margin-left: 30rpx;
    span {
      font-size: 20rpx;
      color: $textBlack-color;
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
    align-items: center;
    margin-left: 30rpx;
    padding-right: 30rpx;
    height: 100rpx;
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
  .sex {
    display: flex;
    align-items: center;
    margin-left: 30rpx;
    padding-right: 30rpx;
    height: 80rpx;
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
    height: 100rpx;
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
        margin-left: 10rpx;
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
