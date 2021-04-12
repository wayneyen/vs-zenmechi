<template>
  <view>
    <block v-for="(mealDesc, index) in mealsDesc" :key="index">
      <view class="meal-title">
        <view class="meal-name">{{ mealDesc }}</view>
        <view class="meal-kcal">{{ kcals[index] }}Kcal</view>
        <view class="meal-add" @click="addRecord(index)">
          <image src="/static/add.png"></image>
          增加
        </view>
      </view>

      <uni-swipe-action>
        <uni-swipe-action-item v-for="(record, recordIndex) in records" :key="record.id" 
          v-if="record.meals[mealsCount] == index + 1"
          :right-options="swipeOptions" @click="onClick">
          <view class="food" @click="editRecord(record.id)">
            <view class="food-title">
              {{ record.name }}
              <image class="food-icon" :src="record.type == 1 ? `/static/type${record.food.type1}.png` : ''"></image>
            </view>
            
            <view class="food-protein">{{ Math.round(record.protein) }}</view>
            <view class="food-carbs">{{ Math.round(record.carbs) }}</view>
            <view class="food-fat">{{ Math.round(record.fat) }}</view>
            <view class="food-kcal">{{ Math.round(record.kcal) }}</view>
            <view class="food-weight">x{{ Math.round(record.weight) }}g</view>
            
            <image class="food-arrow" src="../../static/arrow-r.png"></image>
          </view>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </block>
  </view>
</template>

<script>
  import config from '@/common/config.js'
  import string from '@/common/string.js'

  export default {
    data() {
      return {
        records: [],

        mealsCount: 0,
        mealsDesc: [],
        kcals: [0, 0, 0, 0, 0],

        swipeOptions: [{
          text: '删除',
          style: {
            backgroundColor: '#FF95BC'
          }
        }]
      }
    },

    onLoad(options) {
      const today = new Date().toJSON().slice(0, 10)

      this.mealsCount = getApp().globalData.profile.meals_count
      this.mealsDesc = config.mealsDesc[this.mealsCount]

      uni.request({
        url: `${config.api}/api/record/detail`,
        data: {
          profile_id: getApp().globalData.profile.id,
          date: today
        },
        method: 'POST',
        success: (res) => {
          // console.log(res)
          this.records = res.data
          this.calcKcals()
        }
      })
    },
    methods: {
      calcKcals() {
        this.records.forEach(record => {
          for (let i = 1; i <= 5; i++) {
            if (record.meals[this.mealsCount] == i) {
              this.kcals[i - 1] += Math.round(record.kcal / 100 * record.weight);
            }
          }
        })
      },
      
      addRecord(index, e) {
        const eatTimes = string.str2times(config.mealTimes[getApp().globalData.profile.meals_count][index])
        uni.navigateTo({
          url: `../begin/begin?hour=${eatTimes[0]}&minute=${eatTimes[1]}`
        })
      },
      
      editRecord(id, e) {
        uni.navigateTo({
          url: `../record/record?editID=` + id
        })
      }
    }
  }
</script>

<style lang="scss">
  .meal-title {
    background-color: $chi-extragray;
    height: 120upx;
    display: flex;
    align-items: center;

    .meal-name {
      font-size: 36upx;
      text-align: center;
      color: $chi-lightgray;
      width: 120upx;
    }

    .meal-kcal {
      font-size: 32upx;
      text-align: center;
      color: $chi-gray;
      width: 120upx;
    }

    .meal-add {
      font-size: 28upx;
      padding-right: 26upx;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: $chi-gray;
      flex: 1;

      image {
        width: 40upx;
        height: 40upx;
        margin-right: 10upx;
      }
    }
  }
  
  .food {
    height: 88upx;
    border-bottom: 2upx solid $chi-extragray;
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    
    .food-title {
      color: $chi-gray;
      font-size: 28upx;
      padding-left: 30upx;
      flex: 1;
      
      .food-icon {
        width: 20upx;
        height: 20upx;
        margin-left: 16upx;
      }
    }
              
    .food-protein {
      width: 60upx;
      color: $chi-protein;
      font-size: 32upx;
      text-align: center;
    }
    .food-carbs {
      width: 60upx;
      color: $chi-carbs;
      font-size: 32upx;
      text-align: right;
    }
    .food-fat {
      width: 60upx;
      color: $chi-fat;
      font-size: 32upx;
      text-align: right;
    }
    .food-kcal {
      width: 100upx;
      color: $chi-gray;
      font-size: 32upx;
      text-align: right;
    }
    .food-weight {
      width: 130upx;
      color: $chi-lightgray;
      font-size: 32upx;
      text-align: right;
    }
    
    .food-arrow {
      width: 40upx;
      height: 40upx;
      margin: 12upx;
    }
  }

</style>
