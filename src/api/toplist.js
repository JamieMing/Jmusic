import jsonp from 'common/js/jsonp'
import {
  commonParams,
  options
} from './config'
import axios from 'axios'

export function getToplist(topid, begin, num) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
  const data = Object.assign({}, commonParams, {
    topid: topid,
    platform: 'yqq',
    type: 'top',
    loginUin: 0,
    hostUin: 0,
    song_begin: begin,
    song_num: num,
    needNewCode: 0,
    tpl: '3',
    page: 'detail',
  });
  return jsonp(url, data, options);
}
export function getToplistCate() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_opt.fcg'
  const data = Object.assign({}, commonParams, {
    page: 'index',
    tpl: 'macv4',
    v8debug: 1,
    format: 'html'
  })

  return jsonp(url, data, {
    param: "jsonCallback",
    prefix: 'jm',
    name: 'jsonCallback'
  });
}
