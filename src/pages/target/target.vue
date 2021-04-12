<template>
  <view class="container">
    <view class="profile weight">
      <view class="scale-title">目前体重 kg</view>
      <input type="digit" class="weight-input"
        :value="weight"
        placeholder-style="color: #B7C4C7;" @blur="getWeight" placeholder="请输入" />
    </view>

    <view class="profile activity">
      <view class="scale-title">活动系数</view>

      <view class="activity-desc-title">
        {{ activityDesc.title }}
      </view>
      <view class="activity-desc-text">
        {{ activityDesc.text }}
      </view>
      <view class="activity-desc-text2">
        {{ activityDesc.text2 }}
      </view>

      <view class="activity-bar" @touchmove="moveActivity" @click="moveActivity">
        <view class="activity-box">
          <view class="activity-space"></view>

          <view class="activity-line activity-line-active"></view>
          <view class="activity-space"></view>

          <block v-for="(item, index) in [2, 3, 4, 5, 6, 7, 8, 9]" :key="index">
            <view class="activity-line"
              :class="activityX >= activityWidth * item ? 'activity-line-active' : ''"></view>
            <view class="activity-space"></view>
          </block>
        </view>

        <view class="activity-title">
          <view class="activity-title-text">久坐</view>
          <view class="activity-title-text">轻度</view>
          <view class="activity-title-text">中度</view>
          <view class="activity-title-text">高度</view>
          <view class="activity-title-text">超高度</view>
        </view>
      </view>
    </view>

    <radio-box :items="targetItems" :active="target" @select="selectTarget" />

    <view class="d-center">
      <view class="save d-center" @click="saveProfile">保存</view>
    </view>
    
    <uni-popup ref="popup" type="center">
      <view class="first">
          <image src="/static/modal/warning.png" mode="aspectFill" class="tips"></image>
          <image src="/static/modal/close.png" mode="aspectFill" class="close" @click="closeTip"></image>
          <view class="title">{{ tipText }}</view>
        </view>
    </uni-popup>

<!--    <van-popup :show="tip" :close-on-click-overlay="false"
      overlay-style="background-color: rgba(82, 89, 95, 0.4);"
      custom-style="overflow-y: visible;box-shadow: 0rpx 16rpx 32rpx 0rpx rgba(82, 89, 95, 0.24);">
      <view class="first">
        <image src="/static/modal/warning.png" mode="aspectFill" class="tips"></image>
        <image src="/static/modal/close.png" mode="aspectFill" class="close" bind:tap="closeTip"></image>
        <view class="title">{{ tipText }}</view>
      </view>
    </van-popup> -->

  </view>
</template>

<script>
  import config from '@/common/config.js'
  import number from '@/common/number.js'
  import RadioBox from '@/components/radio-box.vue'
  
  export default {
    data() {
      return {
        activityX: 0,
        activityWidth: 64,
        activityValue: config.activities[4],
        activityDesc: config.getActivityDesc(5),
        targetItems: config.targetItems,
        tipText: '',
        gender: 2,
        birthYear: 1990,
        tall: 180,
        weight: 50,
        activity: 0, // 活動係數
        target: 2
      };
    },
    computed: {

    },
    components: {
      RadioBox
    },
    onLoad(options) {
      // check if from profile
      this.gender = options.gender ?? getApp().globalData.profile.gender,
      this.birthYear = options.birthYear ?? getApp().globalData.profile.birthYear,
      this.tall =options.tall ?? getApp().globalData.profile.tall,
      
      this.weight = getApp().globalData.profile.weight
      this.activity = getApp().globalData.profile.activity
      this.target = getApp().globalData.profile.target
      
      this.activityWidth = this.activityWidth * getApp().globalData.zoom
    },
    methods: {
      getWeight (e) {
        this.weight = e.detail.value
        // this.weight = number.roundN(e.detail.value, 1)
        // if (isNaN(this.weight)) this.weight = ''
        // console.log(this.weight)
        // console.log(e)
      },
      moveActivity (e) {
          this.activityX = e.touches[0].pageX - e.currentTarget.offsetLeft
  
          let activity = this.activityX / this.activityWidth
          activity = Math.floor(activity)
          if (activity < 1) activity = 1
          if (activity > 9) activity = 9
  
          this.activity = activity
          
          this.activityValue = config.activities[activity - 1]
          this.activityDesc = config.getActivityDesc(activity)
      },
      selectTarget (e) {
        this.target = e.active
      },
      closeTip (e) {
        this.$refs.popup.close()
      },
      async saveProfile () {
        // console.log(this.weight)
        if (!this.weight) {
          this.tipText = '请输入体重！！'
          this.$refs.popup.open()
          return false
        }
        
        const isNumeric = !isNaN(parseFloat(this.weight)) && isFinite(this.weight)
          if (!isNumeric) {
           this.tipText = '体重请输入数字！！'
           this.$refs.popup.open()
           return false
        }

        if (parseFloat(this.weight) < 10 || parseFloat(this.weight) > 300) {
           this.tipText = '体重请输入10～300之间的数字'
           this.$refs.popup.open()
           return false
        }

        await uni.request({
            url: `${config.api}/api/profile`,
            data: {
              openid: getApp().globalData.openid,
              gender: this.gender,
              birthYear: this.birthYear,
              tall: this.tall,
              weight: this.weight,
              activity: this.activity,
              target: this.target,
            },
            method: 'post'
        })

        uni.reLaunch({
            url: '/pages/index/index?first=1'
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
  .weight {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    margin-top: 15rpx;
    margin-bottom:16rpx;
}
.scale-title {
    margin-bottom: 26rpx;
}
.weight-input {
    font-family: 'Barlow Condensed', SimHei;
    width: 392rpx;
    height: 100rpx;
    margin: 0 auto;
    background: rgba(242, 247, 247, 1);
    border-radius: 10px;
    font-size: 58rpx;
    color: #6F7C87;
}
.activity {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
}

.activity-box {
    display: flex;
    height: 60rpx;
}

.activity-space {
    flex: 1;
}

.activity-line {
    width: 4rpx;
    background-color: #B7C4C7;
}

.activity-line-active {
    background-color: #F29180;
}

.activity-title {
    display: flex;
}

.activity-title-text {
    flex: 1;
    color: #6F7C87;
    font-size: 28rpx;
    margin-top: 8rpx;
}

.activity-desc-title {
    text-align: center;
    color: #6F7C87;
    font-size: 36rpx;
    margin-bottom: 0;
    margin-top: 20rpx;
}
.activity-desc-text, .activity-desc-text2 {
    margin: 20rpx 40rpx;
    margin-bottom: 0;
    text-align: center;
    color: #6F7C87;
    font-size: 24rpx;
}
.activity-desc-text2 {
    margin-top: 5rpx;
    margin-bottom: 30rpx;
}

.save {
    margin: 40rpx 0;
    margin-top: 10rpx;
    width: 590rpx;
    height: 80rpx;
    background-color: #D1F549;
    border-radius: 40px;
    color: #A1C613;
    font-size: 44rpx;
}
.save:active {
    background-color: #B7D64D;
    color: #A1C613;
}

</style>
