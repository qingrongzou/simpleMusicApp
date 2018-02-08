// 使用jsonp抓取数据
import jsonp from 'common/js/jsonp'
import {commenParams, options} from './config'
import axios from 'axios'

// 获取热门推荐数据
export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  // 将commenParams和{ platform: 'h5',···}都克隆到data中
  const data = Object.assign({}, commenParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

// 获取歌单列表
export function getDiscList() {
  const url = '/api/getDiscList'
  const data = Object.assign({}, commenParams, {
    rnd: Math.random(),
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
