import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getHotDiss(){
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_first_yqq.fcg';
    const data = Object.assign({}, commonParams, {
      platform: 'yqq',
      uin: 0,
      needNewCode: 0,
      tpl: 'v12',
      page:'other'
    });
    return jsonp(url, data, options);
}