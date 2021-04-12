<template>
  <view id="radio" class="radio" :style="[radioStyle]">
    <block v-for="(item, index) in items" :key="index">
      <button
        :id="'id-' + item.value"
        :class="item.value == active ? 'radio-button active' : 'radio-button'"
        :style="{
          'border-radius': innerRadius,
          color: item.value == active ? acolor : dcolor,
          'background-color': item.value == active ? dcolor : acolor
        }"
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
      animationPosition: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      radioLeft: 0,
    }
  },
  props: {
    items: {
      type: Array,
      default: [],
    },
    width: {
      type: String,
      default: "690rpx",
    },
    height: {
      type: String,
      default: "140rpx",
    },
    color: {
      type: String,
      default: "#F2F7F7",
    },
    bg: {
      type: String,
      default: "#FFFFFF",
    },
    acolor: {
      type: String,
      default: "#FFFFFF",
    },
    dcolor: {
      type: String,
      default: "#F2F7F7",
    },
    radius: {
      type: String,
      default: "74rpx",
    },
    innerRadius: {
      type: String,
      default: "74rpx",
    },
    margin: {
      type: String,
      default: "30rpx",
    },
    active: null,
  },
  computed: {
    radioStyle() {
      return {
        margin: this.margin,
        "background-color": this.bg,
        width: this.width,
        height: this.height,
        "border-radius": this.radius,
      }
    },

    // color: {{ item.value == active ? acolor : dcolor }}; background-color: {{ item.value == active ? dcolor : acolor }};"
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
  border-radius: 74px;
  color: #6f7c87;
}

.active {
  color: #6f7c87;
  background-color: #f2f7f7;
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
</style>
