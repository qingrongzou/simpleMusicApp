<!--类通讯录组件-->
<template>
  <scroll class="listview"
          :data="data" ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
  >
    <!--列表-->
    <ul>
      <li v-for="(group, groupIndex) in data" :key="groupIndex" class="list-group" ref="listgroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="(item, itemIndex) in group.items" :key="itemIndex" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar"/>
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--列表-->
    <!--右侧快速入口-->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <!--自定义属性：直接v-bind:自定义属性名-->
        <li
          v-for="(item, index) in shortcutList"
          :key="index"
          class="item"
          :class="{'current':currentIndex===index}"
          :data-index="index">
          {{ item }}
        </li>
      </ul>
    </div>
    <!--快速入口-->
    <!--固定title-->
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <!--固定title-->
    <div v-show="!data.length" class="loading-container">
      <loading>
      </loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
import Loading from 'base/loading/loading'
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  created () {
    // 不放在data而放在created里面的原因是因为vue会默认给data里面添加getter和setter，观测其变化，此时我们并不想关注touch
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3 // 快速滚动使也可以监听scrollY
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1 // 当前区块的下限与容器顶部的差
    }
  },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  // 放在计算属性里面可以直接在标签中使用返回结果，不需调用
  computed: {
    // 获取快速入口列表数组
    shortcutList() {
      // map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值,不会改变原数组
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    // 固定title的值
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    // 告诉父组件我被点击了和点击的是什么元素
    selectItem (item) {
      this.$emit('select', item)
    },
    // 点击开始时跳转到对应页
    onShortcutTouchStart(event) {
      // 触摸开始点的下标
      let anchorIndex = getData(event.target, 'index')
      // 不是第一个触摸位置，而是当有多个手指触摸时，取第一个触摸的手指所触摸的touchlist
      let firstTouch = event.touches[0]
      // console.log(firstTouch) // touchstart事件里只有一个touchlist对象
      // 触点相对于HTML文档上边沿的的Y坐标. 和 clientY 属性不同, 这个值是相对于整个html文档的坐标, 和用户滚动位置无关. 因此当存在垂直滚动的偏移时, 这个值包含了垂直滚动的偏移.
      this.touch.y1 = firstTouch.pageY
      // 记录下触摸开始点的下标
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // console.log(firstTouch) // touchmove事件里有多个touchlist对象
      // 移动的距离
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    // 由scroll子组件$emit传来的事件，实时获得pos的值
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 跳转方法
    _scrollTo(index) {
      // console.log(index)
      // 点击时点击边界的处理
      if (!index && index !== 0) {
        return
      }
      // 拖动时拖到边界的处理
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      // 点击时使scrollY变化
      this.scrollY = -this.listHeight[index]
      // 参数0的意思是点击没有动画，直接跳转
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
    },
    // 计算data里面每个group的叠加的高度[0,height1,height1+height2,···]
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listgroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
      // console.log(this.listHeight)
    }
  },
  watch: {
    // 当data变化时，延时计算高度（延时是因为数据变化到dom变化有延时）
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    // 监听scrollY的变化
    scrollY (newY) {
      const listHeight = this.listHeight
      // console.log(newY)
      // 当滚动到顶部，newY大于0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          // console.log(this.diff)
          // console.log(this.currentIndex)
          return
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      }
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      // 减少dom操作
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
