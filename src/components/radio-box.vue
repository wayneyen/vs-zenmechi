<template>
  <view id="radio" class="radio" :class="radioClass">
    <block v-for="(item, index) in items" :key="index">
      <button
        :id="'id-' + item.value"
        class="radio-button"
        :class="item.value == active ? buttonClass + ' active' : buttonClass"
        :data-value="item.value"
        @click="onTap"
      >
        <image
          class="size-48"
          v-if="item.sel && item.nor"
          :src="item.value == active ? item.sel : item.nor"
          mode="aspectFill"
        ></image>
        <text class="lh-48">{{ item.text }}</text>
      </button>
    </block>
  </view>
</template>

<script>
export default {
  data() {
    return {
      radioClass: 'radio-0',
      buttonClass: 'button-0'
    }
  },
  props: {
    items: {
      type: Array,
      default: [],
    },
    theme: {
      type: Number,
      default: 0,
    },
    active: null
  },
  created() {
    if (this.theme == 1) {
      this.radioClass = 'radio-1'
      this.buttonClass = 'button-1'
    }
  },
  methods: {
    onTap(e) {
      const oldVal = this.activeGender
      const newVal = e.currentTarget.dataset.value

      if (oldVal === newVal) {
        return
      }

      // this.active = e.currentTarget.dataset.value
      const detail = {
        active: e.currentTarget.dataset.value,
      }

      this.$emit("select", detail, {})
    },
  },
}
</script>

<style lang="scss" scoped>
.radio {
  display: flex;
  box-sizing: border-box;
  padding: 8upx;
  position: relative;
  font-family: "Barlow Condensed", SimHei;
}

.radio-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: transparent;
  font-size: 28upx;
  z-index: 100;
  padding: 0;
}

.radio-button::after {
  border: none;
}

.size-48 {
  width: 48upx;
  height: 48upx;
}

.lh-48 {
  line-height: 48upx;
}

.animation {
  position: absolute;
  z-index: 50;
}

/* 自訂樣式 0 */
.radio-0 {
  margin: 30rpx;
  background-color: #FFFFFF;
  width: 690rpx;
  height: 140rpx;
  border-radius: 74rpx;
}
.button-0 {
  border-radius: 74rpx;
  color: #6f7c87;
}
.button-0.active {
  background-color: #F2F7F7;
}

/* 自訂樣式 0 */
.radio-0 {
  margin: 30rpx;
  background-color: #FFFFFF;
  width: 690rpx;
  height: 140rpx;
  border-radius: 74rpx;
}
.button-0 {
  border-radius: 74rpx;
  color: #6f7c87;
}
.button-0.active {
  background-color: #F2F7F7;
}

/* 自訂樣式 1 */
.radio-1 {
  margin: 30rpx;
  background-color: #6F7C87;
  width: 360rpx;
  height: 80rpx;
  border-radius: 40rpx;
}
.button-1 {
  border-radius: 40rpx;
  color: #FFFFFF;
}
.button-1.active {
  background-color: #F2F7F7;
  color: #6f7c87;
}

</style>
