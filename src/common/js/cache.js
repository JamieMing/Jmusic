//localStorage 
import storage from 'good-storage'
import {favoriteType} from './config'
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const FAVORITE_MAX_LEN = 200

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  //先删后加 
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
// 保存搜索历史 
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  //   修改后重新设置storage
  storage.set(SEARCH_KEY, searches)
  return searches
}
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
//一步清空 
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}
//初始化 
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}
//保存播放历史 
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}
// 保存收藏 type是数据的类型
export function saveFavorite(data, type) {
  let items = storage.get(type, [])
  insertArray(items, data, (item) => {
    return data.mid === item.mid
  }, FAVORITE_MAX_LEN)
  storage.set(type, items)
  return items
}

export function deleteFavorite(data, type) {
  let items = storage.get(type, [])
  deleteFromArray(items, (item) => {
    return item.mid === data.mid
  })
  storage.set(type, items)
  return items
}

export function loadFavorite(type) {
  return storage.get(type, [])
}
