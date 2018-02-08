// 歌曲信息类
export default class Song {
  constructor({id, mid, singer, name, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.duration = duration
    this.image = image
    this.url = url
  }
}
