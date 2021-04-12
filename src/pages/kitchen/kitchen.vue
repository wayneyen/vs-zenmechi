<template>
  <view class="container">
    <view class="menu">
      <view @click="tapType1" data-type1="1" class="menu-item d-center" :class="type1 == 1 ? 'active' : ''">
        <view class="menu-item-english">PROTEIN</view>
        <view class="menu-item-chinese">肉蛋类</view>
      </view>
      <view @click="tapType1" data-type1="2" class="menu-item d-center" :class="type1 == 2 ? 'active' : ''">
        <view class="menu-item-english">CARBS</view>
        <view class="menu-item-chinese">谷类蔬果</view>
      </view>
      <view @click="tapType1" data-type1="3" class="menu-item d-center" :class="type1 == 3 ? 'active' : ''">
        <view class="menu-item-english">FAT</view>
        <view class="menu-item-chinese">油脂</view>
      </view>
    </view>

    <view class="foods">
      <view class="thead">
        <view class="d-center th th1">种类</view>
        <view class="d-center th th2">名称</view>
        <view class="d-center th th3">蛋白<text>(G)</text></view>
        <view class="d-center th th4">碳水<text>(G)</text></view>
        <view class="d-center th th5">脂肪<text>(G)</text></view>
        <view class="d-center th th6">热量<text>(Kcal)</text></view>
      </view>

      <view class="tbody">
        <block v-for="(food, index) in foods" :key="index">
          <view @click="tapFood" :data-food="food" class="d-center"
            :class="{ hasCurrent: currentFood, active: food.id === currentFood.id }" v-show="type1 == food.type1">
            <view class="d-center td th1">
              <image :src="getFoodIcon(food.icon)" mode="aspectFill"></image>
            </view>
            <view class="d-center td th2">
              {{ stripFoodName(food.name) }}{{ food.unit == '100g' ? '' : '(' + food.unit + ')' }}
            </view>
            <view class="d-center td th3">{{ round(food.protein * food.amount / 100) }}</view>
            <view class="d-center td th4">{{ round(food.carbs * food.amount / 100) }}</view>
            <view class="d-center td th5">{{ round(food.fat * food.amount / 100) }}</view>
            <view class="d-center td th6">{{ round(food.kcal * food.amount / 100) }}</view>
          </view>
        </block>
      </view>
    </view>

    <scroll-view scroll-y="true" class="detail-container" v-if="currentFood">
      <view class="detail">
        <view class="title d-center">
          <view class="title-text" v-show="currentFood.name && stripFoodName(currentFood.name)">
            {{ stripFoodName(currentFood.name) }}
          </view>
          <image v-show="currentFood" class="title-image" :src="getFoodIcon(currentFood.icon)" mode="aspectFit">
          </image>
        </view>
        
        <!-- <view class="desc" v-show="currentFood.name && splitFoodName(currentFood.name)">
          {{ splitFoodName(currentFood.name) }}
        </view> -->

        <view class="my kcal">
          <view class="kcal-row" style="margin-bottom: 40upx;">
            <view class="kcal-col1">
              <view class="kcal-title">Kcal</view>
              <view class="kcal-title">/每{{ currentFood.unit }}</view>
            </view>
            <view class="kcal-col2 kcal-big">{{ currentFood.kcal * currentFood.amount / 100 }}</view>
            <view class="kcal-col3"></view>
          </view>

          <view class="kcal-row kcal-protein">
            <view class="kcal-col1">
              <view class="kcal-light">PROTEIN</view>
              <view class="kcal-sub">蛋白</view>
            </view>
            <view class="kcal-col2">
              <view class="kcal-white">G</view>
              <view class="kcal-middle">{{ currentFood.protein * currentFood.amount / 100 }}</view>
            </view>
            <view class="kcal-col3">
              <view class="kcal-white"></view>
              <view class="kcal-small"></view>
            </view>
          </view>

          <view class="kcal-row kcal-carbs">
            <view class="kcal-col1">
              <view class="kcal-light">CARBS</view>
              <view class="kcal-sub">碳水</view>
            </view>
            <view class="kcal-col2">
              <view class="kcal-white">G</view>
              <view class="kcal-middle">{{ currentFood.carbs * currentFood.amount / 100 }}</view>
            </view>
            <view class="kcal-col3">
              <view class="kcal-white"></view>
              <view class="kcal-small"></view>
            </view>
          </view>

          <view class="kcal-row kcal-fat">
            <view class="kcal-col1">
              <view class="kcal-light">FAT</view>
              <view class="kcal-sub">脂肪</view>
            </view>
            <view class="kcal-col2">
              <view class="kcal-white">G</view>
              <view class="kcal-middle">{{ currentFood.fat * currentFood.amount / 100 }}</view>
            </view>
            <view class="kcal-col3">
              <view class="kcal-white"></view>
              <view class="kcal-small"></view>
            </view>
          </view>
        </view>

        <view class="close">
          <image @click="tapClose" class="image" src="/static/close.png" mode="scaleToFill"></image>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import config from '@/common/config.js'
  import number from '@/common/number.js'
  import string from '@/common/string.js'

  export default {
    data() {
      return {
        type1: 1,
        types: [],
        colors: [],
        foods: [],
        currentFood: null
      }
    },
    computed: {

    },
    async onLoad() {
      uni.showLoading({
        title: '食材载入中...',
        mask: true
      })

      const types = await uni.request({
        url: `${config.api}/api/food/all`,
        dataType: 'json',
        method: 'get'
      })

      this.types = types[1].data.type1s
      this.colors = types[1].data.colors
      this.foods = types[1].data.foods

      uni.hideLoading()
    },
    methods: {
      stripFoodName(foodName) {
        return string.stripFoodName(foodName)
      },
      splitFoodName(foodName) {
        return string.splitFoodName(foodName)
      },
      getFoodIcon(icon) {
        return icon ? config.api + '/' + string.replaceIcon(icon) : '/images/default.png'
      },
      round(v) {
        return number.round(v)
      },
      tapType1(e) {
        this.type1 = e.currentTarget.dataset.type1
      },
      tapFood(e) {
        this.currentFood = e.currentTarget.dataset.food
      },
      tapClose (e) {
        this.currentFood = null
      }
    }
  }
</script>

<style>
  .menu {
    position: fixed;
    width: 100upx;
    top: 0;
    left: 0;
    box-sizing: border-box;
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: 'Barlow Condensed', SimHei;
  }

  .menu-item {
    flex: 1;
    width: 100upx;
    line-height: 32upx;
  }

  .menu .menu-item {
    background-color: #F2F7F7;
  }

  .menu .active {
    background-color: #FFF;
  }

  .menu-item-english {
    color: #FFF;
    font-size: 62upx;
    writing-mode: vertical-lr;
    text-align: center;
    font-weight: bold;
    transform: rotate(180deg);
    z-index: 10;
  }

  .menu-item-chinese {
    color: #B7C4C7;
    font-size: 40upx;
    writing-mode: vertical-lr;
    text-align: center;
    font-weight: bold;
    z-index: 30;
  }

  .menu .active .menu-item-english {
    color: #F2F7F7;
  }

  .menu .active .menu-item-chinese {
    color: #6F7C87;
  }

  .foods {
    background-color: #FFF;
    left: 100upx;
    position: absolute;
    padding-top: 80upx;
    font-family: 'Barlow Condensed', SimHei;
  }

  .thead {
    background-color: #FFF;
    position: fixed;
    top: 0;
    left: 100upx;
    display: flex;
  }

  .tbody {
    background-color: #FFF;
  }

  .th {
    height: 80upx;
    color: #B7C4C7;
    font-size: 24upx;
    flex-direction: column;
  }

  .th1 {
    width: 120upx;
  }

  .th2 {
    width: 168upx;
  }

  .th3 {
    width: 80upx;
  }

  .th4 {
    width: 80upx;
  }

  .th5 {
    width: 80upx;
  }

  .th6 {
    width: 120upx;
  }

  .td {
    height: 120upx;
    color: #6F7C87;
    font-size: 44upx;
  }

  .tbody .th1 image {
    width: 48upx;
    height: 48upx;
  }

  .hasCurrent .th1 {
    background-color: #F2F7F7;
  }

  .active .th1 {
    background-color: #fff;
  }

  .tbody .th2 {
    padding: 10upx;
    font-size: 28upx;
    box-sizing: border-box;
  }

  .tbody .th3 {
    color: #6ACBDA;
  }

  .tbody .th4 {
    color: #8DCD1E;
  }

  .tbody .th5 {
    color: #FFC227;
  }

  .detail-container {
    position: fixed;
    left: 220upx;
    top: 0;
    right: 0;
    height: 150%;
    background-color: transparent;
  }

  .detail {
    position: absolute;
    left: 0upx;
    top: 0;
    right: 0;
    bottom: 0;
    width: 530upx;
    background-color: #ffffff;
  }

  .detail .title {
    padding: 20upx 70upx 20upx 68upx;
    box-sizing: border-box;
    justify-content: space-between;
  }

  .detail .title .title-text {
    font-size: 48upx;
    font-weight: 500;
    color: rgba(111, 124, 135, 1);
    line-height: 66upx;
  }

  .detail .title .title-image {
    width: 96upx;
    height: 96upx;
    margin-left: 20upx;
  }

  .detail .desc {
    width: 430upx;
    font-size: 28upx;
    font-weight: 400;
    color: rgba(111, 124, 135, 1);
    line-height: 40upx;
    margin: 0 auto;
    margin-bottom: 40upx;
  }

  .my {
    width: 470upx;
    margin: 0 auto;
  }

  .detail .close {
    margin-top: 40upx;
    margin-bottom: 40upx;
    text-align: center;
  }

  .detail .image {
    width: 96upx;
    height: 96upx;
  }
  
  
  .my {
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-family: "Barlow Condensed", SimHei;
  }
  
  .kcal {
    width: 430rpx;
    background-color: #6f7c87;
    color: #fff;
    margin-top: 30rpx;
    position: relative;
    padding: 40rpx;
    flex-direction: column;
  }
  
  .kcal-row {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .kcal-col1 {
    width: 130rpx;
  }
  .kcal-col2 {
    width: 150rpx;
  }
  .kcal-col3 {
    width: 70rpx;
  }
  .kcal-icon {
    position: absolute;
    width: 48rpx;
    height: 48rpx;
    top: 20rpx;
    right: 20rpx;
  }
  .kcal-title {
    font-size: 23rpx;
    color: #fff;
    text-align: right;
    padding-right: 36rpx;
  }
  .kcal-big {
    font-size: 88rpx;
  }
  .kcal-protein {
    border-left: 8rpx solid #98f1ff;
    text-align: right;
    box-sizing: border-box;
    align-items: flex-start;
    padding-top: 20rpx;
    padding-bottom: 16rpx;
  }
  .kcal-carbs {
    border-left: 8rpx solid #cbff70;
    text-align: right;
    box-sizing: border-box;
    align-items: flex-start;
    padding-top: 20rpx;
    padding-bottom: 16rpx;
    margin-top: 10rpx;
  }
  .kcal-fat {
    border-left: 8rpx solid #fbff80;
    text-align: right;
    box-sizing: border-box;
    align-items: flex-start;
    padding-top: 20rpx;
    padding-bottom: 16rpx;
    margin-top: 10rpx;
  }
  .kcal-light {
    color: #8b969f;
    font-size: 24rpx;
    padding-right: 36rpx;
  }
  .kcal-sub {
    font-size: 36rpx;
    padding-right: 36rpx;
    margin: 8rpx 0;
  }
  .kcal-white {
    font-size: 24rpx;
    text-align: left;
  }
  .kcal-middle {
    font-size: 68rpx;
    text-align: left;
    margin-top: -6rpx;
  }
  .kcal-small {
    font-size: 44rpx;
    margin: 8rpx 0;
    text-align: left;
  }
</style>
