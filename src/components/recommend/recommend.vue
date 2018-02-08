<template>
  <!--热门推荐-->
  <div class="recommend">
    <!--将data传给scroll组件-->
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <!--为了使用better-scroll的上下滚动-->
      <div>
        <!--轮播-->
        <div v-if="recommends.length" class="slide-wraper">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl"/>
              </a>
            </div>
          </slider>
        </div>
        <!--轮播-->
        <!--推荐列表-->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" :key="item.dissid" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl"/>
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
        <!--推荐列表-->
      </div>
      <!--为了使用better-scroll的上下滚动-->
      <div class="loading-container" v-show="!discList.length">
        <loading>
        </loading>
      </div>
    </scroll>
  </div>
  <!--热门推荐-->
</template>

<script type="text/ecmascript-6">
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import {getRecommend, getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'

export default {
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  created () {
    this._getRecommend()
    // 模拟加载缓慢的情况
    // setTimeout(() => {
    //   this._getDiscList()
    // }, 1000)
    this._getDiscList()
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  methods: {
    // 获取歌单列表
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    // 获取热门推荐数据
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    // 因为是异步渲染，不能确定是轮播先渲染还是歌单先渲染，而监听data刷新是监听的歌单数据，最好在轮播图片加载出来之后再refresh一次（因为轮播是由图片撑开的）
    loadImage () {
      // 使用标志位确保此方法只执行一次（只要加载出一张图片刷新高度就行，多次刷新资源浪费）
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
