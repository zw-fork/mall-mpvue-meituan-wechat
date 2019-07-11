<template>
  <div class="rr">
    <canvas
      style="width: 400px; height: 400px;"
      class="canvas"
      canvas-id="canvas"
      bindlongtap="save"
    ></canvas>
  </div>
</template>

 <script>
import QRCode from "../../utils/weapp-qrcode.js";
export default {
  data() {
    return {
      shopId: undefined,
      isModel: false,
      motto: "Hello World",
      userInfo: {}
    };
  },
  methods: {
    qrcode() {
      var text = "qrcode/addShop?sessionId=" + encodeURIComponent(wx.getStorageSync("sessionId"));
      var qrcode = new QRCode("canvas", {
        // usingIn: this,
        text: text,
        width: 150,
        height: 150,
        padding: 12,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
        callback: res => {
          // 生成二维码的临时文件
          console.log(res.path);
        }
      });
      console.log(qrcode);
    }
  },
  mounted() {
    this.qrcode();
  }
};
</script>

<style lang="scss" scoped>
.rr {
  top: 60%;
}
</style>