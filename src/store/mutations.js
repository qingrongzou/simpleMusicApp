// 同步修改状态
// Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)
// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。
import * as types from './mutation-types'

const mutations = {
  // type : 回调函数
  // 第一个参数就是state状态，第二个参数是提交mutation时传的参数
  [types.SET_SINGER](state, singer) {
    // 将变化的singer写入state.singer中
    state.singer = singer
  }
}

export default mutations
