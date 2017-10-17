//变量语义化的设置 

export const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}
export const showMode = {
    // mini: 0,
    middle: 0,
    fullScreen: 1
}
export const songListType = {
    disc: 0,
    rank: 1,
    singer: 2,
    album: 3,
    player: 4
}

export const popType = {
    normal: 0,
    scroll: 1
}

export const orderType = {
    new: 1,
    hot: 2
}

export const searchType = {
    song: 1,
    album: 3,
    singer: 2
}

export const favoriteType = {
    song : '__favorite_song__',
    album : '__favorite_album__',
    singer : '__favorite_singer__',
    diss : '__favorite_diss__'
}
//便于判断的 
export const favoriteTypes = {
    song: 0,
    album: 1,
    singer: 2,
    diss: 3
}