<template>
    <transition :name="showModeClass">
        <div class="player" v-show="playlist.length>0" @mousedown.prevent.stop="moveStart" @mousemove.prevent="moving" @mouseup.prevent="moveEnd" @mouseleave.prevent="moveEnd" :class="[{'moving': movingFlag}, showModeClass]" ref="player">
            <div class="background" v-if="isFullScreen">
                <img :src="currentSong.image" alt="" width="100%" height="100%">
            </div>
            <!-- 全屏下显示 -->
            <div class="middle-wrapper" v-show="isFullScreen">
                <div class="left" v-bar="{preventParentScroll: true,                        scrollThrottle: 30}">
                    <song-list :songs="playlist" :showType="showType"></song-list>
                </div>
                <div class="right">
                    <div>
                        <div class="top-image">
                            <img :src="currentSong.image" alt="" width="200" height="200">
                        </div>
                        <div class="desc">
                            <p>歌名：{{currentSong.name}}</p>
                            <p>专辑名：{{currentSong.album}}</p>
                        </div>
                        <p v-if="currentLyric &&  currentLyric.lines.length == 0" class="desc">该歌曲未填词，请欣赏</p>
                        <scroll :data="currentLyric && currentLyric.lines" ref="lyricList" class="scroll">
                            <div class="lyric-wrapper">
                                <div v-if="currentLyric">
                                    <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index }" v-for="(line, index) in currentLyric.lines" :key="index">{{line.txt}}</p>
                                </div>
                            </div>
                        </scroll>
                    </div>
                </div>
            </div>
            <!-- 进度条 -->
            <div class="progress-wrapper">
                <span class="time time-l">{{format(currentTime)}}</span>
                <div class="progress-bar-wrapper" @mousedown.stop>
                    <progress-bar :percent="playPercent" @percentChange="musicProgressChange" :isFullScreen="isFullScreen"></progress-bar>
                </div>
                <span class="time time-r">{{format(currentSong.duration)}}</span>
                <div class="volume" @mousedown.stop @click.stop="toggleVolume">
                    <span :class="volumeClass"></span>
                    <volume-progress :percent="currentVolume" @percentChange="volumeProgressChange" v-show="showVolume"></volume-progress>
                </div>
            </div>
            <!-- 工具按钮 -->
            <div class="operators">
                <div class="icon i-left">
                    <i :class="iconMode" @click.stop="changePlayMode" @mousedown.stop :title="playModeTitle"></i>
                </div>
                <div class="icon i-left" :class="disableCls">
                    <i class="icon-prev" @click.stop="prev" @mousedown.stop></i>
                </div>
                <div class="icon i-center" :class="disableCls">
                    <i :class="playIcon" @click.stop="togglePlaying" @mousedown.stop ></i>
                </div>
                <div class="icon i-right" :class="disableCls">
                    <i class="icon-next" @click.stop="next" @mousedown.stop></i>
                </div>
                <div class="icon i-right mt-4" v-if="!isFullScreen">
                    <i class="icon-playlist" @click.stop="togglePlaylist" @mousedown.stop :title="playlistTitle"></i>
                </div>
                <div class="icon i-right" :title="favoriteTitle(currentSong)">
                    <i :class="getFavoriteIcon(currentSong)" @click.stop="toggleFavorite(currentSong)"></i>
                </div>
                <div class="icon i-right">
                    <i class="icon2-enlarge" @click="toggleShowMode" :title="fullScreenTitle"></i>
                </div>
            </div>
            <audio :src="currentSong.url" ref="audio" @timeupdate="updateTime" @play="ready" @error="error" @ended="end"></audio>
        </div>
    </transition>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { formatTime, fixedMouse, shuffle } from 'common/js/util'
import ProgressBar from 'base/progress-bar'
import VolumeProgress from 'base/volume-progress'
import { playMode, showMode, favoriteType } from 'common/js/config'
import SongList from 'base/song-list'
import { songListType } from 'common/js/config'
import Lyric from 'Lyric-parser'
import Scroll from 'base/scroll'
import { favoriteMixin } from 'common/js/mixin'
//少做点判断 
const SHOWMODECLASS = {
    [showMode.fullScreen]: 'full-screen',
    [showMode.middle]: 'middle'
}
const PLAYMODECLASS = {
    [playMode.sequence]: 'icon-sequence',
    [playMode.loop]: 'icon-loop',
    [playMode.random]: 'icon-random'
}
const PLAYMODETITLE = {
    [playMode.sequence]: '列表循环',
    [playMode.loop]: '单曲循环',
    [playMode.random]: '随机播放'
}

export default {
    mixins: [favoriteMixin],
    data() {
        return {
            songReady: false,
            currentTime: 0,
            showVolume: false,
            movingFlag: false,
            currentVolume: 0.5,
            currentLyric: null,
            currentLineNum: 0,
        }
    },
    created() {
        this.pos = {}
    },
    computed: {
        // 音量控制
        playPercent() {
            return this.currentTime / this.currentSong.duration
        },
        // 样式的改变
        iconMode() {
            return PLAYMODECLASS[this.playMode]
        },
        showModeClass() {
            return SHOWMODECLASS[this.showMode]
        },
        isFullScreen() {
            return this.showMode === showMode.fullScreen
        },
        // 歌曲列表
        showType() {
            return songListType.player
        },
        playIcon() {
            return this.playing ? 'icon-pause' : 'icon-play'
        },
        disableCls() {
            return this.songReady ? '' : 'disable'
        },
        // title显示
        playlistTitle(){
            return this.showPlaylist ? '收起播放列表' : '显示播放列表'
        },
        fullScreenTitle(){
            return this.isFullScreen ? '退出全屏' : '全屏'
        },
        playModeTitle(){
            return PLAYMODETITLE[this.playMode]
        },
        // 小喇叭的样式改变，
        volumeClass() {
            return this.currentVolume > 0.7 ? 'icon2-volume-high' : this.currentVolume > 0.4 ? 'icon2-volume-medium' : this.currentVolume > 0.1 ? 'icon2-volume-low' : 'icon2-volume-mute'
        },
        // 数据获取
        ...mapGetters([
            "sequencelist",
            "playlist",
            "currentSong",
            "playMode",
            "showMode",
            "playing",
            "currentIndex",
            "showPlaylist",
            // "favoriteSongList"
        ])
    },
    methods: {
        // 歌曲播放事件
        updateTime(e) {
            this.currentTime = e.target.currentTime
        },
        // 歌曲准备
        ready() {
            this.songReady = true
            this.$refs.audio.volume = this.currentVolume
            //保存到播放历史 
            this.savePlayHistory(this.currentSong);
        },
        error() {
            this.songReady = true
            alert("当前歌曲无法播放~")
        },
        // 歌曲播放结束
        end() {
            if (this.playMode === playMode.loop) {
                this.loop()
            } else {
                this.next()
            }
        },
        // 循环播放控制, 单曲的
        loop() {
            const audio = this.$refs.audio
            audio.currentTime = 0
            audio.play()
            if (this.currentLyric) {
                this.currentLyric.seek(0)
            }
        },
        // 进度条事件
        musicProgressChange(percent) {
            const audio = this.$refs.audio
            const currentTime = this.currentSong.duration * percent
            audio.currentTime = currentTime
            if (!this.playing) {
                this.togglePlaying()
            }
            // 滚动歌词
            if (this.currentLyric) {
                this.currentLyric.seek(currentTime * 1000)
            }
        },
        volumeProgressChange(percent) {
            const audio = this.$refs.audio
            this.currentVolume = percent
            audio.volume = percent
        },
        toggleVolume() {
            this.showVolume = !this.showVolume
            // 为了让currentVolume发生变化，以触发volume-progress的绘图
            if (this.showVolume) {
                setTimeout(() => {
                    this.currentVolume = this.$refs.audio.volume + 0.01
                }, 20)
                // 注意this
                document.addEventListener('click', () => {
                    this.showVolume = false
                })
            }
        },
        // 时间格式化
        format(interval) {
            return formatTime(interval)
        },
        // operator event
        changePlayMode() {
            const mode = (this.playMode + 1) % 3
            this.setPlayMode(mode)
            let list = null
            if (mode === playMode.random) {
                // 洗牌函数，打乱数组,重新排序
                list = shuffle(this.sequencelist)
            } else {
                list = this.sequencelist
            }
            this.resetCurrentIndex(list)
            this.setPlaylist(list)
        },
        resetCurrentIndex(list) {
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        prev() {
            if (!this.songReady) {
                return
            }
            if (this.playlist.length == 1) {
                this.loop()
                return
            } else {
                let index = this.currentIndex - 1
                if (index < 0) {
                    index = this.playlist.length - 1
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                    this.togglePlaying()
                }
            }
            this.songReady = false
        },
        // 控制播放和暂停
        togglePlaying() {
            if (!this.songReady) {
                return
            }
            // vuex 方法
            this.setPlayingState(!this.playing)
            if (this.currentLyric) {
                this.currentLyric.togglePlay()
            }

        },
        next() {
            if (!this.songReady) {
                return
            }
            if (this.playlist.length == 1) {
                this.loop()
                return
            } else {
                let index = this.currentIndex + 1
                if (index === this.playlist.length) {
                    index = 0
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                    this.togglePlaying()
                }
            }
            this.songReady = false
        },
        // 播放器移动
        moveStart(e) {
            if (this.isFullScreen) return
            this.movingFlag = true
            const player = this.$refs.player
            this.pos.x = e.clientX - player.offsetLeft
            this.pos.y = e.clientY - player.offsetTop
        },
        moving(e) {
            if (!this.movingFlag) {
                return
            }
            const player = this.$refs.player

            let left = e.clientX - this.pos.x
            let top = e.clientY - this.pos.y
            // console.log(left);
            player.style.left = left + 'px'
            player.style.top = top + 'px'
        },
        moveEnd() {
            this.movingFlag = false
            // e = e || window.event
            // let target = this.$refs.player
            // if (fixedMouse(e, target)) {
            //     this.movingFlag = false
            // }

        },
        // 显示playlist
        togglePlaylist() {
            this.setShowPlaylist(!this.showPlaylist)
        },
        // 改变播放器的显示样式
        toggleShowMode() {
            const mode = (this.showMode + 1) % 2
            this.setShowMode(mode)
            // if (!this.playing) {
                setTimeout(() => {
                    this.$refs.lyricList.refresh()
                }, 20)
            // }
        },
        //获取歌词数据
        getLyric() {
            this.currentSong.getLyric().then((data) => {
                if (this.currentSong.lyric !== data) {
                    return
                }
                this.currentLyric = new Lyric(data, this.handleLyric)
                if (this.playing) {
                    this.currentLyric.play()
                }
            }).catch(() => {
                this.currentLyric = null
                this.playingLyric = ''
                this.currentLineNum = 0
            })
        },
        // 歌词滚动
        handleLyric({ lineNum, txt }) {
            this.currentLineNum = lineNum
            if (lineNum > 4) {
                let lineEl = this.$refs.lyricLine[lineNum - 4]
                this.$refs.lyricList.scrollToElement(lineEl, 1000)
            } else {
                this.$refs.lyricList.scrollTo(0, 0, 1000)
            }
            this.playingLyric = txt
        },
        //实现mixin的必需方法 
        initFavoriteType(){
            this.favoriteType = favoriteType.song
        },
        ...mapMutations({
            setPlayingState: 'SET_PLAYING_STATE',
            setPlaylist: 'SET_PLAYLIST',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setShowMode: 'SET_SHOW_MODE',
            setShowPlaylist: 'SET_SHOW_PLAYLIST'
        }),
        ...mapActions([
            "savePlayHistory"
        ])
    },
    watch: {
        //歌曲切换 
        currentSong(newSong, oldSong) {
            if (!newSong.id) {
                return
            }
            if (newSong.id === oldSong.id) {
                return
            }
            if (this.currentLyric) {
                this.currentLyric.stop()
            }
            // 保证歌曲准备好
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.$refs.audio.play()
                this.getLyric()
            }, 1000)
        },
        playing(newPlaying) {
            const audio = this.$refs.audio
            this.$nextTick(() => {
                newPlaying ? audio.play() : audio.pause()
            })
        },
        //当点击链接，改变路由了，就退出全屏 
        $route() {
            this.setShowMode(showMode.middle)
        }
    },
    components: {
        ProgressBar,
        VolumeProgress,
        SongList,
        Scroll
    }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.player
    position fixed
    z-index 1000
    // transition all .4s
    // 扩展移动区域
    &:before
        content:''
        position absolute
        top -20px
        left -20px
        right -20px
        bottom -20px
        z-index -1
    &.moving
        box-shadow 2px 3px 5px 5px #999 
    &.middle
        cursor move
        width 375px
        // height px
        right 20px
        border-radius 5px
        box-shadow 1px 2px 3px 3px #eee
        background: rgba(238, 233, 233, .9)
        top 5%
        // transform translate3d(-50%, -50%, 0)
        &.middle-enter-active, &.middle-leave-active
            transition: all .4s
        &.middle-enter, &.middle-leave-to
            right 0
            opacity 0
        .progress-wrapper
            display: flex
            align-items: center
            width: 88%
            margin: 0px auto
            padding: 10px 0
            .time
                color: $color-text
                font-size: $font-size-small
                flex: 0 0 30px
                line-height: 30px
                width: 30px
                &.time-l
                    text-align: left
                &.time-r
                    text-align: right
            .volume
                margin-left 10px
                position relative
                cursor pointer
                width 18px
                [class^="icon2-"], [class*=" icon2-"] 
                    font-size 18px
            .progress-bar-wrapper
                flex: 1
                margin 0 5px
        .operators
            display: flex
            align-items: center
            .icon
                flex: 1
                color: $color-theme
                cursor pointer
                transition all .3s
                &.disable
                    color: $color-theme-d
                i
                    font-size: 30px
                    &:hover
                        color $color-theme-d
            .i-left
                text-align: right
            .i-center
                padding: 0 20px
                text-align: center
                i
                    font-size: 40px
            .i-right
                text-align: left
                .icon2-enlarge
                    font-size 24px
            .mt-4
                margin-top -4px
            .icon-favorite
                color: $color-sub-theme
    &.full-screen
        width 100%
        height 100%
        top 0!important
        left 0!important
        right 0
        bottom 0
        background: #000
        color #fff
        // transition all .4s
        // &.full-screen-enter-active, &.full-screen-leave-active
        //     transition: all .4s
        // &.full-screen-enter, &.full-screen-leave-to
        //     opacity 0
        .background
            position: absolute
            left: 0
            top: 0
            width: 100%
            height: 100%
            z-index: -1
            opacity: 0.5
            filter: blur(20px)
        .progress-wrapper
            display: flex
            align-items: center
            position absolute
            bottom 20px
            left 5%
            width 55%
            .time
                color: #fff
                font-size: $font-size-small
                flex: 0 0 30px
                line-height: 30px
                width: 30px
                &.time-l
                    text-align: left
                &.time-r
                    text-align: right
            .volume
                margin-left 10px
                position relative
                cursor pointer
                width 18px
                [class^="icon2-"], [class*=" icon2-"] 
                    font-size 20px
            .progress-bar-wrapper
                flex: 1
                margin 0 5px
        .operators
            position absolute
            bottom 20px
            left 60%
            width 35%
            display: flex
            align-items: center
            .icon
                flex: 1
                color: $color-theme
                cursor pointer
                transition all .3s
                &.disable
                    color: $color-theme-d
                i
                    font-size: 36px
                &:hover
                    color $color-theme-d
            .i-left
                text-align: right
            .i-center
                padding: 0 20px
                text-align: center
                i
                    font-size: 44px
            .i-right
                text-align: left
                .icon2-enlarge
                    font-size 24px
            .mt-4
                margin-top -4px
            .icon-favorite
                color: $color-red-l
        .middle-wrapper
            display flex
            height 75%
            margin-top 5%
            padding 0 60px
            .left
                flex 1.5
                height 100%
                
            .right
                flex 1
                display flex
                justify-content center
                .top-image
                    width 200px 
                    height 200px
                    margin 0 auto
                .desc
                    margin-top 10px
                    line-height 22px
                    text-align center
                    color: $color-text-ll
                    font-size: $font-size-medium
                .scroll
                    height 300px
                    overflow hidden
                    margin-top 20px
                    cursor pointer
                    .lyric-wrapper
                        cursor pointer
                        overflow hidden
                        text-align center
                        .text
                            line-height: 32px
                            color: $color-text-ll
                            font-size: $font-size-medium
                            &.current
                                color: $color-theme
                                font-weight bold
                                font-size $font-size-medium-x
</style>
