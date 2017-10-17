import jsonp from 'common/js/jsonp'
import {
  commonParams,
  options
} from './config'
import axios from 'axios'

export function getDiscsTag() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg';
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    loginUin: 0,
    needNewCode: 0,
  });
  return jsonp(url, data, options);
}
export function getDiscsList(params) {
  const url = '/api/getDiscsList'
  const data = Object.assign({}, commonParams, {
    rnd: Math.random(),
    platform: 'yqq',
    categoryId: params.categoryId,
    sortId: params.sortId,
    sin: (params.page - 1) * 30,
    ein: params.page * 30 - 1,
    hostUin: 0,
    loginUin: 0,
    needNewCode: 0,
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
