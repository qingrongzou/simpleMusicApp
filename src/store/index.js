import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 会检测state修改是否是通过提交mutation的方法
// 只在开发环境检测，线上环境不使用
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  // 此方法会在控制台打印修改日志
  plugins: debug ? [createLogger()] : []
})
