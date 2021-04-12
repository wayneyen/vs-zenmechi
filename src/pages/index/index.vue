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
      <block v-for="(item, index) in mealsDesc[meals_count]" :key="index">
        <view class="td">
          <view class="d-center td-meal">{{ item }}</view>
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
              <view style="font-size: 68rpx">28</view>
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
              <view style="font-size: 68rpx">28</view>
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
              <view style="font-size: 68rpx">28</view>
            </view>
          </view>
          <view class="d-center td-unit td-kcal" v-show="!hideKcalCircle">
            {{ kcalPercent[index] }}+
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
              :style="{ height: proteinHeight }"
              :animation="proteinBarAnimation"
            ></view>
          </view>
          <!-- <view class="bar-overflow d-center">16g+</view> -->
        </view>
        <view class="d-center td-unit">
          <view class="bar bar-carbs">
            <view
              class="bar-value"
              :style="{ height: carbsHeight }"
              :animation="carbsBarAnimation"
            ></view>
          </view>
        </view>
        <view class="d-center td-unit">
          <view class="bar bar-fat">
            <view
              class="bar-value"
              :style="{ height: fatHeight }"
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
    <uni-popup ref="popup" type="center">
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
      recordTotal: 0,
      target: getApp().globalData.profile
        ? getApp().globalData.profile.target
        : 0,
      topModalShow: false,
      meals_count: 3,
      mealsCountItems: config.mealsCountItems,
      mealsDesc: config.mealsDesc,
      mealsCountChanged: false, // 餐数是否已改变
      profile: null,

      currentIdx: -1, // 选中的格子
      currentType: "", // 选中的格子

      // 柱动画
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
  },
  watch: {
    meals_count() {
      this.mealsCountChanged = true
      this.mealsCountChangedTo = this.meals_count
    },
  },
  async onLoad(options) {
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

      uni.setStorageSync("openid", profile[1].data.openid)
      getApp().globalData.openid = profile[1].data.openid
      getApp().globalData.profile = profile[1].data.profile
    }

    this.getRecordTotal()

    this.profile = getApp().globalData.profile
    this.meals_count = getApp().globalData.profile.meals_count

    console.log(this.profile)

    uni.hideLoading()

    if (options.first == 1) {
      this.$refs.popup.open()
    }
  },

  onShow() {
    this.getRecordTotal()

    // 三柱動畫
    var animation = uni.createAnimation({
      duration: 10000,
      timingFunction: "ease",
      delay: 100,
    })

    animation.height("100%").step()
    this.proteinBarAnimation = animation.export()

    animation.height("35%").step()
    this.carbsBarAnimation = animation.export()

    animation.height("65%").step()
    this.fatBarAnimation = animation.export()
  },

  methods: {
    getRecordTotal() {
      if (!getApp().globalData.profile) return 0

      const today = new Date().toJSON().slice(0, 10)

      uni.request({
        url: `${config.api}/api/record/total`,
        data: {
          profile_id: getApp().globalData.profile.id,
          date: today,
        },
        method: "POST",
        success: (res) => {
          // console.log(res)
          this.recordTotal = res.data
        },
      })
    },
    beginEat() {
      uni.navigateTo({
        url: "/pages/begin/begin",
      })
    },
    goDetail() {
      uni.navigateTo({
        url: "/pages/detail/detail",
      })
    },
    closeFirst() {
      this.$refs.popup.close()
    },
    closeTopModal(e) {
      this.topModalShow = false

      // 用餐數變更
      if (this.mealsCountChanged) {
        // 更新用户数据
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

        this.alertMealsCount = true
        this.mealsCountChanged = false
        this.$refs.popup.open()
      }
    },
    // 设置餐数
    selectMealsCount(e) {
      getApp().globalData.profile.meals_count = e.active
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
