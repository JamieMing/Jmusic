import jsonp from 'common/js/jsonp'
import {
  commonParams,
  options
} from './config'
import axios from 'axios'

export function getAlbumList(params) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/album_library';
    const data = Object.assign({}, commonParams, {
      ...params,
      pagesize: 20,
      platform:'yqq',
      hostUin: 0,
      loginUin: 0,
      needNewCode: 0,
    });
    return jsonp(url, data, options);
  }
export function getAlbumInfo(albummid){
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg'
  const data = Object.assign({}, commonParams, {
    albummid,
    hostUin: 0,
    loginUin: 0,
    platform: 'yqq',
    needNewCode: 0,
  })
  return jsonp(url, data, options)
}