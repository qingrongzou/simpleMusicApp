<template>
  <transition name="slide">
    <div class="singer-detail">
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {ERR_OK} from 'api/config'
import {getSingerDetail} from 'api/singer'
import {mapGetters} from 'vuex' // mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：
export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getDetail()
    console.log(this.singer)
  },
  methods: {
    _getDetail () {
      // 在详细页面直接刷新会取不到数据，因为store提交mutation是在singer.vue,所以在这里判断
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.list)
        }
      })
    },
    _normalizeSongs(list) {
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background $color-background

  .slide-enter-active,.slide-leave-active
    transition: all 0.3s
  .slide-enter,.slide-leave-to
    transform: translate3d(100%,0,0)

</style>
