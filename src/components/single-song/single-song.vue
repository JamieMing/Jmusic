<template>
    <!-- 歌单详情页 -->
    <transition name="fade">
        <div class="single-song">
            <div class="main" v-if="albumInfo">
                <div class="header">
                    <div class="left-h">
                        <img :src="song.image" alt="歌单封面">
                    </div>
                    <div class="right-h">
                        <h2 v-html="song.name"></h2>
                        <div class="desc-item author">
                            <span class="icon-mine"></span>
                            <router-link :to="{name:'SingerInfo', params:{mid: item.mid}}" tag="a" v-html="index == song.singer.length-1? item.name: item.name+' • ' " v-for="(item,index) in song.singer" :key="item.id"></router-link>
                        </div>
                        <ul class="data-info">
                            <li class="data-info-item">
                                流派：
                                <span>{{albumInfo.genre}}</span>
                            </li>
                            <li class="data-info-item">
                                语种：
                                <span>{{albumInfo.lan}}</span>
                            </li>
                            <li class="data-info-item">
                                发行时间：
                                <span>{{albumInfo.aDate}}</span>
                            </li>
                            <li class="data-info-item">
                                发行公司：
                                <span>{{albumInfo.company}}</span>
                            </li>
                            <!-- 接口拿不到类型数据 -->
                            <!-- <li class="data-info-item">
                                                类型：<span>{{albumInfo.type}}</span>
                                            </li> -->
                        </ul>
                        <div class="operator">
                            <div class="btn playAllBtn" @click="playOneClick">
                                <span class="icon-play"></span>
                                <span>播放</span>
                            </div>
                            <div class="btn favoriteBtn" :title="favoriteTitle(song)" @click="toggleFavorite(song)">
                                <span :class="getFavoriteIcon(song)"></span>
                                <span>{{favoriteText(song)}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content">
                    <div class="left-c">
                        <h4>歌词</h4>
                        <div class="lyric" v-if="lyric">
                            <p v-for="(item, index) in lyric.lines" :key="index">
                                {{item.txt}}
                            </p>
                        </div>
                    </div>
                    <div class="right-c">
                        <disc-right :desc="albumInfo.desc"></disc-right>
                    </div>
                </div>
            </div>

            <div class="loading-box">
                <loading v-show="!albumInfo"></loading>
            </div>
        </div>
    </transition>
</template>
<script>
// import SongList from 'base/song-list'
import DiscRight from 'base/disc-right'
import { getSongInfo } from 'api/song'
import { getAlbumInfo } from 'api/album'
import { ERR_OK } from 'api/config'
import { favoriteType } from 'common/js/config'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { createSong } from 'common/js/song'
import Lyric from 'Lyric-parser'
import Loading from 'base/loading'
import { favoriteMixin } from 'common/js/mixin'
export default {
    mixins: [favoriteMixin],
    data() {
        return {
            song: null,
            lyric: null,
            albumInfo: null
        }
    },
    computed: {

    },
    created() {
        this._getSongInfo();
    },
    methods: {
        _getSongInfo() {
            let songmid = this.$route.params.mid

            getSongInfo(songmid).then((res) => {
                if (ERR_OK == res.code) {
                    let rd = res.data[0]
                    // 根据返回的数据，重新构建送数据
                    let data = {
                        songid: rd.id,
                        songmid: rd.mid,
                        songname: rd.name,
                        singer: rd.singer,
                        albumname: rd.album.name,
                        albummid: rd.album.mid,
                        albumid: rd.album.id,
                        albumdesc: '',
                        interval: rd.interval,
                    }
                    this.song = createSong(data)
                    return (rd.album.mid)
                }
            }).then((mid) => {
                this._getAlbumInfo(mid)
            }).then(() => {
                this._getLyric()
            })

        },
        _getAlbumInfo(albummid) {
            getAlbumInfo(albummid).then((res) => {
                this.albumInfo = res.data
            })
        },
        _getLyric() {
            console.log(this.song.mid);
            this.song.getLyric().then((data) => {
                if (this.song.lyric !== data) {
                    return
                }
                this.lyric = new Lyric(data)
            })
        },
        getAlbumPic(item) {
            return `//y.gtimg.cn/music/photo_new/T002R300x300M000${item.mid}.jpg?max_age=2592000`
        },
        playOneClick() {
            this.playOne(this.song)
        },
        initFavoriteType() {
            this.favoriteType = favoriteType.song
        },
        ...mapActions([
            "playOne"
        ])

    },
    components: {
        // SongList,
        DiscRight,
        Loading
    }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.single-song {
    background: url('~common/image/bg_detail.jpg') no-repeat;
    width: 100%;
    min-height: 1000px;
    position: relative;
    top: 0;
    z-index: 100;
    opacity: 1;

    &.fade-enter-active, &.fade-leave-active {
        transition: all 0.3s;
    }

    &.fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .main {
        width: 1200px;
        margin: 0 auto;

        .header {
            display: flex;
            height: 240px;
            padding: 40px 10px;

            .left-h {
                height: 100%;
                flex: 0 0 240px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .right-h {
                height: 100%;
                flex: 1;
                padding: 10px 0 10px 60px;

                h2 {
                    max-width: 70%;
                    font-size: 31px;
                    line-height: 50px;
                    no-wrap();
                }

                .desc-item {
                    line-height: 36px;
                    font-size: 16px;
                    color: $color-text;
                }

                .author {
                    line-height: 40px;

                    .icon-mine {
                        vertical-align: baseline;
                    }

                    a {
                        color: #333;

                        &:hover {
                            color: $color-theme;
                        }
                    }
                }

                .data-info {
                    width: 550px;
                    // padding-top 15px
                    overflow: hidden;

                    .data-info-item {
                        float: left;
                        width: 50%;
                        font-size: 14px;
                        line-height: 32px;
                        no-wrap();
                    }
                }

                .operator {
                    padding-top: 15px;
                    overflow: hidden;

                    .btn {
                        float: left;
                        width: 160px;
                        height: 50px;
                        line-height: 50px;
                        font-size: 16px;
                        border-radius: 4px;
                        font-weight: bold;
                        text-align: center;
                        cursor: pointer;

                        .icon-play, .icon-favorite, .icon-not-favorite {
                            font-size: 22px;
                        }

                        .icon-favorite {
                            color: $color-red-l;
                        }

                        span {
                            letter-spacing: 2px;
                            vertical-align: middle;
                        }
                    }

                    .playAllBtn {
                        background: $color-theme-m;
                        color: #fff;
                        margin-right: 20px;

                        &:hover {
                            background: $color-theme;
                        }
                    }

                    .favoriteBtn {
                        background: #eee;
                        color: $color-text;

                        &:hover {
                            background: #ddd;
                        }
                    }
                }
            }
        }

        .content {
            display: flex;

            .left-c {
                // grow(放大比例) shrink（缩小比例） basis（基本）
                width: 860px;

                h4 {
                    // padding-left 15px
                    margin-bottom: 10px;
                    text-align: center;
                    font-size: 18px;
                }

                .lyric {
                    padding-left: 5px;

                    p {
                        text-align: center;
                        font-size: 14px;
                        padding: 8px;
                    }
                }
            }

            .right-c {
                flex: 0 0 340px;
                max-width: 340px;
            }
        }
    }

    .loading-box {
        padding-top: 200px;
    }
}
</style>
