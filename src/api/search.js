import jsonp from '../common/js/jsonp.js'
import {
  commonParams,
  options
} from './config'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })
  return jsonp(url, data, options)
}

export function getSmartKey(key) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg'
  const data = Object.assign({}, commonParams, {
    key,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    is_xml: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}
