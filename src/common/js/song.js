import {
  ERR_OK
} from 'api/config'
import {
  getLyric
} from 'api/song'
import {
  Base64
} from 'js-base64'
export default class Song {
  constructor({
    id,
    mid,
    singer,
    name,
    album,
    duration,
    image,
    url,
    albummid,
    albumid,
    albumdesc
  }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
    this.albummid = albummid
    this.albumid = albumid
    this.albumdesc = albumdesc
  }
//   每首歌的歌词
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

export function createSong(data) {
  return new Song({
    id: data.songid,
    mid: data.songmid,
    singer: data.singer,
    name: data.songname,
    album: data.albumname,
    albummid: data.albummid,
    albumid: data.albumid,
    albumdesc: data.albumdesc,
    duration: data.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${data.songid}.m4a?fromtag=46`
  })
}
// 因为每个歌手应当能链接，所以不需要合并成一个字符串了，这个方法没用了
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
