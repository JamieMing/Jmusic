import jsonp from 'common/js/jsonp'
import {
  commonParams,
  options
} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });
  return jsonp(url, data, options);
}
export function getRecommends() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_first_yqq.fcg';
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    uin: 0,
    needNewCode: 0,
    tpl: 'v12',
    page: 'other'
  });
  return jsonp(url, data, options);
}
export function getDiscList() {
  const url = 'api/getDiscList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
export function getSongList(disstid) {
  const url = '/api/getDiscSongList'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    loginUin: 0,
    needNewCode: 0,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res)=>{
    return Promise.resolve(res.data)
  })
}
var querydata = {
  "comm": {
    "ct": 24
  },
  "category": {
    "method": "get_hot_category",
    "param": {
      "qq": ""
    },
    "module": "music.web_category_svr"
  },
  "recomPlaylist": {
    "method": "get_hot_recommend",
    "param": {
      "async": 1,
      "cmd": 2
    },
    "module": "playlist.HotRecommendServer"
  },
  "playlist": {
    "method": "get_playlist_by_category",
    "param": {
      "id": 8,
      "curPage": 1,
      "size": 40,
      "order": 5,
      "titleid": 8
    },
    "module": "playlist.PlayListPlazaServer"
  },
  "new_song": {
    "module": "QQMusic.MusichallServer",
    "method": "GetNewSong",
    "param": {
      "type": 0
    }
  },
  "new_album": {
    "module": "QQMusic.MusichallServer",
    "method": "GetNewAlbum",
    "param": {
      "type": 0,
      "category": "-1",
      "genre": 0,
      "year": 1,
      "company": -1,
      "sort": 1,
      "start": 0,
      "end": 39
    }
  },
  "toplist": {
    "module": "music.web_toplist_svr",
    "method": "get_toplist_index",
    "param": {}
  },
  "focus": {
    "module": "QQMusic.MusichallServer",
    "method": "GetFocus",
    "param": {}
  }
}
// 可获得大量数据。。。qq音乐改版, 留待以后可修改
export function getOtherTypeIndex() {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    loginUin: 0,
    needNewCode: 0,
    hostUin: 0,
    data: JSON.stringify(querydata)
  });
  return jsonp(url, data, options);
}
