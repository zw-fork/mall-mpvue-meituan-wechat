<template>
  <div class="container">
    <div class="list-c">
      <div class="item" v-for="(item, index) in myAddress" :key="index" v-if="item.address == shopInfo.wxAddress.name">
        <div class="i-l" @touchstart="showDeleteButton(item.id)" @touchend="clearLoop(item.id)">
          <div class="user-info">
            <span class="s-l">{{item.name}}({{item.gender===1 ? '先生' : '女士'}})</span>
            <span class="s-r">{{item.phone}}</span>
          </div>
          <span class="address">{{item.address}} {{item.house_number}}</span>
        </div>
        <i class="icon mt-edit-o" @click="addClick(item.id)"></i>
      </div>
    </div>
    <div class="submit-btn" @click="addClick()">
      <i class="icon iconfont iconplus-circle"></i>
      <span>新增收货地址</span>
    </div>
  </div>
</template>

<script>
import {addressList} from './data'
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
     communityId: undefined,
     showModal: false,
     Loop: undefined
    }
  },
  computed: {
    ...mapState("address", ["myAddress"]),
    ...mapState("user", ["userInfo"]),
    ...mapState("shoppingCart", ["shopInfo"]),
  },
  methods: {
    ...mapActions("address", ["getAddressDataAction", "deleteUserAddressDataAction"]),
    ...mapActions("user", ["updateDefaultAddress"]),
    showDeleteButton(addressId) {
    var that = this
    this.Loop=setTimeout(function(){
      that.showModal = true
              wx.showModal({
          title: '删除？',
          content: '确定要删除当前选中的地址？',
          confirmColor: '#FFC24A',
          success: function(res) {
            if (res.confirm) {
             that.deleteUserAddressDataAction({addressId})
            }
        }
      })
    },800);
    return false;
},
clearLoop(addressId) {
    clearTimeout(this.Loop);
    if(!this.showModal){
      this.updateDefaultAddress2(addressId)
    }
    this.showModal = false
    return false;
},
    addClick(id) {
      if (id) {
        wx.navigateTo({url: '/pages/addAddress/main?id=' + id})
      } else {
        wx.navigateTo({url: '/pages/addAddress/main'})
      }
    },
    updateDefaultAddress2(addressId) {
      var wechat = {}
      wechat.openid = this.userInfo.openid
      wechat.addressModel = {}
      wechat.addressModel.id = addressId
      this.updateDefaultAddress({wechat})
    }
  },
  mounted() {
    var openid = this.userInfo.openid
    this.getAddressDataAction({'openid': openid})
  },
  onLoad(options) 
  {
    this.communityId=options.communityId;
  }
}
</script>

<style lang="scss" scoped>
.container {
  .list-c {
    display: flex;
    flex-direction: column;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: white;
      padding: 20rpx;
      border-top: 2rpx solid $spLine-color;
      .i-l {
        display: flex;
        flex-direction: column;
        .address {
          font-size: 24rpx;
          color: $textBlack-color;
        }
        .user-info {
          display: flex;
          font-weight:bold;
          font-size: 30rpx;
          .s-l {
            color: $textBlack-color;
          }
          .s-m {
            color: $textBlack-color;
            margin-left: 20rpx;
          }
          .s-r {
            color: $textBlack-color;
            margin-left: 60rpx;
          }
        }
      }
      i{
        font-size: 30rpx;
        color: $textDarkGray-color;
      }
    }
  }
  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    background-color: $theme-color;
    border-top: 2rpx solid  $spLine-color;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    i {
      font-size: 36rpx;
    }
    span {
      font-size: 28rpx;
      color: $textBlack-color;
      margin-left: 10rpx;
    }
  }
}
</style>
