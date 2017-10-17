<template>
    <div class="song-list" :class="showByType">
        <div class="title-row">
            <div class="t1">&nbsp;&nbsp;歌曲</div>
            <div class="t2" v-show="!isShowBySinger">歌手</div>
            <div class="t3" v-if="!isShowByRank&&!isShowByAlbum&&!isShowByPlayer">专辑</div>
            <div class="t4">时长</div>
        </div>
        <ul class="list">
            <div class="loading-container" v-show="!songs.length">
                <loading :size="48" :title="loadingTitle"></loading>
            </div>
            <li class="song-item" v-for="(song, index) in songs" :key="index">
                <div class="song-index" :class="{'top3':songIndex(index)<=3}">{{songIndex(index)}}</div>
                <div class="deltaCount" v-if="isShowByRank" :class="{'none': song.deltaCount == '0%'}">
                    <div class="icon" :class="iconType(song.deltaCount)"></div>
                    <div class="info" :class="{'new':deltaInfo(song.deltaCount) == 'new'}">
                        {{deltaInfo(song.deltaCount)}}
                    </div>
                </div>
                <div class="song-name t1">
                    <div class="pic" v-if="isShowByRank">
                        <img v-lazy="song.image" alt="">
                    </div>
                    <div class="inner">
                        <router-link :to="{name:'SingleSong', params:{mid: song.mid}}" tag="a" v-html="song.name"></router-link>&nbsp;
                        <span>{{song.albumdesc}}</span>
                    </div>
                    <div class="manage">
                        <div class="manage-item">

                            <span class="icon-play" @click="play(song, index)" v-show="!playIcon(song)" title="播放"></span>

                            <img v-lazy="song.image" v-show="playIcon(song)" alt="" class="play-image" title="暂停">

                        </div>
                        <div class="manage-item" v-if="!isShowByPlayer">
                            <span class="icon-add" @click="add(song, index)" title="添加到播放列表"></span>
                        </div>
                        <div class="manage-item" :title="favoriteTitle(song)">
                            <span :class="getFavoriteIcon(song)" @click="toggleFavorite(song)"></span>
                        </div>
                        <div class="manage-item" v-if="isShowByPlayer" title="删除歌曲">
                            <span class="icon-clear" @click="deleteSong(song)"></span>
                        </div>
                        <transition name="tip">
                            <div class="tip" v-show="tipShow && index == choiceIndex">
                                {{tip}}
                            </div>
                        </transition>
                    </div>
                </div>
                <div class="singer t2" v-show="!isShowBySinger">
                    <router-link :to="{name:'SingerInfo', params:{mid: item.mid}}" tag="a" v-html="index == song.singer.length-1? item.name: item.name+' • ' " v-for="(item,index) in song.singer" :key="item.id"></router-link>
                </div>
                <div class="album t3" v-if="!isShowByRank&&!isShowByAlbum&&!isShowByPlayer">{{song.album}}</div>
                <div class="time t4">{{filterTime(song.duration)}}</div>
            </li>

        </ul>

    </div>
</template>
<script>
import Loading from 'base/loading'
import { mapActions, mapGetters,mapMutations } from 'vuex'
import { formatTime } from 'common/js/util'
import { songListType, favoriteType } from 'common/js/config'
import { favoriteMixin } from 'common/js/mixin'
//字符串变量 
const types = {
    [songListType.rank]: 'rankType',
    [songListType.singer]: 'singerType',
    [songListType.album]: 'albumType',
    [songListType.player]: 'playerType',
    [songListType.disc]: 'discType'
}
export default {
    mixins:[favoriteMixin],
    props: {
        songs: {
            type: Array,
            default: []
        },
        // 显示方式
        showType: {
            type: Number,
            default: songListType.disc
        },
        //当前页 
        page: {
            type: Number,
            default: 1
        },
        countPerPage: {
            type: Number,
            default: 30
        }
    },
    data() {
        return {
            tipShow: false,
            tip: '',
            choiceIndex: 0,
            loadingTitle: '正在加载中...'
        }
    },
    computed: {
        //根据需要，以不同的方式显示，该组件被共用次数较多 
        showByType() {
            return types[this.showType]
        },
        isShowByRank() {
            return this.showType === songListType.rank
        },
        isShowBySinger() {
            return this.showType === songListType.singer
        },
        isShowByAlbum() {
            return this.showType === songListType.album
        },
        isShowByPlayer() {
            return this.showType === songListType.player
        },
        ...mapGetters([
            "playing",
            "currentSong"
        ])
    },
    created() {
        setTimeout(() => {
            if (!this.songs.length) {
                this.loadingTitle = '抱歉，无法加载此歌单！'
            }
        }, 30000)
    },
    methods: {
        // 排行榜的序号
        songIndex(index) {
            return (this.page - 1) * this.countPerPage + index + 1
        },
        //排行榜的排名样式的变化 
        iconType(delta) {
            // 两种百分比的情况
            if (/(100%)/g.test(delta)) return 'none'
            if (/(\d+%)/g.test(delta)) return 'icon2-arrow-up'
            delta = Number(delta)
            return delta > 0 ? 'icon2-arrow-up' : delta < 0 ? 'icon2-arrow-down' : 'none'
        },
        deltaInfo(delta) {
            if (Number(delta) < 0) return -Number(delta) + ''
            if (Number(delta) == 0) return '—'
            if (/(100%)/g.test(delta)) return 'new'
            return delta
        },
        playIcon(song) {
            return this.playing && this.currentSong.id === song.id
        },
        //时间格式化 
        filterTime(duration) {
            return formatTime(duration)
        },
        // 调用vuex的action进行播放
        play(song, index) {
            this.playOne(song).then((res) => {
                this.showTip(res, index)
            })

        },
        // 添加歌曲
        add(song, index) {
            this.addOne(song).then((res) => {
                this.showTip(res, index)
            })
        },
        // 操作提示
        showTip(tip, index) {
            clearTimeout(this.timer)
            this.tip = tip
            this.choiceIndex = index
            this.tipShow = true
            this.timer = setTimeout(() => {
                this.tipShow = false
            }, 2000)
        },   
        //收藏类型 
        initFavoriteType(){
            this.favoriteType = favoriteType.song
        },
        ...mapActions([
            "playOne",
            "addOne",
            "deleteSong"
        ])
    },
    components: {
        Loading
    }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.song-list
    min-height 400px
    font-size 14px
    .t1
        // flex 0 0 372px
        flex 2
        padding-left 32px
    .t2 
        flex 1
    .t3
        flex 1
    .t4 
        flex .8 
        text-align center
    .title-row
        display flex
        align-items center
        height 50px
        color #999
        background #fbfbfd
    .list
        position relative
        min-height 500px
        .song-item
            position relative
            display flex
            height 50px
            // line-height 50px
            align-items center
            color #333
            >div
                no-wrap()
            &:nth-of-type(2n)
                background #fbfbfd
            .song-index
                position absolute
                width 32px
                left 0
                text-align center
                font-size 15px
                color #333
            .song-name
                position relative
                display flex
                align-items center
                .pic
                    flex 0 0 70px
                    height 70px
                    img  
                        width 70px
                        height 70px
                .inner
                    flex 1
                    max-width 75%    
                    no-wrap()
                    span    
                        display inline-block
                        color #999
                    a
                        display inline-block
                        cursor pointer
                        color #333
                        &:hover
                            color $color-theme
                .manage
                    flex 0 0 100px
                    position relative
                    margin-right 5%
                    width 20%
                    display flex
                    text-align center
                    .manage-item
                        display flex
                        align-items center
                        flex 1         
                        transform-origin 50% 50%   
                        transition all .4s
                        cursor pointer
                    .icon-play
                        line-height 50px
                        font-size 24px
                        display block
                        color $color-theme-m
                        &:hover
                            color $color-theme
                            transform scale(1.2)
                    .play-image
                        display block
                        margin-left -12px
                        border-radius 50%
                        width 40px
                        height 40px
                        animation rotate 20s linear infinite 
                    .icon-add, .icon-not-favorite
                        font-size 21px
                        line-height 50px
                        display block
                        font-weight 200
                        color $color-theme-m
                        &:hover
                            color $color-theme
                            transform scale(1.2)
                    .icon-add
                        font-size 20px
                    .icon-favorite
                        font-size 21px
                        line-height 50px
                        display block
                        font-weight 200
                        color $color-red-l
                        &:hover
                            transform scale(1.2)
                    .icon-clear
                        margin-left 5px
                        color gray
                        font-size 18px
                        line-height 50px
                        display block
                    .tip
                        position absolute
                        padding 0 5px
                        height 50px
                        left -122px
                        background rgba(255, 255, 255, .8)
                        border-radius 3px
                        line-height 50px
                        font-size 14px
                        color $color-theme
                        opacity 1
                        &.tip-enter-active, &.tip-leave-active
                            transition all .4s 
                        &.tip-enter, &.tip-leave-to
                            opacity 0     
            .singer, .album
                cursor pointer
                a
                    &:hover
                        color $color-theme
                &:hover
                    color $color-theme
        .loading-container
            position absolute
            width 100%
            top 50%
            transform translateY(-50%)  

    &.rankType
        .t1
            flex 3
            padding-left 115px
        .t2
            flex 0 0 154px
        .list
            .song-item
                height 80px
                line-height 80px
                position relative
                .song-index
                    font-size 24px
                    width 45px
                    &.top3
                         color #ff4222
                .deltaCount
                    position absolute
                    left 50px
                    width 50px
                    text-align center
                    color #555
                    font-size 12px
                    .icon
                        height 16px
                        line-height 16px
                    .info
                        height 20px
                        line-height 20px
                    .new
                        font-weight 700
                        color #ff4222
                        font-size 14px
                .none
                    display none
                .song-name
                    .inner
                        padding-left 20px
    &.singerType
        .t1
            flex 1.5
            padding-left 50px
        .t2, .t3
            flex 1
    &.albumType
        .t1
            flex 1.5
            padding-left 50px
        .t2, .t3
            flex 1
    &.playerType
        color white
        height 100%
        .t1
            flex 5
        .title-row
            background rgba(255, 255, 255, 0)
            color $color-text-ll
        .list
            .song-item
                background rgba(255, 255, 255, 0)
                color $color-text-ll
                .song-index
                    color $color-text-ll
                .song-name
                    .inner
                        max-width 100%
                        span 
                            color $color-text-l
                        a
                            color $color-text-ll
                            &:hover
                                color #fff
                    .manage
                        flex 0 0 100px
                        margin-right 2%
                        .manage-item
                            margin-right 2px
                            
                .singer
                    a
                        color $color-text-ll
                        &:hover
                            color #fff
    @keyframes rotate 
        0%
            transform rotate(0)
        100%
            transform rotate(360deg)    
    
</style>


