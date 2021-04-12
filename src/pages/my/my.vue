<template>
  <view class="container flex">
    <view class="flex-3">
      <view class="basic rounded flex">
        <view class="basic-avatar">
          <open-data type="userAvatarUrl"></open-data>
        </view>

        <view class="flex-1">
          <view class="basic-name">
            <open-data type="userNickName"></open-data>
          </view>
          <view class="basic-days">已坚持 {{ profile.keep.days }} 天</view>
        </view>
      </view>

      <view class="kcal rounded text-white">
        <!-- 每日 -->
        <view class="flex" style="margin-bottom: 40upx;">
          <view class="flex-3 flex flex-col content-center text-base">
            <view>每日摄入</view>
            <view>Kcal</view>
          </view>
          <view class="flex-3 text-3xl">
            {{ totalKcal }}
          </view>
          <view class="flex-2"></view>
        </view>

        <!-- 蛋白 -->
        <view class="flex protein text-base">
          <view class="flex-2">
            <view class="light">PROTEIN</view>
            <view class="sub text-lg">蛋白</view>
          </view>
          <view class="flex-3">
            <view>Kcal</view>
            <view class="text-2xl">{{ totalProtein }}</view>
          </view>
          <view class="flex-1">
            <view>G</view>
            <view class="sub text-xl">{{ totalProteinG }}</view>
          </view>
        </view>

        <!-- 碳水 -->
        <view class="flex carbs text-base">
          <view class="flex-2">
            <view class="light">CARBS</view>
            <view class="sub text-lg">碳水</view>
          </view>
          <view class="flex-3">
            <view>Kcal</view>
            <view class="text-2xl">{{ totalCarbs }}</view>
          </view>
          <view class="flex-1">
            <view>G</view>
            <view class="sub text-xl">{{ totalCarbsG }}</view>
          </view>
        </view>

        <!-- 脂肪 -->
        <view class="flex fat text-base">
          <view class="flex-2">
            <view class="light">FAT</view>
            <view class="sub text-lg">脂肪</view>
          </view>
          <view class="flex-3">
            <view>Kcal</view>
            <view class="text-2xl">{{ totalFat }}</view>
          </view>
          <view class="flex-1">
            <view>G</view>
            <view class="sub text-xl">{{ totalFatG }}</view>
          </view>
        </view>
      </view>

    </view>

    <view class="flex-2">
      <view class="info rounded relative">
        <image src="/static/edit2.png" class="edit-icon" mode="aspectFit" @click="goProfile" />

        <view>性别</view>
        <view v-if="profile.gender === 2" class="text-lg" style="margin-bottom: 20upx; line-height: 88upx;">
          <image src="/static/female_mini.png" mode="aspectFit" class="info-icon"></image>
          女士
        </view>
        <view v-if="profile.gender === 1" class="text-lg" style="margin-bottom: 20upx; line-height: 88upx;">
          <image src="/static/male_mini.png" mode="aspectFit" class="info-icon"></image>
          男士
        </view>

        <view>年龄</view>
        <view class="text-2xl" style="margin-bottom: 20upx;">{{ age }}</view>

        <view>身高cm</view>
        <view class="text-2xl">{{ profile.tall }}</view>
      </view>

      <view class="target rounded relative">
        <image src="/static/edit2.png" class="edit-icon" mode="aspectFit" @click="goTarget" />

        <view>体重kg</view>
        <view class="text-2xl" style="margin-bottom: 20upx;">
          {{ profile.weight }}
        </view>

        <view>活动系数</view>
        <view class="text-2xl" style="margin-bottom: 20upx;">{{ profile.activity }}</view>

        <view>目标</view>
        <view class="text-lg" v-if="profile.target === 1" style="line-height: 88upx;">
            <image src="/static/slim_mini.png" mode="aspectFit" class="info-icon"></image>
            减脂
        </view>
        <view class="text-lg" v-if="profile.target === 2" style="line-height: 88upx; font-size: 32upx;">
            <image src="/static/maintain_mini.png" mode="aspectFit" class="info-icon"></image>
            保持现状
        </view>
        <view class="text-lg" v-if="profile.target === 3" style="line-height: 88upx;">
            <image src="/static/muscle_mini.png" mode="aspectFit" class="info-icon"></image>
            增肌
        </view>
      </view>

    </view>

  </view>
</template>

<script>
  import config from '@/common/config.js'
  import number from '@/common/number.js'
  
  export default {
    data() {
      return {
        profile: null
      }
    },
    computed: {
      totalKcal() {
        if (this.profile) {
          return number.round(this.profile.nutrition.carbs + this.profile.nutrition.fat + this.profile.nutrition.protein)
        } else {
          return 0
        }
      },
      totalProtein() {
        if (this.profile) {
          return number.round(this.profile.nutrition.protein) ?? 0
        } else {
          return 0
        }
      },
      totalCarbs() {
        if (this.profile) {
          return number.round(this.profile.nutrition.carbs) ?? 0
        } else {
          return 0
        }
      },
      totalFat() {
        if (this.profile) {
          return number.round(this.profile.nutrition.fat) ?? 0
        } else {
          return 0
        }
      },
      totalProteinG() {
        if (this.profile) {
          return number.round(this.profile.nutrition.proteinG) ?? 0
        } else {
          return 0
        }
      },
      totalCarbsG() {
        if (this.profile) {
          return number.round(this.profile.nutrition.carbsG) ?? 0
        } else {
          return 0
        }
      },
      totalFatG() {
        if (this.profile) {
          return number.round(this.profile.nutrition.fatG) ?? 0
        } else {
          return 0
        }
      },
      age() {
        const birthYear = this.profile ? this.profile.birthYear : 0
        const currentYear = new Date().getFullYear()
        return currentYear - birthYear
      }
    },
    onLoad () {
      this.profile = getApp().globalData.profile
    },
    methods: {
      goProfile() {
        uni.navigateTo({
          url: '/pages/profile/profile'
        })
      },
      goTarget() {
        uni.navigateTo({
          url: '/pages/target/target'
        })
      }
    }
  }
</script>

<style lang="scss">
  .basic {
    box-sizing: border-box;
    background-color: $chi-extragray;
    color: $chi-gray;
    padding: 70upx 40upx;
    margin: 30upx;

    .basic-avatar {
      width: 100upx;
      height: 100upx;
      background-color: gray;
      border-radius: 50%;
      margin-right: 20upx;
      overflow: hidden;
    }

    .basic-name {
      font-size: 36upx;
    }

    .basic-days {
      font-size: 24upx;
    }
  }

  .kcal {
    padding: 70upx 40upx;
    padding-bottom: 30upx;
    background-color: $chi-gray;
    margin: 30upx;
  }

  .protein {
    border-left: 8upx solid $chi-protein;
    padding-left: 20upx;
    padding-top: 10upx;
    padding-bottom: 20upx;
    margin-bottom: 8upx;
  }

  .carbs {
    border-left: 8upx solid $chi-carbs;
    padding-left: 20upx;
    padding-top: 10upx;
    padding-bottom: 20upx;
    margin-bottom: 8upx;
  }

  .fat {
    border-left: 8upx solid $chi-fat;
    padding-left: 20upx;
    padding-top: 10upx;
    padding-bottom: 20upx;
  }

  .light {
    color: $chi-lightgray;
  }

  .sub {
    color: #FFFFFF;
    line-height: 88upx;
  }

  .edit-icon {
    position: absolute;
    width: 48upx;
    height: 48upx;
    top: 20upx;
    right: 20upx;
  }

  .info {
    background-color: #BDF48F;
    color: #64AB27;
    box-sizing: border-box;
    padding: 70upx 40upx;
    padding-bottom: 40upx;
    margin: 30upx;
    margin-left: 0;
  }

  .info-icon {
    width: 48upx;
    height: 48upx;
    margin-right: 10upx;
    vertical-align: middle;
  }
  
  .target {
    background-color: #B5CFED;
    color: #558BC9;
    box-sizing: border-box;
    padding: 70upx 40upx;
    padding-bottom: 40upx;
    margin: 30upx;
    margin-left: 0;
  }
  
</style>
