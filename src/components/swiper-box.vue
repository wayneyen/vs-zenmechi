<template>
  <scroll-view class="scroll" scroll-x :scroll-left="scrollLeft" :style="[scrollStyle]" @scroll="scroll" @touchend="scrollEnd">
    <view class="scroll-container" :style="[containerStyle]">
      <block v-for="(item, index) in blankLines" :key="index"><view class="item"></view></block>
      <block v-for="(item, index) in items" :key="index">
        <view class="item">
          <view
            class="line"
            :class="{ orange: item == scrollValue }"
            :style="[{ width: `${lineWidth * zoom}px`, height: `${item % step == 0 || item == scrollValue ? (height / 2) * zoom : (height / 3) * zoom}px` }]"
          ></view>
          <view class="text" v-if="displayValue">{{ item % 10 == 0 || item == min || item == max ? item * multiple : '' }}</view>
        </view>
      </block>
      <block v-for="(item, index) in blankLines" :key="index"><view class="item"></view></block>
    </view>
  </scroll-view>
</template>

<script>
import number from '@/common/number.js';

export default {
  /**
   * 组件的属性列表
   */
  props: {
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 100
    },
    value: {
      type: Number,
      default: 50
    },
    multiple: {
      type: Number,
      default: 1
    },
    lineWidth: {
      type: Number,
      default: 4
    },
    blocks: {
      type: Number,
      default: 25
    },
    width: {
      type: Number,
      default: 750
    },
    height: {
      type: Number,
      default: 120
    },
    displayValue: {
      type: Boolean,
      default: true
    },
    step: {
      type: Number,
      default: 10
    }
  },

  /**
   * 组件的初始数据
   */
  data() {
    return {
      items: [],
      zoom: 1,
      blockWidth: 30,
      scrollWidth: 0,
      scrollLeft: 0,
      scrollValue: 0,
      blankLines: [0, 1, 2, 3, 4]
    };
  },
  computed: {
    scrollStyle() {
      return {
        height: this.height * this.zoom + 'px'
      };
    },
    containerStyle() {
      return {
        width: `${this.blockWidth * (this.max - this.min + 1 + 10) * this.zoom}px`,
        height: `${this.height * this.zoom}px`
      };
    }
  },
  created() {
    this.zoom = getApp().globalData.zoom;
    this.items = number.range(this.min, this.max);
    
    if (!this.displayValue) {
      this.height *= 0.66 
    }
    
    this.blockWidth = this.width / this.blocks

    setTimeout(() => {
      const left = this.getLeft(this.value);
      this.scrollLeft = left;
    }, 1000);
  },
  methods: {
    getLeft(value) {
      const offset = (this.blocks - 1) / 2 - 5;
      const min = this.min + offset; // 左边一半格 - 5格空白
      const blocks = value - min;
      const left = blocks * this.blockWidth * this.zoom;
      return left;
    },
    scroll(e) {
      // 移动了 blocks 格
      let blocks = e.detail.scrollLeft / this.zoom / this.blockWidth;
      blocks = blocks.toFixed(0);

      const offset = (this.blocks - 1) / 2;

      // 计算在画面中间的格子
      blocks = parseInt(blocks) + offset;

      // 前面有 5 格空白，所以最左边现在在第 blocks - 5 格
      blocks = parseInt(blocks) - 5;

      // 最后结果加上 min
      const value = blocks + this.min;

      const detail = {
        value: value
      };

      this.scrollValue = value;
      this.$emit('scroll', detail, {});
    },
    scrollEnd(e) {
      setTimeout(() => {
        const left = this.getLeft(this.scrollValue);
        this.scrollLeft = left;
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll {
  position: relative;
  background-color: #FFFFFF;
  .scroll-container {
    display: flex;
    overflow: hidden;
    position: relative;
    .item {
      flex: 1;
      align-items: center;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      position: relative;
      box-sizing: border-box;
      .line {
        background-color: #b7c4c7;
      }
      .orange {
        background-color: #f29180;
      }
      .text {
        position: absolute;
        color: #6f7c87;
        font-size: 36upx;
        width: 100upx;
        top: 50%;
        padding-top: 10upx;
        text-align: center;
      }
    }
  }
}
</style>
