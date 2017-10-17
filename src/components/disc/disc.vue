<template>
    <!-- 歌单详情页 -->
    <transition name="fade">
        <div class="disc">
            <div class="main">
                <div class="header">
                    <div class="left-h">
                        <img :src="headerData.imgurl" alt="歌单封面">
                    </div>
                    <div class="right-h">
                        <h2 v-html="headerData.dissname"></h2>
                        <div class="desc-item author">
                            <span class="icon-mine"></span> {{headerData.author}}</div>
                        <div class="tag desc-item">标签： {{headerData.tags}}</div>
                        <div class="listenNum desc-item">播放量： {{headerData.listennum}}</div>
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
                        <song-list :songs="songs"></song-list>
                    </div>
                    <div class="right-c">
                        <disc-right :desc="right.desc"></disc-right>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import SongList from 'base/song-list'
import DiscRight from 'base/disc-right'
import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { createSong } from 'common/js/song'
import { favoriteType } from 'common/js/config'
import { favoriteMixin } from 'common/js/mixin'
export default {
    mixins: [favoriteMixin],
    data() {
        return {
            songs: [],
            headerData: {},
            right: {},
            favoriteObj: {}
        }
    },
    created() {
        this._getSongList();
    },
    methods: {
        _getSongList() {
            let dissid = this.$route.params.mid
            getSongList(dissid).then((res) => {
                if (res.code === ERR_OK) {
                    let base = res.cdlist[0]
                    this.songs = this._normalizeSongs(base.songlist)
                    this.headerData = {
                        author: base.nick,
                        dissid: base.disstid,
                        dissname: base.dissname,
                        imgurl: base.logo,
                        desc: base.desc,
                        listennum: base.visitnum,
                        songnum: base.songnum,
                        tags: this._normalizeTags(base.tags)
                    }
                    this.favoriteObj = {
                        id: base.dissid,
                        mid: base.disstid,
                        name: base.dissname,
                        pic: base.logo
                    }
                    // 右侧数据
                    this.right = {
                        desc: base.desc
                    }
                }
            })
        },
        _normalizeTags(tags) {
            let ret = ''
            tags.forEach((data) => {
                ret += data.name + ' '
            })
            return ret
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
        playAllClick() {
            this.playAll(this.songs)
        },
        initFavoriteType(){
            this.favoriteType = favoriteType.diss
        },
        ...mapActions([
            "playAll"
        ])

    },
    components: {
        SongList,
        DiscRight
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.disc
    background: url('~common/image/bg_detail.jpg') no-repeat;
    width: 100%;
    height: 100%;
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
                .operator
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
                            font-size 22px         
                        .icon-favorite
                            color $color-red-l 
                        span 
                            letter-spacing 2px
                            vertical-align middle
                    .playAllBtn
                        margin-right 15px
                        background $color-theme-m
                        color #fff
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
            .right-c
                flex 0 0 340px
                max-width 340px


</style>
