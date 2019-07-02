<template>
  <div class="container">
    <van-cell-group>
      <van-field value="输入框已禁用" label="微信号" disabled border="false"/>
      <van-field
        v-model="item.realname"
        @change="changeUsername"
        required
        clearable
        label="用户名"
        placeholder="请输入用户名"
        bind:click-icon="onClickIcon"
      />
      <van-field
        @change="changeTel"
        v-model="item.tel"
        label="手机号"
        placeholder="请输入手机号"
        :error-message="telError"
        border="false"
      />
      <div style="margin-left: 50rpx;display:inline-block">
        <van-radio-group :value="item.radio">
          性别
          <van-radio name="1" style="margin-left: 50rpx;display:inline-block" @click="onChangeRadio">男</van-radio>
          <van-radio name="2" style="margin-left: 50rpx;display:inline-block" @click="onChangeRadio">女</van-radio>
        </van-radio-group>
      </div>
    </van-cell-group>
    <div class="sex">
      <div class="l"></div>
      <div class="tag-c">
        <div class="tag" :style="styleA" @click="updateSex(1)">
          <span>先生</span>
        </div>
        <div class="tag" :style="styleB" @click="updateSex(0)">
          <span>女士</span>
        </div>
      </div>
    </div>
    <div class="submit-btn" @click="saveAddress">
      <span>保存地址</span>
    </div>
    <mp-uploader
      @upLoadSuccess="upLoadSuccess"
      @upLoadFail="upLoadFail"
      @uploadDelete="uploadDelete"
      :showTip="false"
      :count="1"
    ></mp-uploader>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import mpButton from "mpvue-weui/src/button";

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
      item: {
        radio: "2",
        gender: 1,
        tel: 123
      }
    };
  },
  computed: {
    ...mapState("address", ["myAddress"]),
    ...mapState("user", ["userInfo"]),
    ...mapState("shoppingCart", ["shopInfo"])
  },
  methods: {
    ...mapActions("address", ["saveOrUpdateAddress"]),
    changeUsername(event) {
      this.item.realname = event.mp.detail;
    },
    onChangeRadio(event) {
      this.item.radio = event.currentTarget.dataset;
      console.log(event.detail);
    },
    changeTel(event) {
      this.item.tel = event.mp.detail;
      if (this.item.tel) {
        this.telError = "手机号错误" + this.item.tel;
      } else {
        this.telError = "";
      }
    }
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
