import * as types from './mutation-type'
import {
  favoriteType
} from 'common/js/config'

const favoriteLists = {
  [favoriteType.song]: 'favoriteSongList',
  [favoriteType.album]: 'favoriteAlbumList',
  [favoriteType.singer]: 'favoriteSingerList',
  [favoriteType.diss]: 'favoriteDissList'
}
const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.playMode = mode
  },
  [types.SET_SHOW_MODE](state, mode) {
    state.showMode = mode
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequencelist = list
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_TOP_LIST](state, list) {
    state.toplist = list
  },
  [types.SET_SHOW_PLAYLIST](state, flag) {
    state.showPlaylist = flag
  },
  [types.SET_TOPLIST_CATE](state, list) {
    state.toplistCate = list
  },
  [types.SET_SEARCH_HISTORY](state, searchHistory) {
    state.searchHistory = searchHistory
  },
  [types.SET_PLAY_HISTORY](state, playHistory) {
    state.playHistory = playHistory
  },
  //分类设置 
  [types.SET_FAVORITE_lIST](state, {list, type}) {
    
    state[favoriteLists[type]] = list
  }
}

export default mutations
