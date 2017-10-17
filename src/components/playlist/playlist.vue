<template>
    <transition name="list-fade">
        <div class="playlist" @click="hide" v-show="showPlaylist">
            <!-- 点击事件会冒泡，在这里阻止掉冒泡 -->
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <!-- <i class="icon" :class="iconMode" @click="changeMode"></i> -->
                        <span class="text">{{modeText}}/
                            <span class="number">当前添加了{{sequencelist.length}}首歌曲</span>
                        </span>
                        <span class="clear" @click="showConfirm">
                            <i class="icon-clear"></i>
                        </span>
                    </h1>
                </div>
                <div class="my-scroll" v-bar="{
                                preventParentScroll: true,
                                scrollThrottle: 30,
                            }">
                    <transition-group ref="list" name="list" tag="ul" class="list-content">
                        <li :key="item.id" class="item" v-for="(item,index) in sequencelist" @click="selectItem(item,index)">
                            <i class="current" :class="getCurrentIcon(item)"></i>
                            <span class="text" :class="getCurrentName(item)">{{item.name}}</span>
                            <span @click.stop="toggleFavorite(item)" class="like">
                                <i :class="getFavoriteIcon(item)"></i>
                            </span>
                            <span @click.stop="deleteOne(item)" class="delete">
                                <i class="icon-delete"></i>
                            </span>
                        </li>
                    </transition-group>

                </div>

            </div>
            <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
            
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { playMode , favoriteType} from 'common/js/config'
import Confirm from 'base/confirm'

import { favoriteMixin } from 'common/js/mixin'

export default {
    mixins: [favoriteMixin],
    created() {
        this.scrollPos = 0
    },
    computed: {
        modeText() {
            return this.playMode === playMode.sequence ? '顺序播放' : this.playMode === playMode.random ? '随机播放' : '单曲循环'
        },
        iconMode() {
            return this.playMode === playMode.sequence ? 'icon-sequence' : this.playMode === playMode.loop ? 'icon-loop' : 'icon-random'
        },
        ...mapGetters([
            "sequencelist",
            "playlist",
            "currentSong",
            "playMode",
            "showMode",
            "playing",
            "currentIndex",
            "showPlaylist"
        ])
    },
    methods: {
        hide() {
            this.$refs.confirm.hide()
        },
        showConfirm() {
            this.$refs.confirm.show()
        },
        confirmClear() {
            this.deleteSongList()
            this.setShowPlaylist(false)
            this.hide()
        },
        //当前播放的icon显示 
        getCurrentIcon(item) {
            if (this.currentSong.id === item.id) {
                return 'icon-play'
            }
            return ''
        },
        getCurrentName(item) {
            if (this.currentSong.id === item.id) {
                return 'name-current'
            }
            return ''
        },
        selectItem(item, index) {
            if (this.playMode === playMode.random) {
                index = this.playlist.findIndex((song) => {
                    return song.id === item.id
                })
            }
            this.setCurrentIndex(index)
            this.setPlayingState(true)
        },
        //删除 
        deleteOne(item) {
            this.deleteSong(item)
            if (!this.playlist.length) {
                this.hide()
                this.setShowPlaylist(false)
            }
        },
        
        initFavoriteType(){
            this.favoriteType = favoriteType.song
        },
        ...mapActions([
            'deleteSong',
            'deleteSongList'
        ]),
        ...mapMutations({
            setPlayMode: 'SET_PLAY_MODE',
            setPlaylist: 'SET_PLAYLIST',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayingState: 'SET_PLAYING_STATE',
            setShowPlaylist: 'SET_SHOW_PLAYLIST'
        }),
    },
    watch: {
        currentSong(newSong, oldSong) {
            if (newSong.id === oldSong.id) {
                return
            }
            let el = this.$refs.list.$el
            let height = el.clientHeight
            let index = this.currentIndex
            // 找出上一首歌的位置
            let lastIndex = this.sequencelist.findIndex((item) => {
                return item.id === oldSong.id
            })
            // 找准随机播放的歌曲位置
            if (this.playMode === playMode.random) {
                index = this.sequencelist.findIndex((item) => {
                    return item.id === newSong.id
                })
            }
            // 40是单条列表高度
            let top = index * 40
            // 两个位置越远，滚动速度越快，避免差距太大的时候，滚动太久，体验不好
            let speed = Math.abs(index - lastIndex) * 5
            // 方向
            let rspeed = top < this.scrollPos ? -speed : speed

            clearInterval(this.timer)
            setTimeout(() => {
                // 滚动的动画
                this.timer = setInterval(() => {
                    if (Math.abs(this.scrollPos - top) < 10) {
                        clearInterval(this.timer)
                        this.scrollPos = top
                    } else {
                        this.scrollPos += rspeed
                    }
                    el.scrollTop = this.scrollPos
                }, 30)

            }, 20)
        }
    },
    components: {
        Confirm
        // AddSong
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
@import "~common/stylus/scrollbar"
.playlist
    position: fixed
    right: 20px
    top 0
    width 325px
    height 100%
    z-index: 200
    border-radius 5px 
    &.list-fade-enter-active, &.list-fade-leave-active
        transition: opacity 0.4s
        .list-wrapper
            transition: all 0.4s
    &.list-fade-enter, &.list-fade-leave-to
        opacity: 0
        .list-wrapper
            transform: translate3d(100%, 0, 0)
    .list-wrapper
        position: absolute
        left: 0
        top: 50%
        transform translateY(-50%)
        width: 100%
        height 70%
        .list-header
            position: absolute
            padding: 20px 30px 10px 20px
            background rgba(238, 233, 233, .9)
            z-index 2
            left 0
            right 0
            border-radius 12px 12px 0 0 
            .title
                display: flex
                align-items: center
            .icon
                margin-right: 10px
                font-size: 30px
                color: $444
            .text
                flex: 1
                font-size: $font-size-medium
                color: #444
                .number
                    font-size $font-size-small
                    font-size #999
            .clear
                extend-click()
                .icon-clear
                    font-size: $font-size-medium
                    color: #444
                    cursor pointer
        .my-scroll
                width 100%
                height 100%
                background-color: rgba(238, 233, 233, .9)
                top 46px
                border-radius 0 0 12px 12px 
            .list-content
                height: 100%
                z-index 1
                .item
                    display: flex
                    align-items: center
                    height: 40px
                    padding: 0 30px 0 20px
                    cursor pointer
                    &.list-enter-active, &.list-leave-active
                        transition: all 0.1s
                    &.list-enter, &.list-leave-to
                        height: 0
                    .current
                        flex: 0 0 20px
                        width: 20px
                        font-size: $font-size-medium-x
                        color: $color-theme
                    .text
                        flex: 1
                        no-wrap()
                        font-size: $font-size-medium
                        color: #444
                        &.name-current
                            color #222
                            font-size $font-size-medium-x
                    .like
                        extend-click()
                        margin-right: 15px
                        font-size: $font-size-medium
                        color: $color-theme
                        .icon-favorite
                            color: $color-sub-theme
                    .delete
                        extend-click()
                        font-size: $font-size-medium
                        color: $color-theme
   


</style>