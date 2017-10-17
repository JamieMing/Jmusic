import * as types from './mutation-type'
import {
  playMode,
  showMode
} from 'common/js/config'
import {
  shuffle
} from 'common/js/util'
import {
  saveSearch,
  deleteSearch,
  clearSearch,
  saveFavorite,
  deleteFavorite,
  savePlay
} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
// 播放一个
export const playOne = function ({
  commit,
  state
}, song) {
  // 创建副本，用于提交mutation
  let playlist = state.playlist.slice()
  let sequencelist = state.sequencelist.slice()
  let currentIndex = state.currentIndex
  // 记录当前播放的歌曲
  let currentSong = playlist[currentIndex]
  //看看当前playlist有没有这首歌
  let fpIndex = findIndex(playlist, song)
  // 如果已经有这首歌，直接播放
  if (fpIndex > -1) {
    currentIndex = fpIndex
  } else {
    // 没有这首歌， 插到当前歌曲的下一首
    currentIndex++
    playlist.splice(currentIndex, 0, song)
  }
  // 当前歌曲在序列歌单的位置
  let currentSIndex = findIndex(sequencelist, currentSong)
  let fsIndex = findIndex(sequencelist, song)
  // 已有歌曲，则不处理
  if (fsIndex == -1) {
    sequencelist.splice(currentSIndex + 1, 0, song)
  }
  // 提交mutation
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING_STATE, true)
  return '歌曲即将播放'
}
// 添加一个，但不播放
export const addOne = function ({
  commit,
  state
}, song) {
  let playlist = state.playlist.slice()
  let sequencelist = state.sequencelist.slice()
  let fpIndex = findIndex(playlist, song)
  let fsIndex = findIndex(sequencelist, song)
  if (fpIndex > -1 && fsIndex > -1) {
    return "歌曲列表已经有这首歌了"
  } else {
    if (playlist.length == 0) {
      commit(types.SET_CURRENT_INDEX, 0)
      commit(types.SET_PLAYING_STATE, true)
    }
    playlist.push(song)
    sequencelist.push(song)
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequencelist)
    return '添加成功~'
  }
}
// 播放全部
export const playAll = function ({
  commit,
  state
}, songs) {
  commit(types.SET_SEQUENCE_LIST, songs)
  // 是否是随机播放的状态
  if (state.playMode === playMode.random) {
    let randomlist = shuffle(songs)
    commit(types.SET_PLAYLIST, randomlist)
  } else {
    commit(types.SET_PLAYLIST, songs)
  }

  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, true)
}
//删除歌曲 
export const deleteSong = function ({
  commit,
  state
}, song) {
  // 副本
  let playlist = state.playlist.slice()
  let sequencelist = state.sequencelist.slice()
  let currentIndex = state.currentIndex
  // playlist中的索引号
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  // sequencelist中的索引号
  let sIndex = findIndex(sequencelist, song)
  sequencelist.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState); //删完了 
}
//清空歌曲列表 
export const deleteSongList = function ({
  commit
}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false);
}

//搜索历史
export const saveSearchHistory = function ({
  commit
}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
export const deleteSearchHistory = function ({
  commit
}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}
export const clearSearchHistory = function ({
  commit
}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 保存播放历史
export const savePlayHistory = function ({
  commit
}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 收藏歌曲
export const saveFavoriteList = function ({
  commit
}, {
  data,
  type
}) {
  commit(types.SET_FAVORITE_lIST, {
    list: saveFavorite(data, type),
    type: type
  })
}
// 取消收藏 
export const deleteFavoriteList = function ({
  commit
}, {
  data,
  type
}) {
  commit(types.SET_FAVORITE_lIST, {
    list: deleteFavorite(data, type),
    type: type
  })
}
