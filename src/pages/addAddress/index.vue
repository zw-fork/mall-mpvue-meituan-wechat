<template>
  <div class="container">
    <div class="name">
      <span>联系人：</span>
      <input placeholder="请填写收货人的姓名" placeholder-style="font-size: 24rpx" auto-focus v-model="item.name"/>
    </div>
    <div class="sex">
      <div class="l"></div>
      <div class="m" @click="updateSex(1)">
        <i :class="clazzA" :style="styleA"></i>
        <span>先生</span>
      </div>
      <div class="r" @click="updateSex(0)">
        <i :class="clazzB" :style="styleB"></i>
        <span>女士</span>
      </div>
    </div>
    <div class="phone">
      <span>手机号：</span>
      <input placeholder="请填写收货人手机号码" placeholder-style="font-size: 24rpx" v-model="item.phone"/>
    </div>
    <div class="address">
      <span class="l">收货地址：</span>
      <div class="m">
        <span v-if="!item.address">点击选择</span>
        <span v-else>{{item.address}}</span>
      </div>
    </div>
    <div class="house-num">
      <span>门牌号：</span>
      <input placeholder="详细地址，例：16号楼5楼301室" placeholder-style="font-size: 24rpx" v-model="item.house_number"/>
    </div>
    <div class="submit" @click="saveAddress">
      <span>保存地址</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

export default {
   data() {
    return {
      active : false,
      clazzA : 'icon mt-selected-o',
      styleA : 'color: #F9D173',
      clazzB : 'icon mt-unselected-o',
      styleB : 'color: #333',
      item : {
        gender : 1
      }
    }},
  computed: {
    ...mapState("address", ["myAddress"]),
    ...mapState("shoppingCart", ["shopInfo"]),
    selectedStyle() {
      return this.item.gender? 'color: #F9D173;' : 'color: #333;'
    }
  },
    methods: {
       ...mapActions("address", ["saveOrUpdateAddress"]),
       saveAddress() {
        this.saveOrUpdateAddress({addressModel : this.item})
       },
       updateSex(sex) {
         if (sex != this.item.gender) {
           this.item.gender = sex
            if (sex) {
              this.clazzA = 'icon mt-selected-o'
              this.styleA = 'color: #F9D173;font-size: 32rpx;'
              this.clazzB = 'icon mt-unselected-o'
              this.styleB = 'color: #333;font-size: 38rpx'
            } else {
              this.clazzB = 'icon mt-selected-o'
              this.styleB = 'color: #F9D173;font-size: 32rpx;'
              this.clazzA = 'icon mt-unselected-o'
              this.styleA = 'color: #333;font-size: 38rpx'
            }
         }
       }
    },
   onLoad(options) 
  {
    if (this.shopInfo) {
      this.item.address = this.shopInfo.address
      this.item.communityId = this.shopInfo.communityId
    }
    var id=options.id;
    if (id) {
      var addr = this.myAddress
        for (var index in addr) {
          if (addr[index].id == id) {
            this.item = Object.assign({}, addr[index])
            break
          } 
        }
    }
   
    
  }
}
</script>

<style lang="scss" scoped>
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
        font-size: 28rpx;
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
        font-size: 28rpx;
        color: $textBlack-color;
        margin-left: 20rpx;
      }
    }
  }
  .phone {
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
  .address {
    display: flex;
    align-items: center;
    margin-left: 30rpx;
    padding-right: 30rpx;
    height: 88rpx;
    border-bottom: 2rpx solid $spLine-color;
    .l {
      font-size: 28rpx;
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
        font-size: 28rpx;
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
