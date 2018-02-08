<!--歌手界面-->
<template>
  <div class="singer">
    <list-view @select="selectedSinger" :data="singers">
    </list-view>
    <!--singer-detail组件-->
    <router-view>
    </router-view>
    <!--singer-detail组件-->
  </div>
</template>

<script type="text/ecmascript-6">
import ListView from 'base/listview/listview'
import Singer from 'common/js/singer'
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import {mapMutations} from 'vuex' // 提交 mutation使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    selectedSinger(singer) {
      // 不同歌手跳转到不同路由
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
          // console.log(this.singers)
        }
      })
    },
    // 将歌手列表整装成想要的数据结构
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        // 将前十个数据放hot列表下
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({id: item.Fsinger_mid, name: item.Fsinger_name}))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // console.log(map)
      // 将map对象处理成有序列表数组
      let hot = [] // 存放排序后的hot列表
      let ret = [] // 存放排序后的a-z列表
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
        ret.sort((a, b) => {
          // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
      }
      return hot.concat(ret)
    },
    ...mapMutations({
      // 相当于将this.setSinger()方法映射成 this.$store.commit('SET_SINGER')-----------SET_SINGER是mutations里面的方法
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
