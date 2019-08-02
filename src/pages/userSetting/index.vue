<template>
  <div class="container">
    <van-cell-group>
      <van-field
        v-model="userInfo.realname"
        @change="changeUsername"
        required
        clearable
        label="用户名"
        placeholder="请输入用户名"
        bind:click-icon="onClickIcon"
      />
      <van-field
        @change="changeTel"
        v-model="userInfo.tel"
        label="手机号"
        placeholder="请输入手机号"
        :error-message="telError"
        border="false"
      />
    </van-cell-group>
    <div style="display:inline-block" v-if="userInfo.status>1">
      <div class="sex">
        <div class="l">关联公众号：</div>
        <div class="tag-c">
          <div class="tag" @click="saveWx(3)" v-if="userInfo.status!=3">
            <span>同意</span>
          </div>
          <div class="tag" @click="saveWx(4)" v-if="userInfo.status!=4">
            <span>取消</span>
          </div>
        </div>
      </div>
    </div>
    <div class="submit-btn" @click="saveWx(null)">
      <span>保存</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import mpButton from "mpvue-weui/src/button";
import { postFetch, getFetch } from "@/network/request/HttpExtension";

export default {
  components: {
    mpButton
  },
  data() {
    return {
      telError: undefined,
      tags: ["不吃辣", "少放葱"],
      active: false,
      clazzA: "icolorcon mt-selected-o",
      styleA: "background-color: #87CEFA",
      clazzB: "icon mt-unselected-o",
      styleB: "background-color: none;",
      userInfo: {},
      item: {
        radio: "2",
        gender: 1,
        tel: 123
      }
    };
  },
  computed: {
    ...mapState("address", ["myAddress"]),
    ...mapState("shoppingCart", ["shopInfo"])
  },
  methods: {
    ...mapActions("address", ["saveOrUpdateAddress"]),
    saveWx(status) {
      if (status) {
        this.userInfo.status = status;
      }
      var d = this.userInfo;
      postFetch("/wechat/updateWx", d, false).then(response => {
        this.userInfo = response.result;
        wx.navigateBack();
      });
    },
    changeUsername(event) {
      this.userInfo.realname = event.mp.detail;
    },
    onChangeRadio(event) {
      this.userInfo.radio = event.currentTarget.dataset;
      console.log(event.detail);
    },
    changeTel(event) {
      this.userInfo.tel = event.mp.detail;
      if (!this.userInfo.tel) {
        this.telError = "手机号错误";
      } else {
        this.telError = "";
      }
    }
  },
  mounted() {
    getFetch("/wechat/getCurrentUser", {}, false).then(response => {
      this.userInfo = response || {};
    });
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
    padding-right: 30rpx;
    height: 80rpx;
    border-bottom: 2rpx solid $spLine-color;
    .l {
      width: 250rpx;
    }
    .m {
      display: flex;
      i {
        font-size: 28rpx;
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
