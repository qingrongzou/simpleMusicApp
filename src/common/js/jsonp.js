import originJSONP from 'jsonp'

// 封装自己的jsonp方法，想让我们自己传的url没有参数
export default function jsonp(url, data, option) {
  // 将参数拼接到url后面
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    // originJSONP接收的url地址上有形如‘?ie=utf-8&f=8&rsv_bp=1’的参数
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
// 将data拼接成形如‘?ie=utf-8&f=8&rsv_bp=1’的参数
function param(data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
