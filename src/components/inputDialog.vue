<template>
<div>
  <div class="modalMask" v-if="isModel"></div>
    <div class="modalDialog" v-if="isModel">
        <div class="modalContent">
      <p class="contentTip">创建新分类</p>
      <input placeholder="请输入分类名称(12字以内)" class="teleStyle" v-model="categoryName" maxlength="12">
    </div>
    <div class="modalFooter">
      <div class="btnCancel" @tap="tapCancel">取消</div>
      <div class="btnConfirm" @tap="confirmSend">确定</div>
    </div>
  </div>
</div>
</template>

<script>

export default {
    name: "reliefInsureInfo.vue",
    props: {
      limit: {
        type: Number,
        default: 20

      },
      isModel: {
        type: Boolean,
        default: true
      },
      classId: {
        type: Number,
        default: undefined
      }
    },
    data(){
      return{
        categoryName: undefined,
        changeModel: true,
        phoneNumber: '',
      }
    },
    watch:{
    },
    computed: {
      
    },
    methods:{
      // 打开输入手机号的模态框
      tapSendTele(){
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
      },
      //  弹框取消
      tapCancel(){
        this.phoneNumber = '';
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
        this.$emit("childFn", this.isModel) 
      },
      //  确认发送
      confirmSend(){
        console.log(this.phoneNumber);
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
        this.$emit("childFn", this.isModel);
        this.$emit("categoryName", this.categoryName);
        this.phoneNumber='';
      },
     }
  };

</script>

<style lang="scss" scoped>
.modalMask {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      opacity: 0.5;
      overflow: hidden;
      z-index: 9000;
      color: #fff;
      background: rgba(0, 0, 0, 0.5);
    }
    .modalDialog {
      box-sizing: border-box;
      width: 100%;
      overflow: hidden;
      position: fixed;
      left: 0;
      top:20%;
      z-index: 9999;
      opacity: 1;
      background: #fff;
      border-radius: 8rpx;
      .modalContent {
        box-sizing: border-box;
        display: flex;
        padding: 20rpx 23rpx;
        font-size: 36rpx;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .contentTip{
          text-align: center;
          font-size: 36rpx;
          color: #333333;
        }
        .teleStyle{
          background: #FFFFFF;
          border-bottom: 2rpx solid $spLine-color;
          border-radius: 6rpx;
          line-height: 50rpx;
          height: 50rpx;
          box-sizing: border-box;
          padding-left: 12rpx;
          width: 100%;
          font-size: 28rpx;
          /*color: rgba(0,0,0,0.25);*/
          margin-top: 10rpx;
        }
      }
      .modalFooter {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        height: 100rpx;
        border-top: 1rpx solid #E5E5E5;
        font-size: 36rpx;
        line-height: 100rpx;
      }
      .btnCancel {
        width: 50%;
        font-size: 36rpx;
        color: #333;
        text-align: center;
        border-right: 1rpx solid #E5E5E5;
      }
      .btnConfirm {
        font-size: 36rpx;
        width: 50%;
        color: #508CEE;
        text-align: center;
      }
}
</style>
