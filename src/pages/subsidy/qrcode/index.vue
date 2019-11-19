<template>
	<div class="qrcode-wrap">
		<div class="qrcode-container">
			<image class="qrcode-img" :src="qrcodeURL"></image>
		</div>
	</div>
</template>

 <script>
const QR = require('../../../utils/weapp-qrcode.js')

export default {
  data() {
    return {
      shopId: undefined,
      userInfo: {},
      qrcodeURL: "",
      codeText: "github.com/Pudon",
    };
  },
  methods: {
    qrcode() {
      var text = encodeURIComponent(wx.getStorageSync("sessionId"));
    var imgData = QR.drawImg(text, {
      typeNumber: 4,
      errorCorrectLevel: 'M',
      size: 500
    })
    this.qrcodeURL = imgData
    }
  },
  mounted() {
    this.qrcode();
  },
  onLoad(options) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
        status: "qrcode"
    });
  }
};
</script>

<style lang="scss" scoped>
.container {
  background: #f5f5f5;
}
.qrcode-wrap {
  background: #fff;
  border-radius: 33rpx;
}
.qrcode-container {
  padding-top: 80rpx;
  padding-bottom: 50rpx;
  text-align: center;
}
.qrcode-img {
  width: 500rpx;
  height: 500rpx;
}
.text-container {
  padding: 50rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 2rpx solid #f0f0f0;
}
.text-input {
  border: 2rpx solid #f5f5f5;
  border-radius: 10rpx;
  margin-right: 10rpx;
  padding: 20rpx;
}
.change-btn {
  width: 200rpx;
  color: #fff;
  padding: 0 50rpx;
}
</style>