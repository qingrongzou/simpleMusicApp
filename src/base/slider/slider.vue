<template>
  <!--轮播组件-->
  <div class="slider" ref="slider">
    <!--轮播内容-->
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <!--轮播导航圆点-->
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="item" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  // 在父组件使用此组件时会传入这些参数
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 自动轮播的时间间隔
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted() {
    // 为保证dom的成功渲染需要加个延时。浏览器一般17毫秒刷新一次
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    // 当窗口改变时再次初始化轮播宽度
    window.addEventListener('resize', () => {
      // slider未初始化时直接return
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    // 初始化轮播宽度
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children
      // sliderGroup宽度
      let sliderGroupWidth = 0
      // slider宽度
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        sliderGroupWidth += sliderWidth
      }
      // 循环轮播需要多加两个可视宽度
      if (this.loop && !isResize) {
        sliderGroupWidth += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = sliderGroupWidth + 'px'
    },
    // 初始化dots
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    _initSlider() {
      // 初始化轮播参数
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          // 是否可以无缝循环轮播
          loop: this.loop,
          // 用手指滑动页面时可切换的阀值
          threshold: 0.3,
          // 轮播图切换的动画时间
          speed: 400
        }
      })
      // 每一张轮播结束时调动的函数
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        // console.log('当前index' + pageIndex)
        this.currentPageIndex = pageIndex
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    // 自动轮播
    _play() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  },
  // 在组件销毁时清除定时器
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    position: relative
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
