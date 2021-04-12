<script>
export default {
  globalData: {
    zoom: 1,
    openid: null,
    profile: null,
    // 默认用户个人数据
    tempProfile: {
      gender: 2,
      birthYear: 1990,
      tall: 170,
      weight: null,
      activity: 5,
      target: 2,
    },
  },
  onLaunch: function () {

  },
  onShow() {
    uni.getSystemInfo({
      success: (res) => {
        this.globalData.zoom = res.windowWidth / 750
      },
    })

  },
  onHide: function () {

  },
}
</script>

<style lang="scss">
@import "@/static/font.css";

.container {
  font-family: "Barlow Condensed", SimHei;
}
.d-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.placeholder {
  color: $chi-lightgray;
}

.rounded {
  border-radius: 20px;
}

/* Position */
.relative {
  position: relative;
}

/* Text */
.text-white {
  color: white;
}

/* Font size */
.text-base {
  font-size: 24upx;
}
.text-lg {
  font-size: 36upx;
}
.text-xl {
  font-size: 44upx;
}
.text-2xl {
  font-size: 68upx;
}
.text-3xl {
  font-size: 88upx;
}

/* Flex */
.flex {
  display: flex;
}
.flex-row {
  flex-direction: row;
}
.flex-col {
  flex-direction: column;
}
.content-center {
  justify-content: center;
}
.flex-1 {
  flex: 1;
}
.flex-2 {
  flex: 2;
}
.flex-3 {
  flex: 3;
}
.flex-4 {
  flex: 4;
}

/* 按钮 */
.btn-pure {
  border-radius: 0;
  &::after {
    border: none;
  }
}
.btn-green {
  @extend .btn-pure;
  color: $chi-gray;
  background-color: $chi-green;
  &.active {
    color: $chi-gray-active;
    background-color: $chi-green-active;
  }
}
.btn-white {
  @extend .btn-pure;
  color: $chi-gray;
  background-color: #ffffff;
  &.active {
    color: $chi-gray-active;
  }
}

.profile {
  overflow: hidden;
  width: 690rpx;
  margin: 0 30rpx;
  box-sizing: border-box;
  background-color: #fff;
  padding-bottom: 20px;
  text-align: center;
  color: #6f7c87;
}

.scale-title {
  padding-top: 40upx;
  font-size: 24upx;
  color: #6f7c87;
}

.scale-value {
  padding-top: 10upx;
  font-size: 68upx;
  margin-bottom: 44upx;
  color: #6f7c87;
}

.first {
  width: 690upx;
  height: 180upx;
  position: relative;
  background-color: #ffffff;
}
.first .tips {
  position: absolute;
  width: 82upx;
  height: 156upx;
  left: 40upx;
  top: 0;
}
.first .close {
  position: absolute;
  width: 60upx;
  height: 60upx;
  right: 40upx;
  top: -20upx;
}
.first .title {
  position: absolute;
  left: 160upx;
  top: 60upx;
  font-size: 36upx;
  font-weight: 400;
  color: rgba(111, 124, 135, 1);
  line-height: 50upx;
}
.first .text {
  position: absolute;
  left: 160upx;
  top: 110upx;
  right: 40upx;
  font-size: 24upx;
  font-weight: 400;
  color: rgba(111, 124, 135, 1);
  line-height: 34upx;
}
.first .text2 {
  position: absolute;
  left: 160upx;
  top: 138upx;
  right: 40upx;
  font-size: 24upx;
  font-weight: 400;
  color: rgba(111, 124, 135, 1);
  line-height: 34upx;
}

.modal {
  position: fixed;
  top: 0upx;
  left: 0upx;
  right: 0upx;
  bottom: 0upx;
  width: 100%;
  height: 100%;
  z-index: 8000;
}

.modal-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 6000;
  background-color: rgba(82, 89, 95, 0.4);
}
</style>
