import {playMode, showMode, favoriteType} from 'common/js/config' 
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'
const state = {
    singer: {},
    playing: false,
    showMode: showMode.middle,
    playlist: [],
    sequencelist: [],
    playMode: playMode.sequence,
    currentIndex: -1,
    disc: {},
    toplist: [],
    showPlaylist: false,
    toplistCate: [],
    // 初始从localStorage取数据
    searchHistory: loadSearch(),
    playHistory: loadPlay(),
    favoriteSongList: loadFavorite(favoriteType.song),
    favoriteAlbumList: loadFavorite(favoriteType.album),
    favoriteSingerList: loadFavorite(favoriteType.singer),
    favoriteDissList: loadFavorite(favoriteType.diss),
}

export default state