import jsonp from 'common/js/jsonp'
import {
  commonParams,
  options
} from './config'
import axios from 'axios'

export function getSingers(key,pagenum) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page:'list',
    key, //查询的关键字
    pagesize: 100,
    platform:'yqq',
    uin: 0,
    needNewCode: 1,
    pagenum //页码
  });
  return jsonp(url, data, options);
}
export function getSingerByMid(mid, begin, num){
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    const data = Object.assign({}, commonParams, {
        loginUin: 0,
        hostUin:0,
        order: 'listen',
        begin,
        singermid: mid,
        songstatus:1,
        num,
        platform:'yqq',
        uin: 0,
        needNewCode: 0,  
      });
      return jsonp(url, data, options);
}

export function getSingerDesc(mid){
    const url = '/api/getSingerDesc'
    return axios.get(url, {
        params: {
            singermid: mid,
            utf8: 1,
            outCharset: 'utf-8',
            format: 'xml',
            r: new Date().getTime()
        }
    }).then((response)=>{
        return Promise.resolve(response)
    })
}