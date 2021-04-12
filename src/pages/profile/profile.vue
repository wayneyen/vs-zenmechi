<template>
  <view class="container">
    <radio-box :items="genderItems" :active="gender" @select="selectGender" />

    <view class="profile age">
      <view class="scale-title">年龄（岁）</view>
      <view class="scale-value">{{ age }}</view>
      <swiper-box :value="birthYear" :min="1900" :max="2020" :width="690" @scroll="ageChange" />
    </view>
    <view class="profile tall">
      <view class="scale-title">身高（cm）</view>
      <view class="scale-value">{{ tall }}</view>
      <swiper-box :value="tall" :min="100" :max="250" :width="690" @scroll="tallChange" />
    </view>
    <view class="d-center" @click="goTarget">
      <view class="next d-center">下一步</view>
    </view>
  </view>
</template>

<script>
  import config from '@/common/config.js'
  import SwiperBox from '@/components/swiper-box.vue'
  import RadioBox from '@/components/radio-box.vue'

  export default {
    data() {
      return {
        gender: 2,
        birthYear: 1970,
        tall: 180,
        genderItems: config.genderItems
      };
    },
    components: {
      SwiperBox,
      RadioBox
    },
    computed: {
      age() {
        const d = new Date()
        return d.getFullYear() - this.birthYear
      }
    },
    onLoad() {
      this.gender = getApp().globalData.profile.gender
      this.birthYear = getApp().globalData.profile.birthYear
      this.tall = getApp().globalData.profile.tall
    },
    methods: {
      selectGender(e) {
        this.gender = e.active
      },
      ageChange(e) {
        this.birthYear = e.value
      },
      tallChange(e) {
        this.tall = e.value
      },
      goTarget(e) {
        uni.navigateTo({
          url: `/pages/target/target?gender=${this.gender}&birthYear=${this.birthYear}&tall=${this.tall}`
        })
      }
    }
  }
</script>

<style lang="scss">
  page {
    background-color: #F2F7F7;
    height: 100%;
  }

  .age {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    margin-bottom: 16upx;
  }

  .tall {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    margin-bottom: 16upx;
  }

  .next {
    margin: 40rpx 0;
    width: 590rpx;
    height: 80rpx;
    background-color: #B7C4C7;
    border-radius: 40px;
    color: #FFF;
    font-size: 44rpx;
  }

  .next:active {
    background-color: #87979D;
  }
</style>
