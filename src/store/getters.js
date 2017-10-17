export const singer = state => state.singer
export const playing = state => state.playing
export const playMode = state => state.playMode
export const playlist = state => state.playlist
export const sequencelist = state => state.sequencelist
export const showMode = state => state.showMode
export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
    return state.playlist[state.currentIndex] || {}
}
export const disc = state => state.disc
export const toplist = state => state.toplist
export const showPlaylist = state => state.showPlaylist
export const toplistCate = state => state.toplistCate

export const searchHistory = state => state.searchHistory
export const playHistory = state => state.playHistory
export const favoriteSongList = state => state.favoriteSongList
export const favoriteAlbumList = state => state.favoriteAlbumList
export const favoriteSingerList = state => state.favoriteSingerList
export const favoriteDissList = state => state.favoriteDissList
