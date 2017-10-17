<template>
    <div class="rank-nav" >
        <h3 class="title">排行榜</h3>
        <div class="toAll">
            <span @click="toAll"> 全部
                <i>></i>
            </span>
        </div>
        <div class="wrapper" @mouseenter="clearTimer" @mouseleave="setTimer" ref="wrapper">
            <div class="toplist-item" v-for="(item, index) in data" :key="item[0].topID" :style="getBgColor(index)" @mouseenter="addBg(index)" @mouseleave="removeBg(index)" ref="listItem">

                <h3 @click="selectToplist(item)">
                    <div class="toplist-tit1">{{getTit(item[0].listName)[0] }} </div>
                    <div class="toplist-tit2" :class="{'min-font':letTitleMin}">{{getTit(item[0].listName)[1] }} </div>
                </h3>
                <transition name="line">
                    <div class="line" v-show="index != activeIndex"></div>
                </transition>

                <transition name="iconPlay">
                    <div class="icon-play" v-show="index == activeIndex" @click="playRank(item)"></div>
                </transition>

                <ul class="song-list">
                    <li class="song-item" v-for="(song, _index) in item.songlist" :key="song.data.songid">
                        <div class="songName">
                            <span>{{_index+1}}&nbsp;</span>
                            <router-link :to="{name:'SingleSong', params:{mid: song.data.songmid}}" tag="a" v-html="song.data.songname"></router-link>
                        </div>
                        <div class="singerName">
                            <router-link :to="{name:'SingerInfo', params:{mid: item.mid}}" tag="a" v-html="index == song.data.singer.length-1? item.name: item.name+' • ' " v-for="(item,index) in song.data.singer" :key="item.id"></router-link>

                        </div>
                    </li>
                </ul>
            </div>

        </div>

    </div>
</template>

<script>
import { fixedMouse, getColor } from 'common/js/util'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { getToplist } from 'api/toplist'
import { createSong } from 'common/js/song'
import { showMode } from 'common/js/config'
export default {
    props: {
        cateNumber: {
            type: Number,
            default: 5
        },
        toplistCate:{
            type: Array,
            default: ()=>{
                return []
            }
        }
    },
    data() {
        return {
            cates: [],
            colorArr: [],
            data: [],
            activeIndex: -1,
            letTitleMin: false //长度过了，把字体缩小
        }
    },
    created() {
        for (let i = 0; i <= this.cateNumber * 3 + 1; i++) {
            this.colorArr.push(getColor());
        }
        this.timer = setInterval(this.colorTimer, 5000)
        // 存储排行榜的分类id
        this.initIDs()

    },
    methods: {

        initIDs() {
            // //    异步的， 会调用两次，阻隔一次无效的数据
            // if (!this.toplistCate[0]) {
            //     return
            // }
            //   转化为真正的数组 
            let list = Array.from(this.toplistCate)[0].List
            list.forEach((item) => {
                // 去掉mv榜，那个没数据
                if (item.topID == 201) {
                    return
                }
                this.cates.push({
                    topID: item.topID,
                    listName: item.ListName
                })    
            })
            this._getToplist()
        },
        _getToplist() {
            let _cates = this.cates.slice()
            // 随机从各排行榜抽取若干份
            for (let i = 0; i < this.cateNumber; i++) {
                let index = Math.floor(Math.random() * _cates.length)
                let topInfo = _cates.splice(index, 1)
                // 分别取数据
                getToplist(topInfo[0].topID, 0, 4).then((res) => {

                    // 组合所需数据
                    let item = Object.assign({}, topInfo, {
                        songlist: res.songlist
                    })
                    this.data.push(item)
                })
            }
        },
        // 标题处理
        getTit(listname) {
            let titles = listname.split('·')
            if (titles.length > 2) {
                titles.shift()
            }
            if (titles[1].length > 3) {
                this.letTitleMin = true
            }
            return titles
        },
        // 歌手名可能有多，需要拼接
        getSingerName(singerArr) {
            let ret = ''
            singerArr.forEach((item, index) => {
                ret += item.name + (index != singerArr.length - 1 ? ' • ' : '')
            })
            return ret
        },
        // 自动换背景颜色
        colorTimer() {
            this.colorArr = this.colorArr.map(() => {
                return getColor()
            })
        },
        getBgColor(index) {
            return {
                background: this.colorArr[index * 4]
            }
        },
        // 鼠标离开，设置定时器
        setTimer(e) {
            this.timer = setInterval(this.colorTimer, 5000)
        },
        clearTimer(e) {
            clearInterval(this.timer)
        },
        // 鼠标悬浮
        addBg(index, e) {
            this.activeIndex = index
        },
        //鼠标离开
        removeBg(index, e) {
            this.activeIndex = -1
        },
        selectToplist(item) {
            this.$router.push({
                path: `/music/rank/${item[0].topID}`
            })
        },
        toAll(){
            this.$router.push({
                path: `/music/rank/4`
            })
        },
        playRank(item) {
            this._getToplistAndPlay(item[0].topID)
        },
        // 直接播放，跳全屏
        _getToplistAndPlay(id) {
            getToplist(id, 0, 30).then((res) => {

                this.playAll(this._normalizeSong(res.songlist))
                this.setShowMode(showMode.fullScreen)
            }).catch((e) => {
                console.log(e);
            })
        },
        // 封装song对象
        _normalizeSong(list) {
            let ret = []
            list.forEach((item) => {
                let song = createSong(item.data);
                ret.push(song)
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
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.rank-nav
    position relative
    width 100%
    padding-top 40px
    color #fff
    .title
        // position relative
        // top 80px
        color $color-text
        font-size 36px
        text-align center
        
    .toAll 
        // position relative
        // top 100px
        width 1200px
        margin 20px auto
        color $color-text
        text-align right
        cursor pointer
        
    .wrapper
        position relative
        // top 128px
        display flex
        width 1200px
        margin 0 auto 
        height 530px
        overflow hidden
        border-radius 5px
         
        .toplist-item
            flex 1
            position relative
            display flex
            justify-content center
            padding 40px 50px
            z-index 2
            transition: all .8s ease-in-out
            h3
                text-align center
                cursor pointer
                .toplist-tit1
                    font-size 24px
                    font-weight 200
                    padding-bottom 10px
                .toplist-tit2
                    font-size 36px
                .min-font
                    font-size 28px
            .line
                position absolute
                top 35%
                left 50%
                margin-left -25px
                width 50px
                height 1px
                background $color-text-ll
                &.line-enter-active, &.line-leave-active
                    transition all .4s
                &.line-enter, &.line-leave-to
                    width 0
                    margin-left 0 
            .icon-play
                // display none
                position absolute
                top 35%
                left 50%
                margin-top -22px
                margin-left -22px
                font-size 45px
                text-align center
                cursor pointer
                transform  scale(1)
                &.iconPlay-enter-active, &.iconPlay-leave-active
                    transition all .4s
                &.iconPlay-enter, &.iconPlay-leave-to
                    transform scale(0)
            .song-list
                position absolute
                top 50%
                font-weight bold
                .song-item
                    height 45px
                    width 200px
                    margin-bottom 10px
                    
                    .songName
                        vertical-align top
                        font-size 18px
                        padding-bottom 5px
                        span
                            display inline-block
                            vertical-align bottom
                        a
                            display inline-block
                            width 88%
                            color #fff
                            no-wrap()    
                            cursor pointer
                            vertical-align bottom
                            &:hover
                                color $color-theme
                    .singerName
                        padding-left 20px
                        color $color-text-ll
                        font-size 14px
                        cursor pointer
                        
                        a
                            color #fff
                            no-wrap()
                            &:hover
                                color $color-theme
       
</style>

