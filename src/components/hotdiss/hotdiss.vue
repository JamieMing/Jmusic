<template>
    <div class="hotdiss" @mouseenter="enter" @mouseleave="out" ref="hotdiss">
        <h3 class="title">热门歌单</h3>
        <div class="slider">
            <div class="wrapper" :style="transform" ref="wrapper">

                <div class="item" :class="{'dark':index%2==0, 'active': index == activeIndex}" v-for="(item, index) in data" :key="index" @mouseenter="addGreenBg(index)">
                    <div class="img" @click="selectItem(item)">
                        <img v-lazy="item.imgurl" alt="">
                        <div class="fitler" v-show="index == activeIndex">
                            <span class="icon-play" @click.stop="playDisc(item)"></span>
                        </div>
                    </div>
                    <div class="desc">
                        <p class="dissname" @click="selectItem(item)" v-html="item.dissname"></p>
                        <p class="listennum">播放量：{{item.listennum}}</p>
                    </div>
                </div>
            </div>

        </div>
        <dots :data="realLength" @btnClick="move" :realIndex="realIndex" class="dots"></dots>
        <arrow :showArrow="showArrow" @prev="prev" @next="next"></arrow>
    </div>
</template>

<script>
import Dots from 'base/lunbo-dots'
import Arrow from 'base/arrow'
import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { fixedMouse } from 'common/js/util'
import { mapMutations, mapActions } from 'vuex'
import { showMode } from 'common/js/config'
export default {
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            activeIndex: -1,
            currentIndex: 0,
            delay: 4000,
            translate: '0',
            isAnimation: true,
            transition: 'all .6s',
            realLength: 0, //真实长度
            realIndex: 1,//真实索引
            showArrow: false
        }
    },
    computed: {
        // 动态style
        transform() {
            return {
                left: this.translate,
                transition: this.transition
            }
        }
    },
    watch: {
        'isAnimation': function(val, oldVal) {
            this.transition = val ? 'all .6s' : 'none'
        },
        'currentIndex': function(val, oldVal) {
            this.realIndex = (val == this.realLength ? 0 : val) + 1
        }
    },
    created() {
        // 构建重复的数组，便于滚动
        this.data.splice(12, this.data.length - 12)
        this.data.push(...this.data.slice(0, 4))

        this.len = this.data.length / 4
        this.realLength = this.len - 1
        // this.setTimer()
        this.timer = setInterval(() => {
            this.main(1)
        }, this.delay)

    },
    methods: {
        ...mapMutations({
            setDisc: 'SET_DISC'
        }),
        // ...mutations({
        //     setDisc: 'SET_DISC'
        // }),
        addGreenBg(index) {
            this.activeIndex = index
        },
        selectItem(item) {
            this.$router.push({
                path: `/music/disc/${item.dissid}`
            })
            // this.setDisc(item)
        },
        move(i) {
            this.currentIndex = i - 1
            this.isAnimation = true
            this.translate = `${-this.currentIndex * 100}%`
        },
        //轮播移动
        main(dir) {
            if (this.currentIndex >= this.realLength) {
                this.currentIndex = 0

            }
            if (this.currentIndex <= 0) {
                if (dir == 1) {
                    this.isAnimation = false
                    this.translate = '0'
                    // console.log(this.$refs.wrapper.offsetHeight)
                    this.currentIndex = 1
                } else {
                    this.isAnimation = false
                    this.translate = `${-this.realLength * 100}%`

                    this.currentIndex = this.realLength - 1
                }

            } else {
                this.currentIndex += dir
            }
            this.$nextTick(() => {
                this.isAnimation = true
                this.translate = `${-this.currentIndex * 100}%`
            })

        },
        // setTimer(e) {
        //     e = e || window.event
        //     let target = this.$refs.hotdiss

        //     if (fixedMouse(e, target)) {
        //         this.showArrow = false
        //         this.timer = setInterval(() => {
        //             this.main(1)
        //         }, this.delay)
        //         this.activeIndex = -1
        //     }

        // },
        out(){
            this.showArrow = false
                this.timer = setInterval(() => {
                    this.main(1)
                }, this.delay)
                this.activeIndex = -1
        },
        enter(){
            this.showArrow = true
            clearInterval(this.timer)
        },
        // clearTimer(e) {
        //     e = e || window.event
        //     let target = this.$refs.hotdiss
        //     if (fixedMouse(e, target)) {
        //         this.showArrow = true
        //     }

        //     clearInterval(this.timer)
        // },
        prev() {
            this.main(-1)
        },
        next() {
            this.main(1);
        },
        // 直接全屏播放歌曲
        playDisc(item) {
            this._getSongList(item.dissid)
        },
        _getSongList(id) {
            getSongList(id).then((res) => {
                if (res.code === ERR_OK) {
                    this.playAll( this._normalizeSongs(res.cdlist[0].songlist) )
                    this.setShowMode(showMode.fullScreen)
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
        ...mapMutations({
            setShowMode: 'SET_SHOW_MODE',
        }),
        ...mapActions([
            "playAll"
        ])
    },
    components: {
        Dots,
        Arrow
    }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.hotdiss
    position relative
    padding-top 40px
    padding-bottom 20px
    overflow hidden
    .title
        font-size 40px
        padding-bottom 20px
        text-align center
    .slider
        position relative
        width 1200px
        margin 20px auto 10px
        height 465px
        overflow hidden
        .wrapper
            left 0
            position absolute
            width 6000px
            // margin-left -100%
            height 100%
            overflow hidden
            .item
                float left
                width 300px
                color #fff
                background rgba(0, 0, 0, .8)
                .img
                    overflow hidden
                    position relative
                    .fitler
                        position absolute
                        top 0
                        left 0
                        width 100%
                        height 100%
                        background $color-background-d
                        z-index 1 
                        text-align: center;
                        line-height: 300px;
                        .icon-play
                            font-size 48px
                            font-weight bold
                    img 
                        transform-origin 50% 50%
                        transition all .5s
                        scale(1)
                &.dark 
                    background #414141
                &.active
                    background $color-theme
                    .img
                        img 
                            transform scale(1.1)
                .img
                    width 100%
                    height 300px
                    cursor pointer
                .desc
                    height 160px
                    .dissname
                        padding-top 55px
                        padding-left 5px
                        width 210px
                        margin 0 auto
                        no-wrap()
                        cursor pointer
                    .listennum
                        padding-top 10px
                        font-size 15px
                        color $color-text-l
                        vertical-align top
                        text-align center



    
</style>

