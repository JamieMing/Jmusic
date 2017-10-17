<template>
    <!-- 歌单详情页 -->
    <transition name="fade">
        <div class="album">
            <div class="main" v-if="songs.length">
                <div class="header">
                    <div class="left-h">
                        <img :src="headerData.imgurl" alt="歌单封面">
                    </div>
                    <div class="right-h">
                        <h2 v-html="headerData.name"></h2>
                        <div class="desc-item author">
                            <span class="icon-mine"></span>
                            <router-link :to="{name:'SingerInfo', params:{mid: item.mid}}" tag="a" v-html="index == songs[0].singer.length-1? item.name: item.name+' • ' " v-for="(item,index) in songs[0].singer" :key="item.id"></router-link>
                        </div>
                        <ul class="data-info">
                            <li class="data-info-item">
                                流派：<span>{{headerData.genre}}</span>
                            </li>
                            <li class="data-info-item">
                                语种：<span>{{headerData.lan}}</span>
                            </li>
                            <li class="data-info-item">
                                发行时间：<span>{{headerData.aDate}}</span>
                            </li>
                            <li class="data-info-item">
                                发行公司：<span>{{headerData.company}}</span>
                            </li>
                            <!-- 接口拿不到类型数据 -->
                            <!-- <li class="data-info-item">
                                类型：<span>{{headerData.type}}</span>
                            </li> -->
                        </ul>
                        <div class="operator">
                            <div class="btn playAllBtn" @click="playAllClick">
                                <span class="icon-play"></span>
                                <span>播放全部</span>
                            </div>
                            <div class="btn favoriteBtn" :title="favoriteTitle(favoriteObj)" @click="toggleFavorite(favoriteObj)">
                                <span :class="getFavoriteIcon(favoriteObj)"></span>
                                <span>{{favoriteText(favoriteObj)}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content">
                    <div class="left-c">
                        <song-list :songs="songs" :showType="showListType"></song-list>
                    </div>
                    <div class="right-c">
                        <disc-right :desc="right.desc"></disc-right>
                    </div>
                </div>
            </div>
            <loading v-show="!songs.length"></loading>
        </div>
    </transition>
</template>
<script>
import SongList from 'base/song-list'
import DiscRight from 'base/disc-right'
import { getAlbumInfo } from 'api/album'
import { ERR_OK } from 'api/config'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { createSong } from 'common/js/song'
import { songListType, favoriteType } from 'common/js/config'
import { favoriteMixin } from 'common/js/mixin'
import Loading from 'base/loading'
export default {
    mixins: [favoriteMixin],
    data() {
        return {
            songs: [],
            headerData: null,
            right: null,
            showListType: songListType.album,
            favoriteObj: null
        }
    },
    created() {
        this._getSongList();
    },
    methods: {
        _getSongList() {
            let albummid = this.$route.params.mid
            getAlbumInfo(albummid).then((res) => {
                if (res.code === ERR_OK) {
                    let base = res.data
                    this.songs = this._normalizeSongs(base.list)
                    this.headerData = {
                        aDate: base.aDate,
                        company: base.company,
                        genre: base.genre,
                        lan: base.lan,
                        mid: base.mid,
                        name: base.name,
                        imgurl: this.getAlbumPic(base),
                        singermid: base.singermid,
                        singername: base.singername,
                        songnum: base.total_song_num,
                    }
                    this.favoriteObj = {
                        id: base.id, 
                        mid: base.mid,
                        name: base.name,
                        pic: this.getAlbumPic(base)
                    }
                    // 右侧数据
                    this.right = {
                        desc: base.desc
                    }
                }
            })
        },
        _normalizeSongs(list) {
            let ret = []
            list.forEach((data) => {
                if (data.songid && data.albumid) {
                    ret.push(createSong(data))
                }
            })
            return ret
        },
        getAlbumPic(item) {
            return `//y.gtimg.cn/music/photo_new/T002R300x300M000${item.mid}.jpg?max_age=2592000`
        },
        playAllClick() {
            this.playAll(this.songs)
        },
        initFavoriteType() {
            this.favoriteType = favoriteType.album
        },
        ...mapActions([
            "playAll"
        ])

    },
    components: {
        SongList,
        DiscRight,
        Loading
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.album
    background: url('~common/image/bg_detail.jpg') no-repeat;
    width: 100%;
    min-height 1000px
    position: relative;
    top: 0;
    z-index: 100;
    opacity 1
    &.fade-enter-active, &.fade-leave-active
        transition all .3s
    &.fade-enter, .fade-leave-to
        opacity 0
    .main
        width 1200px
        margin 0 auto
       
        .header
            display flex
            height 240px
            padding 40px 10px
            .left-h
                height 100%
                flex 0 0 240px
                img 
                    width 100%
                    height 100%
            .right-h
                height 100%
                flex 1
                padding 10px 0 10px 60px
                h2
                    max-width 70%
                    font-size 31px
                    line-height 50px
                    no-wrap()
                .desc-item
                    line-height 36px
                    font-size 16px
                    color $color-text
                .author
                    line-height 40px
                    .icon-mine
                        vertical-align baseline
                    a
                        color #333
                        &:hover
                            color $color-theme
                .data-info
                    width 550px
                    // padding-top 15px
                    overflow hidden
                    .data-info-item
                        float left
                        width 50%
                        font-size 14px
                        line-height 32px
                .operator
                    padding-top 15px
                    overflow hidden

                    .btn
                        float left 
                        width 160px
                        height 50px
                        line-height 50px
                        font-size 16px
                        border-radius 4px
                        font-weight bold
                        text-align center
                        cursor pointer
                        .icon-play, .icon-favorite, .icon-not-favorite
                            font-size 18px
                        .icon-favorite
                            color $color-red-l
                        span 
                            letter-spacing 2px
                            vertical-align middle
                    .playAllBtn
                        background $color-theme-m
                        color #fff
                        margin-right 20px
                        &:hover
                            background $color-theme
                    .favoriteBtn
                        background #eee
                        color $color-text
                        &:hover
                            background #ddd
        .content
            display flex
            .left-c
            // grow(放大比例) shrink（缩小比例） basis（基本）
                width 860px
                // overflow hidden
            .right-c
                flex 0 0 340px
                max-width 340px
                // overflow hidden



</style>
