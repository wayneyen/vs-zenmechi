<template>
  <view class="container">
    <form @submit="formSubmit">
      <!-- 厨房食材输入，使用kcal -->
      <view class="exist" v-if="type == 1">
        <view class="title-bar">
          <view class="title-type">种类</view>
          <view class="title-name">名称</view>
          <view class="title-protein">
            <view>蛋白</view>
            <view> </view>
          </view>
          <view class="title-carbs">
            <view>碳水</view>
            <view>(g/100g)</view>
          </view>
          <view class="title-fat">
            <view>脂肪</view>
            <view></view>
          </view>
          <view class="title-kcal">
            <view>热量</view>
            <view>(Kcal/100g)</view>
          </view>
        </view>

        <view class="value-bar" v-if="food">
          <view class="value-icon">
            <image :src="food.icon" class="value-icon"></image>
          </view>
          <view class="value-name">{{ food.name }}</view>
          <view class="value-protein">{{ food.protein }}</view>
          <view class="value-carbs">{{ food.carbs }}</view>
          <view class="value-fat">{{ food.fat }}</view>
          <view class="value-kcal">{{ food.kcal }}</view>
        </view>
      </view>

      <!-- 手动输入、自定食材输入、记录输入，使用kj -->
      <view class="quick" v-else>
        <view class="quick-title">
          <text v-if="food.name">
            {{ food.name }} 最近历史纪录-
          </text>
          每100g份量里包含:
        </view>

        <view class="quick-50">
          <view class="group">
            <view class="title d-center">名称</view>
            <input class="value" type="text" name="name" placeholder="请输入" maxlength="20" placeholder-class="placeholder"
              :value="food.name"
              focus cursor-spacing="120" />
          </view>
          <view class="group">
            <view class="title d-center">千焦</view>
            <input class="value" type="number" name="kj" placeholder="请查看包装营养表" maxlength="5" placeholder-class="placeholder"
              :value="food.kj"
              cursor-spacing="120" />
          </view>
        </view>

        <view class="quick-33">
          <view class="group protein">
            <view class="title">蛋白质(g)</view>
            <input class="value" type="number" name="protein" confirm-type="next" maxlength="5" placeholder-class="placeholder"
              :value="food.protein"
              cursor-spacing="120" placeholder="0" />
          </view>
          <view class="group carbs">
            <view class="title">碳水(g)</view>
            <input class="value" name="carbs" type="number" confirm-type="next" maxlength="5" placeholder-class="placeholder"
              :value="food.carbs"
              cursor-spacing="120" placeholder="0" />
          </view>
          <view class="group fat">
            <view class="title">脂肪(g)</view>
            <input class="value" name="fat" type="number" confirm-type="next" maxlength="5" placeholder="0"
              :value="food.fat"
              cursor-spacing="120" placeholder-class="placeholder" />
          </view>
        </view>
      </view>

      <view class="record-100">
        <view class="title">重量 g/ml</view>
        <input class="value" type="number" name="weight" placeholder="请输入吃了多少重量" maxlength="5" cursor-spacing="120"
          :value="editID ? editRecord.weight : ''"
          placeholder-class="placeholder" />
      </view>

      <view style="height: 30upx; background-color: #FFFFFF;"></view>
      <swiper-box :value="timeValue" :min="-7" :max="55" :step="6" :display-value="false" @scroll="timeChange" />
      <view class="display-time">
        大约在 <text>{{ displayTime }}</text> 吃掉了
      </view>

      <view class="record-save-bar">
        <view v-if="type === 1" class="record-save-label">这个已经在厨房了</view>

        <checkbox-group name="record" v-else>
          <checkbox value="1" checked-color="#D1F549">
            <text class="record-save-label">记录并存到厨房</text>
          </checkbox>
        </checkbox-group>

        <button form-type="submit" :loading="submiting" :disabled="submiting" class="btn-green record-save-button"
          hover-class="active">记录</button>
      </view>
    </form>

    <uni-popup ref="popup" type="center" :maskClick="false">
      <button class="popup-done" @click="eatDone">吃完了</button>
      <view style="height: 60upx" />
      <button class="popup-continue btn-green" hover-class="active" @click="eatContinue">我还要吃</button>
    </uni-popup>
  </view>
</template>

<script>
  import SwiperBox from '@/components/swiper-box.vue'
  import config from '@/common/config.js'
  import string from '@/common/string.js'

  export default {
    data() {
      return {
        id: 0,
        editID: 0,
        editRecord: {},
        type: 0,
        food: {
          name: null,
          protein: null,
          carbs: null,
          fat: null,
          kcal: null,
          kj: null
        },
        hour: '00',
        minute: '00',
        submiting: false
      }
    },
    computed: {
      timeValue() {
        return parseInt(this.hour) * 2 + (this.minute === '30' ? 1 : 0)
      },
      displayTime() {
        return string.time2string(this.hour, this.minute)
      }
    },
    components: {
      SwiperBox
    },
    async onLoad(options) {
      uni.showLoading()
      if (options.id) this.id = parseInt(options.id)
      if (options.editID) this.editID = parseInt(options.editID)
      if (options.type) this.type = parseInt(options.type)

      if (this.editID > 0) {
        // 編輯
        const editRecord = await uni.request({
          url: `${config.api}/api/record/${this.editID}`,
        })

        this.type = editRecord[1].data.type
        this.editRecord = editRecord[1].data

        this.hour = this.editRecord.record_at.split(' ')[1].split(':')[0]
        this.minute = this.editRecord.record_at.split(' ')[1].split(':')[1]
      } else if (options.hour && this.minute) {
        // 指定時間
        this.hour = options.hour
        this.minute = options.minute
      } else {
        // 現在
        const d = new Date()
        this.hour = d.getHours()
        this.minute = d.getMinutes() <= 30 ? '00' : '30'
      }

      // 带入食材资料
      if (this.editID > 0 && this.type == 1) {
        // 編輯 + 廚房食材
        this.food = this.editRecord.food
      } else if (this.editID > 0 && this.type != 1) {
        // 編輯 + 個人食材
        this.food = this.editRecord
      } else if (!this.editID && this.type > 0 && this.id > 0) {
        // 需要带入食材资料
        let url
        if (this.type == 1) {
          // 厨房食材
          url = `${config.api}/api/food/${this.id}`
        } else if (this.type == 2) {
          // 自定食材
          url = `${config.api}/api/profile_food/${this.id}`
        } else if (this.type == 3) {
          // 历史食材
          url = `${config.api}/api/record/${this.id}`
        }

        const food = await uni.request({
          url: url
        })

        this.food = food[1].data
      }

      this.food.protein = parseInt(this.food.protein)
      this.food.carbs = parseInt(this.food.carbs)
      this.food.fat = parseInt(this.food.fat)
      this.food.kcal = parseInt(this.food.kcal)
      this.food.kj = this.food.kcal * 4.1868
      this.food.kj = this.food.kj.toFixed(0)
      if (isNaN(this.food.kj)) {
        this.food.kj = null
      }

      if (this.food && this.food.icon) {
        this.food.icon = config.api + '/' + this.food.icon.replace('public', 'storage')
      }

      uni.hideLoading()
    },
    methods: {
      timeChange(e) {
        const time = e.value
        const hour = parseInt(time / 2)
        const minute = time % 2 ? '30' : '00'

        this.hour = hour
        this.minute = minute
      },

      eatDone() {
        uni.navigateBack({
          delta: 99,
          success() {
            uni.navigateTo({
              url: '/pages/detail/detail'
            })
          }
        })
      },

      eatContinue() {
        uni.navigateBack({

        })
      },

      formSubmit(e) {
        const datas = e.detail.value
        let type1 = 0

        // 来源 id
        e.detail.value.from_id = this.id
        e.detail.value.type = this.type

        if (this.type == 1) {
          // 来源是厨房，填入食材基本资料 (不从表单)
          e.detail.value.name = this.food.name
          e.detail.value.protein = this.food.protein
          e.detail.value.carbs = this.food.carbs
          e.detail.value.fat = this.food.fat
          e.detail.value.kcal = this.food.kcal

          type1 = this.food.type1
        }

        datas.profile_id = getApp().globalData.profile.id
        datas.editID = this.editID
        datas.hour = this.hour
        datas.minute = this.minute

        for (const key in datas) {
          if (datas[key] === '' && key !== 'record') {
            uni.showModal({
              title: '请完善所有信息',
              showCancel: false
            })

            return false
          }
        }
        this.submiting = true
        uni.request({
          url: `${config.api}/api/record/`,
          data: datas,
          method: 'POST',
          success: (res) => {
            // 增加最近吃的 storage
            const id = (type1 == 1) ? this.id : res.data.id
            const eat = {
              'name': datas.name,
              'type1': type1,
              'id': id,
            }
            let recents = uni.getStorageSync('recents')
            if (!recents) recents = []
            recents = recents.filter(v => v.name !== eat.name)
            recents.push(eat)
            recents = recents.slice(Math.max(recents.length - 20, 0))
            uni.setStorageSync('recents', recents)

            this.submiting = false
            this.$refs.popup.open()
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .container {
    background-color: #F2F7F7;
    min-height: 100vh;
  }

  /*** 手动输入 ***/
  .quick {
    .quick-title {
      height: 60upx;
      font-size: 24upx;
      font-weight: 500;
      color: $chi-gray;
      line-height: 60upx;
      text-align: center;
      background-color: $chi-extragray;
    }

    .quick-50 {
      height: 180upx;
      display: flex;

      .group {
        flex: 1;
        height: 100%;
        background-color: #FFFFFF;

        &:first-child {
          border-right: 1upx solid $chi-extragray;
        }

        .title {
          text-align: center;
          font-size: 28upx;
          font-weight: 500;
          color: $chi-gray;
          margin: 30upx 0;
        }

        .value {
          font-size: 36upx;
          text-align: center;
          color: $chi-gray;
        }
      }
    }

    .quick-33 {
      height: 180upx;
      display: flex;

      .placeholder {
        color: $chi-lightgray;
      }

      .group {
        flex: 1;
        height: 180upx;
        display: flex;
        flex-direction: column;

        .title {
          text-align: center;
          font-size: 28upx;
          font-weight: 400;
          flex: 1;
          margin-top: 30upx;
        }

        .value {
          flex: 1;
          font-size: 68upx;
          text-align: center;
          margin-bottom: 30upx;
        }
      }

      .protein {
        .title {
          color: $chi-protein;
        }

        .placeholder {
          color: $chi-protein-holder;
        }

        color: $chi-protein;
        background-color: $chi-protein-light;
      }

      .carbs {
        .title {
          color: $chi-carbs;
        }

        .placeholder {
          color: $chi-carbs-holder;
        }

        color: $chi-carbs;
        background-color: $chi-carbs-light;
      }

      .fat {
        .title {
          color: $chi-fat;
        }

        .placeholder {
          color: $chi-fat-holder;
        }

        color: $chi-fat;
        background-color: $chi-fat-light;
      }
    }
  }

  .exist {
    .title-bar {
      display: flex;
      color: #B7C4C7;
      background-color: #FFFFFF;
      height: 80upx;
      font-size: 20upx;

      >view {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .title-type {
        width: 120upx;
      }

      .title-name {
        width: 270upx;
      }

      .title-protein,
      .title-carbs,
      .title-fat {
        width: 80upx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-center;

        >view {
          flex: 1;
        }
      }

      .title-kcal {
        width: 120upx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-center;

        >view {
          flex: 1;
        }
      }
    }

    .value-bar {
      display: flex;
      color: #6F7C87;
      background-color: #FFFFFF;
      height: 120upx;
      font-size: 28upx;
      border-bottom: 2upx solid $chi-extragray;

      >view {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .value-icon {
        width: 120upx;

        image {
          width: 48upx;
          height: 48upx;
        }
      }

      .value-name {
        width: 270upx;
      }

      .value-protein,
      .value-carbs,
      .value-fat {
        width: 80upx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-center;
        font-size: 44upx;

        >view {
          flex: 1;
        }
      }

      .value-protein {
        color: $chi-protein;
      }

      .value-carbs {
        color: $chi-carbs;
      }

      .value-fat {
        color: $chi-fat;
      }

      .value-kcal {
        width: 120upx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-center;
        font-size: 44upx;

        >view {
          flex: 1;
        }
      }
    }

  }

  .record-100 {
    height: 180upx;
    display: flex;
    background-color: #FFFFFF;
    flex-direction: column;
    border-bottom: 2upx solid $chi-extragray;

    .placeholder {
      color: $chi-lightgray;
    }

    .title {
      text-align: center;
      font-size: 28upx;
      font-weight: 500;
      color: $chi-gray;
      flex: 1;
      margin-top: 30upx;
    }

    .value {
      flex: 1;
      font-size: 36upx;
      text-align: center;
      color: $chi-gray;
      margin-bottom: 30upx;
    }
  }

  .display-time {
    font-size: 36upx;
    text-align: center;
    color: $chi-lightgray;
    background-color: #FFFFFF;
    padding-bottom: 40upx;
    margin-bottom: 160upx;

    text {
      color: $chi-gray;
    }
  }

  .record-save-bar {
    position: absolute;
    bottom: 0;
    height: 120upx;
    background-color: #fff;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30upx;
    box-sizing: border-box;

    .record-save-button {
      width: 200upx;
      height: 80upx;
      line-height: 80upx;
      border-radius: 40upx;
      margin-right: 0;
      color: $chi-gray;
    }

    .record-save-label {
      font-size: 28rpx;
      font-weight: 400;
      color: $chi-gray !important;
    }
  }

  .popup-done {
    width: 66vw;
    color: $chi-gray;
    border-radius: 50upx;
    border: 2upx solid $chi-gray;
  }

  .popup-continue {
    width: 66vw;
    border-radius: 50upx;
  }
</style>
