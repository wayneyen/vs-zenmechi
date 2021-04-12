<template>
  <view class="container">
    <view class="button-bar" :animation="buttonAnimation">
      <button id="search" class="d-center btn-white" hover-class="active" @click="searchFood">
        <image src="/static/search.png" mode="aspectFit" />
        搜索食物
      </button>
      <button id="quick" class="d-center btn-green" hover-class="active" @click="goQuick">
        <image src="/static/quick.png" mode="aspectFit" />
        手动记录
      </button>
    </view>

    <!-- 搜寻文字框 -->
    <view :animation="searchAnimation" class="search-bar">
      <input type="text" id="search-text" v-model="keyword" :focus="searching" clearable placeholder="请输入你要搜索的关键词" />
      <view class="search-close d-center" @click="closeSearchFood">
        <image src="/static/close.png" mode="aspectFit" />
      </view>
    </view>

    <view v-if="!searching">
      <view class="recent-title">最近吃的</view>
      <view class="recent">
        <button size="mini" class="btn-recent" v-for="(recent, index) in recents" :key="recent.id" @click="recentClick(index)">
          <view>
            <image v-if="recent.type1 > 0" :src="`/static/type${recent.type1}.png`" mode=""></image>
            {{ recent.name }}
          </view>
        </button>
      </view>
    </view>

    <view v-if="searching && keyword == ''">
      <view class="recent-search-title">最近搜索</view>
      <uni-list :border="false">
        <uni-list-item v-for="(name, index) in recentSearches" :key="name" :title="name" link @click="recentSearchClick(index)"></uni-list-item>
      </uni-list>
    </view>

    <uni-list v-if="searching && keyword != ''" :border="false">
      <uni-list-item v-for="(food, index) in searchResult" :key="food.id" :title="food.name" link @click="searchClick(index)"
        :thumb="food.type == 1 ? `/static/type${food.type1}.png` : ''" thumb-size="sm"></uni-list-item>
    </uni-list>
  </view>
</template>

<script>
  import config from '@/common/config.js'
  import string from '@/common/string.js'

  export default {
    data() {
      return {
        keyword: '',  // 搜索關鍵字
        searching: false, // 是否正在搜寻
        searchAnimation: {}, // 搜寻框动画
        buttonAnimation: {}, // 按钮动画,
        searchResult: [], // 搜索結果
        recents: null, // 最近吃的
        recentSearches: null, // 最近搜索,
        hour: '00', // 預設小時
        minute: '00' // 預設分鐘
      }
    },
    
    watch: {
      keyword(newVal, oldVal) {
        this.searchResult = []

        if (this.keyword.length > 0) {
          this.searchResult = []
          uni.request({
            url: `${config.api}/api/food/search`,
            data: {
              profile_id: getApp().globalData.profile.id,
              keyword: this.keyword
            },
            method: 'POST',
            success: (result) => {
              this.searchResult = result.data
            }
          })
        }
      }
    },
    
    onLoad(options) {
      // 吃的時間
      if (options.hour && this.minute) {
        this.hour = options.hour
        this.minute = options.minute
      } else {
        const d = new Date()
        this.hour = d.getHours()
        this.minute = d.getMinutes() <= 30 ? '00' : '30'
      }
    },

    onShow() {
      // 最近吃的
      let recents = uni.getStorageSync('recents')
      if (!recents) recents = []
      this.recents = recents.reverse()

      // 最近搜索
      let recentSearches = uni.getStorageSync('recentSearches')
      if (!recentSearches) recentSearches = []
      this.recentSearches = recentSearches.reverse()
    },

    methods: {
      // 開始搜索食材
      searchFood() {
        this.keyword = ''
        this.searching = true // 进入搜寻状态

        // 按钮收起
        var buttonAnimation = uni.createAnimation({
          duration: 300,
          timingFunction: 'ease'
        })
        buttonAnimation.width(0).step()
        this.buttonAnimation = buttonAnimation.export()

        // 展开搜寻框
        var searchAnimation = uni.createAnimation({
          duration: 300,
          timingFunction: 'ease'
        })
        searchAnimation.width('100%').step()
        this.searchAnimation = searchAnimation.export()
      },
      
      // 結束搜索食材
      closeSearchFood() {
        this.searching = false
        this.searchResult = []

        // 搜索框收起
        var searchAnimation = uni.createAnimation({
          duration: 300,
          timingFunction: 'ease'
        })
        searchAnimation.width(0).step()
        this.searchAnimation = searchAnimation.export()

        // 展开按钮
        var buttonAnimation = uni.createAnimation({
          duration: 300,
          timingFunction: 'ease'
        })
        buttonAnimation.width('100%').step()
        this.buttonAnimation = buttonAnimation.export()
      },
      
      // 手動輸入
      goQuick() {
        uni.navigateTo({
          url: `/pages/record/record?type=0&id=0&hour=${this.hour}&minute=${this.minute}`
        })
      },
      
      // 最近吃的
      recentClick(index, e) {
        const recent = this.recents[index]
        const type = recent.type1 > 0 ? 1 : 3
        uni.navigateTo({
          url: `/pages/record/record?type=${type}&id=${recent.id}&hour=${this.hour}&minute=${this.minute}`
        })
      },
      
      // 搜索結果選擇
      searchClick(index, e) {
        let recentSearches = uni.getStorageSync('recentSearches')
        if (!recentSearches) recentSearches = []
        recentSearches = recentSearches.filter(v => v !== this.keyword)
        recentSearches.push(this.keyword)
        recentSearches = recentSearches.slice(Math.max(recentSearches.length - 20, 0))
        uni.setStorageSync('recentSearches', recentSearches)

        const search = this.searchResult[index]
        uni.navigateTo({
          url: `/pages/record/record?type=${search.type}&id=${search.id}&hour=${this.hour}&minute=${this.minute}`
        })
      },
      
      // 最近搜索，填入關鍵字
      recentSearchClick(index, e) {
        this.keyword = this.recentSearches[index]
      }
    }
  }
</script>

<style lang="scss">
  .container {
    background-color: #F2F7F7;
    min-height: 100vh;
  }

  .button-bar {
    display: flex;
    width: 750upx;
    height: 120upx;
    overflow: hidden;

    button {
      font-size: 36upx;
      flex: 1;

      image {
        width: 40upx;
        height: 40upx;
        margin-right: 20upx;
      }
    }
  }

  .search-bar {
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 120upx;
    display: flex;
    background-color: #FFFFFF;
    border-bottom: 1px solid #E4E3E6;
    z-index: 500;

    #search-text {
      padding-left: 34upx;
      padding-right: 34upx;
      height: 120upx;
      font-size: 36upx;
      background-color: #FFFFFF;
      flex: 1;
    }

    .search-close {
      width: 120upx;

      image {
        width: 60upx;
        height: 60upx;
      }
    }
  }

  .recent-title {
    height: 80upx;
    line-height: 80upx;
    color: $chi-gray;
    font-size: 24upx;
    padding-left: 30upx;
    font-weight: 500;
  }

  .recent {
    padding: 0 30upx;

    button {
      view {
        display: flex;
        justify-content: center;
        align-items: center;

        image {
          width: 24upx;
          height: 24upx;
          margin-right: 4upx;
        }
      }
    }
  }

  .recent-food {
    width: auto;
    height: 60upx;
    line-height: 60upx;
    background-color: #fff;
    border-radius: 35upx;
    color: #6f7c87;
    font-size: 28upx;
    padding: 0 20upx;
    margin-bottom: 20upx;
    margin-right: 20upx;
  }

  .btn-recent {
    margin-right: 20upx;
    margin-bottom: 10upx;
    border-radius: 35px;
    background-color: #FFFFFF;
  }

  .btn-recent:after {
    border: none;
  }

  .recent-search-title {
    background-color: $chi-extragray;
    color: $chi-gray;
    padding: 24upx 30upx;
    font-size: 24upx;
  }
</style>
