<template>
    <transition name="fade">
        <div class="singer-info">
            <div class="main">
                <div class="header" v-if="singer">
                    <div class="left-h">
                        <img :src="getSingerPic()" alt="歌手">
                    </div>
                    <div class="right-h">
                        <h2 v-html="singer.singer_name"></h2>
                        <div class="desc-item">
                            <span class="basic">{{basic}}</span>
                            <span @click.stop="showMore" class="moreBtn">[更多]
                            </span>
                            <!-- 个人介绍 -->
                            <InfoPop :desc="moreDesc" ref="pop" :showType="showType.scroll"></InfoPop>
                        </div>
                        <div class="songNums">
                            <span>单曲
                                <i>{{singer.total}}</i>
                            </span>
                            <span>专辑
                                <i>30</i>
                            </span>
                            <span>MV
                                <i>39</i>
                            </span>
                        </div>
                        <div class="operator">
                            <div class="btn playAllBtn" @click="playAllClick">
                                <span class="icon-play"></span>
                                <span>播放歌手热门歌曲</span>
                            </div>
                            <div class="btn favoriteBtn" :title="favoriteTitle(favoriteObj)" @click="toggleFavorite(favoriteObj)">
                                <span :class="getFavoriteIcon(favoriteObj)"></span>
                                <span>{{favoriteText(favoriteObj)}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="hot-songs" v-if="singer">
                    <h2>热门歌曲</h2>
                    <song-list :songs="songs" :showType="showType.singerType" :page="currentPage"> </song-list>
                    <div class="page-container">
                        <page :currentPage="currentPage" @pageChange="pageChange" :showNumbers="pageBtnNums" :totalNumber="totalPages" v-if="songs.length"></page>
                    </div>
                </div>
                <div class="loading-box" v-show="!singer">
                    <loading ></loading>
                </div>
                
            </div>
        </div>
    </transition>
</template>
<script>
import { getSingerByMid, getSingerDesc } from 'api/singer'
import { ERR_OK } from 'api/config'
import convert from 'xml-js'
import InfoPop from 'base/info-pop'
import SongList from 'base/song-list'
import { createSong } from 'common/js/song'
import { songListType, popType, favoriteType } from 'common/js/config'
import { favoriteMixin } from 'common/js/mixin'
import { mapActions } from 'vuex'
import Loading from 'base/loading'
import Page from 'base/page'
export default {
    mixins: [favoriteMixin],
    data() {
        return {
            currentPage: 1,
            countsPerPage: 30,
            singer: null,
            desc: null,
            moreDesc: '',
            songs: [],
            // 设置子组件的样式
            showType: {
                singer: songListType.singerType,
                scroll: popType.scroll
            }
        }
    },
    created() {
        this.mid = this.$route.params.mid
        this._getSingerInfo()
        this._getSingerDesc()
    },
    computed: {
        // 基础介绍
        basic() {
            if (!this.desc) {
                return ''
            }
            let ret = ''
            this.desc.basic.item.slice(0, 5).forEach((text) => {
                ret += `${text.key._cdata}: ${text.value._cdata} / `
            })
            return ret
        },
        // 分页控制
        song_begin() {
            return (this.currentPage - 1) * this.countsPerPage
        },
        totalPages() {
            return this.singer.total / this.countsPerPage + 1 | 0
        },
        pageBtnNums() {
            return this.totalPages > 6 ? 6 : this.totalPages
        },
        // 构建收藏的数据
        favoriteObj() {
            let { singer_id: id, singer_mid: mid, singer_name: name } = this.singer
            let { ...ret } = { id, mid, name, pic: this.getSingerPic(mid) }
            return ret
        }
    },
    methods: {
        _getSingerInfo() {
            getSingerByMid(this.mid, this.song_begin, this.countsPerPage).then((res) => {
                if (res.code === res.code) {
                    this.singer = res.data
                    this.songs = this._normalizeSong(res.data.list)
                } else {
                    alert("没有更多的歌曲")
                }
            })
        },
        _normalizeSong(list) {
            let ret = []
            list.forEach((item) => {
                let song = createSong(item.musicData);

                ret.push(song)
            })
            return ret
        },
        getSingerPic() {
            return `//y.gtimg.cn/music/photo_new/T001R300x300M000${this.mid}.jpg?max_age=2592000`
        },
        _getSingerDesc() {
            getSingerDesc(this.mid).then((res) => {
                // xml转化成json
                this.desc = JSON.parse(convert.xml2json(res.data, { compact: true, spaces: 2 })).result.data.info;
            })
        },
        showMore() {
            if (!this.desc.hasOwnProperty('basic')) {
                return
            }
            let ret = ''
            this.desc.basic.item.forEach((text) => {
                ret += `<p>${text.key._cdata}：${text.value._cdata}</p>`
            })
            ret += '<br>' + this.desc.desc._cdata + '<br>'
            this.desc.other.item.forEach((text) => {
                ret += `<p>${text.key._cdata}：${text.value._cdata}</p>`
            })
            // 格式在pop组件处理
            this.moreDesc = ret
            this.$refs.pop.show()
        },
        // 换页
        pageChange(page) {
            // 清空歌曲数组
            this.songs = []
            this.currentPage = page
            window.scrollTo(0, 0);
            // 重新请求数据, begin是计算属性，在currentPage改变的时候改变
            this._getSingerInfo();
        },
        // 点击全部播放
        playAllClick() {
            this.playAll(this.songs)
        },
        initFavoriteType() {
            this.favoriteType = favoriteType.singer
        },
        ...mapActions([
            "playAll"
        ])
    },
    components: {
        InfoPop,
        SongList,
        Page,
        Loading
    }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.singer-info
    width: 100%;
    min-height 1000px
    position: relative;
    background: url('~common/image/bg_detail.jpg') no-repeat;
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
                    border-radius 50%
            .right-h
                height 100%
                flex 1
                padding 10px 0 10px 60px
                h2
                    max-width 70%
                    font-size 38px
                    line-height 50px
                    no-wrap()
                .desc-item
                    position relative
                    margin-top 20px
                    font-size 16px
                    height 24px
                    line-height 24px
                    color $color-text
                .basic
                    position relative
                    display inline-block
                    margin-right 15px
                    font-size 14px
                    max-width 70%
                    no-wrap()
                .moreBtn
                    position absolute 
                    
                    font-size 16px
                    cursor pointer
                    &:hover
                        color $color-theme
                .songNums
                    margin-top 15px
                    color $color-text
                    >span 
                        position relative
                        font-size 22px
                        font-weight 200
                        &:not(:last-child) 
                            margin-right 10px
                            padding-right 10px
                            &:after
                                content ''
                                position absolute
                                height 100%
                                width 1px
                                right 0
                                top 0
                                background #333
                        i 
                            font-size 28px
                            padding 0 10px
                .author
                    line-height 40px
                    .icon-mine
                        vertical-align baseline
                .operator
                    margin-top 20px
                    overflow hidden
                    .btn
                        float left 
                        width 120px
                        height 44px
                        margin-right 20px
                        line-height 44px
                        font-size 14px
                        border-radius 4px
                        text-align center
                        .icon-play, .icon-favorite, .icon-not-favorite 
                            font-size 18px
                            vertical-align middle
                        .icon-favorite
                            color $color-red-l
                    .playAllBtn
                        background $color-theme-m
                        width 160px
                        color #fff
                        cursor pointer
                        &:hover
                            background $color-theme
                    .favoriteBtn
                        background #eee
                        color $color-text
                        cursor pointer
                        &:hover
                            background #ddd
        .hot-songs
            h2
                height 60px
                line-height 60px
                padding-left 15px
                font-size 22px
        .loading-box
           padding-top 200px 
</style>
