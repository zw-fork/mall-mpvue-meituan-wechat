<template>
  <div class="container">
    <div class="list-c">
      <div v-for="(item, index) in myAddress" :key="index">
        <div class="item" v-if="shopInfo.wxAddress && shopInfo.wxAddress.name == item.wxAddress.name">
          <div  class="i-l" @touchstart="showDeleteButton(item)" @touchend="clearLoop(item)">
            <div class="user-info">
              <span class="s-l">{{item.name}}</span>
              <span class="s-r">{{item.phone}}</span>
            </div>
            <span class="address">{{item.wxAddress ? item.wxAddress.name : ''}} {{item.house_number}}</span>
          </div>
          <i class="icon mt-edit-o" @click="addClick(item)"></i>
        </div>
      </div>
    </div>
    <div class="submit-btn" @click="addClick()">
      <i class="icon iconfont iconplus-circle"></i>
      <span>新增收货地址</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      communityId: undefined,
      address: undefined,
      showModal: false,
      Loop: undefined
    };
  },
  computed: {
    ...mapState("address", ["myAddress"]),
    ...mapState("user", ["userInfo"]),
    ...mapState("shoppingCart", ["shopInfo"])
  },
  methods: {
    ...mapActions("address", [
      "getAddressDataAction",
      "deleteUserAddressDataAction"
    ]),
    showDeleteButton(item) {
      var that = this;
      this.Loop = setTimeout(function() {
        that.showModal = true;
        wx.showModal({
          title: "删除？",
          content: "确定要删除当前选中的地址？",
          confirmColor: "#FFC24A",
          success: function(res) {
            if (res.confirm) {
              var addressId = item.id;
              that.deleteUserAddressDataAction({ addressId });
            }
          }
        });
      }, 800);
      return false;
    },
    clearLoop(item) {
      clearTimeout(this.Loop);
      if (!this.showModal) {
        this.updateDefaultAddress2(item);
      }
      this.showModal = false;
      return false;
    },
    addClick(item) {
      if (item) {
        wx.navigateTo({ url: "/pages/subsidy/addAddress/main?id=" + item.id });
      } else {
        wx.navigateTo({ url: "/pages/subsidy/addAddress/main" });
      }
    },
    updateDefaultAddress2(addressModel) {
      this.shopInfo.addressModel = addressModel
      wx.navigateBack({ delta: 1 })
    }
  },
  mounted() {
    this.getAddressDataAction();
  },
  onLoad(options) {
  }
};
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
          font-weight: bold;
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
      i {
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
    border-top: 2rpx solid $spLine-color;
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
