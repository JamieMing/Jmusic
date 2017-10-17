import jsonp from 'common/js/jsonp'
import {
  commonParams,
  options
} from './config'
import axios from 'axios'

export function getSongInfo(mid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    tpl: 'yqq_song_detail',
    platform: 'yqq',
    needNewCode: 0,
    loginUin: 0,
    hostUin: 0
  });

  return jsonp(url, data, {
    param: 'callback',
    prefix: 'jm'
  });
}

export function getLyric(mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 67232076,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}