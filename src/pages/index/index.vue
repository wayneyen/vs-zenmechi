<template>
  <view class="container">
    <!-- 標頭 -->
    <view class="thead">
      <view class="d-center th th-meal">
        <view class="meals d-center" @click="topModalShow = !topModalShow">
          <image src="/static/r-arrow.png" class="meals-icon"></image>
          餐数
        </view>
      </view>
      <view class="d-center th th-unit">
        蛋白
        <view>(g)</view>
      </view>
      <view class="d-center th th-unit">
        碳水
        <view>(g)</view>
      </view>
      <view class="d-center th th-unit">
        脂肪
        <view>(g)</view>
      </view>
      <view class="d-center th th-unit">
        热量
        <view>(Kcal)</view>
      </view>
    </view>

    <!-- 圖表 -->
    <view class="tbody">
      <!-- 重量 (格子) -->
      <block v-for="(item, index) in nutritionTable" :key="index">
        <view class="td">
          <view class="d-center td-meal">{{ item.title }}</view>
          <view
            class="d-center td-unit"
            :data-type="'protein'"
            :data-idx="index"
            @click="clickTd"
          >
            <view
              class="protein-block"
              v-show="currentType === 'protein' && currentIdx === index"
            >
              <view style="font-size: 24rpx">重量-g</view>
              <view style="font-size: 68rpx">{{ item.eat.proteinG }}</view>
            </view>
          </view>

          <view
            class="d-center td-unit"
            :data-type="'carbs'"
            :data-idx="index"
            @click="clickTd"
          >
            <view
              class="carbs-block"
              v-show="currentType === 'carbs' && currentIdx === index"
            >
              <view style="font-size: 24rpx">重量-g</view>
              <view style="font-size: 68rpx">{{ item.eat.carbsG }}</view>
            </view>
          </view>
          <view
            class="d-center td-unit"
            :data-type="'fat'"
            :data-idx="index"
            @click="clickTd"
          >
            <view
              class="fat-block"
              v-show="currentType === 'fat' && currentIdx === index"
            >
              <view style="font-size: 24rpx">重量-g</view>
              <view style="font-size: 68rpx">{{ item.eat.fatG }}</view>
            </view>
          </view>
          <view class="d-center td-unit td-kcal" v-show="!hideKcalCircle">
            {{ Math.abs(Math.round(item.eat.kcal - item.target.kcal)) }}
            <text v-if="item.eat.kcal >= item.target.kcal">+</text>
            <text v-else>-</text>
            <view class="td-circle d-center">
              <!-- <canvas type="2d" style="width: 100rpx; height: 100rpx;" canvas-id="kcal{{ index }}"></canvas> -->
            </view>
          </view>
        </view>
      </block>

      <!-- 进度条 -->
      <view class="td-process">
        <view class="d-center td-meal"></view>
        <view class="d-center td-unit">
          <view class="bar bar-protein">
            <view
              class="bar-value"
              :style="{ height: 0 }"
              :animation="proteinBarAnimation"
            ></view>
          </view>
          <!-- <view class="bar-overflow d-center">16g+</view> -->
        </view>
        <view class="d-center td-unit">
          <view class="bar bar-carbs">
            <view
              class="bar-value"
              :style="{ height: 0 }"
              :animation="carbsBarAnimation"
            ></view>
          </view>
        </view>
        <view class="d-center td-unit">
          <view class="bar bar-fat">
            <view
              class="bar-value"
              :style="{ height: 0 }"
              :animation="fatBarAnimation"
            ></view>
          </view>
        </view>
        <view class="d-center td-unit"></view>
      </view>
    </view>

    <!-- 標尾 -->
    <view class="tfoot">
      <view class="record d-center" @click="goDetail">
        <view class="record-total">
          <view>{{ recordTotal }}</view>
        </view>

        今天记录
      </view>
      <view
        class="d-center btn-green start"
        hover-class="active"
        @click="beginEat"
      >
        <image src="/static/tabbar/eat.png" mode="aspectFill"></image>
        开吃
      </view>
    </view>

    <!-- 第一次进入 (中間跳出) -->
    <uni-popup ref="popup" type="center" style="z-index: 3000;">
      <view class="first">
        <image
          src="/static/modal/tips.png"
          mode="aspectFill"
          class="tips"
        ></image>
        <image
          src="/static/modal/close.png"
          mode="aspectFill"
          class="close"
          @click="closeFirst"
        ></image>
        <view class="title">已保存</view>
        <view class="text">你的目标是{{ targetDesc }}</view>
        <view class="text2"> 建议每日摄入 {{ firstTip }} Kcal 热量 </view>
      </view>
    </uni-popup>

    <!-- 餐数选择 (上方跳出) -->
    <view v-if="topModalShow" class="modal">
      <view class="modal-mask" @click="closeTopModal"></view>
      <view class="meals-modal-content">
        <view class="meals-content">
          <radio-box
            :items="mealsCountItems"
            :active="meals_count"
            @select="selectMealsCount"
            :theme="1"
            :width="'360rpx'"
            :height="'80rpx'"
            :color1="'#ffffff'"
            :bg="'#6F7C87'"
            :acolor="'#6F7C87'"
            :dcolor="'#ffffff'"
            :radius="'40rpx'"
            :inner-radius="'40rpx'"
            :margin="0"
          />
        </view>

        <view class="meals-desc">请根据工作/健身计划，安排今天吃多少餐</view>
        <view class="meals-desc">以达到更好的吸收和休息</view>

        <view class="meals-time">
          <image
            v-if="meals_count == 3"
            src="/static/3m.png"
            mode="widthFix"
            lazy-load="false"
          />
          <image
            v-if="meals_count == 4"
            src="/static/4m.png"
            mode="widthFix"
            lazy-load="false"
          />
          <image
            v-if="meals_count == 5"
            src="/static/5m.png"
            mode="widthFix"
            lazy-load="false"
          />
        </view>

        <view class="meals-close">
          <image
            @click="closeTopModal"
            class="image"
            src="/static/close.png"
            mode="scaleToFill"
          ></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import config from "@/common/config.js"
import number from "@/common/number.js"
import SwiperBox from "@/components/swiper-box.vue"
import RadioBox from "@/components/radio-box.vue"

export default {
  data() {
    return {
      records: [],
      target: getApp().globalData.profile
        ? getApp().globalData.profile.target
        : 0,
      topModalShow: false,
      meals_count: 3,
      mealsCountItems: config.mealsCountItems,
      mealsDesc: config.mealsDesc,
      profile: null,

      currentIdx: -1, // 选中的格子
      currentType: "", // 选中的格子

      // 柱动画
      animation: {},
      proteinBarAnimation: {},
      carbsBarAnimation: {},
      fatBarAnimation: {},
    }
  },
  components: {
    SwiperBox,
    RadioBox,
  },

  computed: {
    nutritionTable() {
      if (!this.profile) return []
      if (!this.records) return []

      const table = []

      // 每餐資料
      for (let i = 0; i < this.meals_count; i++) {
        const targetP = Number(this.profile.eat[this.meals_count][i]['protein'])
        const targetC = Number(this.profile.eat[this.meals_count][i]['carbs'])
        const targetF = Number(this.profile.eat[this.meals_count][i]['fat'])

        // 每餐吃的總和
        const eat = {
          proteinG: 0,
          carbsG: 0,
          fatG: 0,
          kcal: 0
        }
        this.records.forEach(record => {
          if (record.meals[this.meals_count] == i + 1) {
            eat.proteinG += Number(record.protein)
            eat.carbsG += Number(record.carbs)
            eat.fatG += Number(record.fat)
            eat.kcal += record.protein * 4 + record.carbs * 4 + record.fat * 9
          }
        })

        const tr = {
          // 標題
          title: this.profile.eat[this.meals_count][i]['title'],

          // 每餐目標
          target: {
            proteinG: targetP / 4,
            carbsG: targetC / 4,
            fatG: targetF / 9,
            kcal: targetP + targetC + targetF
          },

          // 每餐實際吃的
          eat: eat
        }

        table[i] = tr
      }

      // console.log(table)

      return table
    },
    nutritionTotal() {
      const table = {
        eat: {
          proteinG: 0,
          carbsG: 0,
          fatG: 0,
          kcal: 0
        },
        target: {
          proteinG: 0,
          carbsG: 0,
          fatG: 0,
          kcal: 0
        }
      }

      this.nutritionTable.forEach(tr => {
        table.eat.proteinG += Number(tr.eat.proteinG)
        table.eat.carbsG += Number(tr.eat.carbsG)
        table.eat.fatG += Number(tr.eat.fatG)
        table.eat.kcal += Number(tr.eat.kcal)

        table.target.proteinG += Number(tr.target.proteinG)
        table.target.carbsG += Number(tr.target.carbsG)
        table.target.fatG += Number(tr.target.fatG)
        table.target.kcal += Number(tr.target.kcal)
      })

      return table
    },
    targetDesc() {
      let targetDesc = ""
      if (this.target === 1) {
        targetDesc = "减脂"
      } else if (this.target === 2) {
        targetDesc = "保持现状"
      } else if (this.target === 3) {
        targetDesc = "增肌"
      }
      return targetDesc
    },
    firstTip() {
      if (this.profile) {
        return number.round(
          this.profile.nutrition.carbs +
            this.profile.nutrition.fat +
            this.profile.nutrition.protein
        )
      } else {
        return ""
      }
    },
    recordTotal() {
      return this.records.length
    }
  },

  watch: {
    profile() {
      // Profile 載入後才獲取紀錄
      this.getRecords()
    },
    records() {
      // 紀錄改變後跑三柱動畫
      if (this.nutritionTotal.eat.proteinG && this.nutritionTotal.target.proteinG) {
        let proteinHeight = this.nutritionTotal.eat.proteinG / this.nutritionTotal.target.proteinG * 100
        if (proteinHeight > 100)  proteinHeight = 100
        const animation = this.animation
        animation.height(proteinHeight + '%').step()
        this.proteinBarAnimation = animation.export()
      }

      if (this.nutritionTotal.eat.carbsG && this.nutritionTotal.target.carbsG) {
        let carbsHeight = this.nutritionTotal.eat.carbsG / this.nutritionTotal.target.carbsG * 100
        if (carbsHeight > 100)  carbsHeight = 100
        const animation = this.animation
        animation.height(carbsHeight + '%').step()
        this.carbsBarAnimation = animation.export()
      }

      if (this.nutritionTotal.eat.fatG && this.nutritionTotal.target.fatG) {
        let fatHeight = this.nutritionTotal.eat.fatG / this.nutritionTotal.target.fatG * 100
        if (fatHeight > 100)  fatHeight = 100
        const animation = this.animation
        animation.height(fatHeight + '%').step()
        this.fatBarAnimation = animation.export()
      }
    }
  },

  async onLoad(options) {
    uni.hideTabBar({})

    // 初始化柱動畫
    this.animation = uni.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 100,
    })

    /*** get openid ***/
    uni.showLoading({})
    const openid = uni.getStorageSync("openid")

    if (openid) {
      // openid 已经获取过，获取 profile
      getApp().globalData.openid = openid

      const profile = await uni.request({
        url: `${config.api}/api/profile/${getApp().globalData.openid}`,
      })

      getApp().globalData.profile = profile[1].data
    } else {
      // openid 未获取过，登入并获取 profile
      const login = await uni.login({
        provider: "weixin",
      })

      const profile = await uni.request({
        url: `${config.api}/api/openid/${login[1].code}`,
      })

      getApp().globalData.openid = profile[1].data.openid

      if (!profile[1].data.profile) {
        // 新用戶，引導至基本資料
        uni.navigateTo({
          url: '/pages/profile/profile'
        })

        return false
      }

      uni.setStorageSync("openid", profile[1].data.openid)
      getApp().globalData.profile = profile[1].data.profile
    }

    this.profile = getApp().globalData.profile
    this.meals_count = getApp().globalData.profile.meals_count

    uni.hideLoading()
    uni.showTabBar({
      animation: true
    })

    if (options.first == 1) {
      this.$refs.popup.open()
    }
  },

  onShow() {
    this.getRecords()
  },

  methods: {
    // 獲取當天資料
    getRecords() {
      if (!getApp().globalData.profile) return []

      const today = new Date().toJSON().slice(0, 10)

      uni.request({
        url: `${config.api}/api/record/detail`,
        data: {
          profile_id: getApp().globalData.profile.id,
          date: today
        },
        method: 'POST',
        success: (res) => {
          this.records = res.data
        }
      })

    },

    // 開吃
    beginEat() {
      uni.navigateTo({
        url: "/pages/begin/begin",
      })
    },

    // 前往詳細記錄
    goDetail() {
      uni.navigateTo({
        url: "/pages/detail/detail",
      })
    },

    // 關閉總熱量提示
    closeFirst() {
      this.$refs.popup.close()
    },

    // 關閉參數選擇視窗
    closeTopModal() {
      this.topModalShow = false

      if (this.meals_count !== getApp().globalData.profile.meals_count) {
        // 參數改變 更新用户数据
        wx.request({
          url: `${config.api}/api/profile/updateMealsCount`,
          data: {
            openid: getApp().globalData.openid,
            mealsCount: this.meals_count,
          },
          method: "POST",
          header: {
            "content-type": "application/json", // 默认值
          },
        })

        getApp().globalData.profile.meals_count = this.meals_count
        this.$refs.popup.open()
      }
    },

    // 设置餐数
    selectMealsCount(e) {
      this.meals_count = e.active
    },

    // 点选格子
    clickTd(e) {
      this.currentIdx = e.currentTarget.dataset.idx
      this.currentType = e.currentTarget.dataset.type
    },
  },
}
</script>

<style lang="scss">
.container {
  background-color: #fff;
  font-family: "Barlow Condensed", SimHei;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 左上打开餐数按钮 */
.meals {
  font-size: 24upx;
  color: #f5b2a6;
}
.meals-icon {
  margin-right: 10upx;
  width: 16upx;
  height: 8upx;
}

/*** 表头 ***/
.thead {
  background-color: #fff;
  display: flex;
}
.th {
  color: #b7c4c7;
  font-size: 24rpx;
  height: 120rpx;
  flex-direction: column;
}
.th-meal {
  width: 120rpx;
}
.th-unit {
  flex: 1;
}
/*** 表头 end ***/

/*** 表格 ***/
.tbody {
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  background-color: #fff;
  position: relative;
}
.td {
  flex: 1;
  display: flex;
  z-index: 200;
  justify-content: space-between;
}
.td-meal {
  width: 120rpx;
  color: #6f7c87;
  font-size: 24rpx;
  padding: 0 26rpx;
  box-sizing: border-box;
  text-align: center;
}
.td-unit {
  flex: 1;
  position: relative;
}
.td-kcal {
  position: relative;
  color: #f7518e;
  font-size: 24rpx;
}
.td-kcal .td-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.td-process {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 100;
  justify-content: space-between;
}
.td-process .td-unit {
  margin-top: 40rpx;
  margin-bottom: 20rpx;
}
.tbody .bar {
  height: 100%;
  width: 40rpx;
  border-radius: 80rpx;
  background-color: #e1f5f8;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.tbody .bar-value {
  width: 20rpx;
  margin: 12rpx 10rpx;
  border-radius: 80rpx;
  box-sizing: border-box;
}

.tbody .bar-protein {
  background-color: #e1f5f8;
}
.tbody .bar-carbs {
  background-color: #e8f5d2;
}
.tbody .bar-fat {
  background-color: #fff3d4;
}
.tbody .bar-protein .bar-value {
  background-color: #6acbda;
}
.tbody .bar-carbs .bar-value {
  background-color: #8dcd1e;
}
.tbody .bar-fat .bar-value {
  background-color: #ffc227;
}
.td-weight {
  width: 10rpx;
  height: 10rpx;
}

.protein-block {
  color: #ffffff;
  background-color: #6acbda;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 10rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.carbs-block {
  color: #ffffff;
  background-color: #8dcd1e;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 10rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.fat-block {
  color: #ffffff;
  background-color: #ffc227;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 10rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.bar-overflow {
  position: absolute;
  background-color: #ffd7e6;
  width: 136rpx;
  height: 40rpx;
  left: 0;
  top: -60rpx;
  box-sizing: border-box;
  margin: 0 10rpx;
  font-size: 24rpx;
  color: #f7518e;
  border-radius: 50rpx;
}
.bar-overflow:before {
  content: "";
  border-top: 20rpx solid #ffd7e6;
  border-right: 20rpx solid transparent;
  border-left: 20rpx solid transparent;
  border-bottom: 0;
  position: absolute;
  left: 50%;
  top: 50rpx;
  margin-top: -20rpx;
  margin-left: -20rpx;
}
/*** 表格 End ***/

/*** 表尾 ***/
.tfoot {
  height: 160upx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24upx;
  color: $chi-gray;
  background-color: #ffffff;

  .record {
    .record-total {
      margin-left: 30upx;
      margin-right: 10upx;
      width: 48upx;
      height: 48upx;
      position: relative;
      background-image: url("/static/record.png");
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
    }
  }

  .start {
    width: 240upx;
    height: 100upx;
    border-radius: 53upx;
    margin-right: 30upx;
    font-size: 36upx;
    font-weight: 400;

    image {
      width: 42upx;
      height: 42upx;
      margin-right: 26upx;
    }
  }
}
/*** 表尾 end ***/

.first {
  height: 200upx;
}

/* 参数选择 */
.meals-modal-content {
  width: 750upx;
  background: #ffffff;
  z-index: 6500;
  position: absolute;
  left: 0;
  top: 0;
}

/* 参数选择 - 单选 */
.meals-content {
  height: 140upx;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30upx;
  background-color: #ffffff;
}

/* 参数选择 - 说明 */
.meals-desc {
  color: #6f7c87;
  text-align: center;
}

/* 参数选择 - 时间 */
.meals-time {
  width: 692upx;
  margin: 30upx auto;
}
.meals-time image {
  width: 100%;
}

/* 参数选择 - 关闭 */
.meals-close {
  margin-top: 60upx;
  margin-bottom: 26upx;
  text-align: center;
}
.meals-close .image {
  width: 96upx;
  height: 96upx;
}
</style>
