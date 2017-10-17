<template>
    <transition name="fade">
        <div class="album">
            <div class="main">
                <!-- 导航，标签栏 -->
                <div class="nav-container" v-if="showNav">
                    <!-- 标签 -->
                    <div class="tag" v-for="(tag, key) in tags.one" :key="key">
                        <ul>
                            <li class="tag-item tagName">{{getTagName(key)}}</li>
                            <li class="tag-item" v-for="(item, _index) in tag" :key="_index" @click="selectTag(key, item.id)">
                                <span :class="{'current': isCurrent(key, item.id)}">{{item.name}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="tag">
                        <li class="tag-item">筛选</li>
                        <li class="tag-item two-tag-box" v-for="(tag, key) in tags.two" :key="key">
                            <span @click.stop="showPop(key)" :class="{'current': popFlag[key]}">{{getTagName(key)}}</span>
                            <transition name="pop">
                                <div class="pop" v-show="popFlag[key]">
                                    <ul>
                                        <li class="tag-item" v-for="(item, _index) in tag" :key="_index" @click="selectTag(key, item.id)">
                                            <span :class="{'current': isCurrent(key, item.id)}">{{item.name}}</span>
                                        </li>
                                    </ul>
                                </div>
                            </transition>
                        </li>
                    </div>
                </div>
                <!-- 选择的标签 -->
                <div class="tool">
                    <div class="choicedTags">
                        <transition-group name="choicedTagBox">
                            <div class="item" v-for="item in choicedTags" :key="item.id">
                                <span>{{getChoicedTagName(item)}}</span>
                                <span class="icon-delete" @click="deleteTag(item)"></span>
                            </div>
                        </transition-group>

                    </div>
                    <div class="sort">
                        <div class="item" @click="selectSortType(_orderType.new)" :class="{'current': params.sort == _orderType.new}">最新</div>
                        <div class="item" @click="selectSortType(_orderType.hot)" :class="{'current': params.sort == _orderType.hot}">最热</div>
                    </div>
                </div>
                <!-- 歌单列表 -->
                <transition name="listfade">
                    <div class="list" v-if="albumlist.length">
                        <ul>
                            <li class="item" v-for="(item, index) in albumlist" :key="index">
                                <div class="inner">
                                    <div class="img-box" @click="selectItem(item)" @mouseenter="iconShow(index)" @mouseleave="iconDiss(index)" ref="imgBox">
                                        <img v-lazy="getAlbumPic(item)" alt="" class="img" :class="{'active':index == overIndex}">
                                        <transition name="iconPlay">
                                            <div class="fitler" v-show="overIndex == index">
                                                <span class="icon-play" @click.stop="playAlbum(item)"></span>
                                            </div>
                                        </transition>

                                    </div>
                                    <div class="desc">
                                        <p class="dissname">
                                            <router-link :to="{name: 'AlbumInfo', params:{mid: item.album_mid}}" tag="a" v-html="item.album_name"></router-link>
                                        </p>
                                        <p class="singers">
                                            <router-link :to="{name:'SingerInfo', params:{mid: _item.singer_mid}}" tag="a" v-html="_index == item.singers.length-1? _item.singer_name: _item.singer_name+' • ' " v-for="(_item,_index) in item.singers" :key="_item.id"></router-link>
                                        </p>
                                        <p class="time">{{item.public_time}}</p>
                                    </div>
                                </div>

                            </li>
                        </ul>
                    </div>
                </transition>

                <loading v-show="!albumlist.length"></loading>
                <div class="page-contai">
                    <page :currentPage="Number(params.page)+1" @pageChange="pageChange" :showNumbers="pageBtnNums" :totalNumber="totalPages"></page>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import { getAlbumList } from 'api/album'
import { tagNames } from './tagNames'
import { ERR_OK } from 'api/config'
import { event } from 'common/js/dom'
import { orderType } from 'common/js/config'
import { fixedMouse } from 'common/js/util'
import Loading from 'base/loading'
import { getAlbumInfo } from 'api/album'
import { mapMutations, mapActions } from 'vuex'
import { createSong } from 'common/js/song'
import { showMode } from 'common/js/config'
import Page from 'base/page'
// import InfoPop from 'base/info-pop'
export default {
    data() {
        return {
            params: { page: 0, sort: 1, language: -1, genre: 0, year: 1, pay: 0, type: -1, company: -1, cmd: 'firstpage' },
            tags: {
                one: {},//分为两个部分
                two: {}
            },
            //折叠的几个标签 
            popFlag: {
                company: false,
                type: false,
                year: false
            },
            albumlist: [],
            isFirstRequest: true,
            overIndex: -1,
            sum: 0,
            pagesize: 20 //请求的时候就是固定的了
        }
    },
    computed: {
        choicedTags() {
            let ret = []
            for (let key in this.params) {
                if (key == 'cmd' || key == 'sort') continue;
                if (this.originParams[key] != this.params[key]) {
                    ret.push({
                        tag: key,
                        id: this.params[key]
                    })
                }
            }
            return ret
        },
        tagsArray() {
            return { ...this.tags.one, ...this.tags.two }
        },
        _orderType() {
            return orderType
        },
        // 保持分类选择栏的显示
        showNav() {
            return this.tags.one.hasOwnProperty('language')
        },
        pageBtnNums() {
            return this.totalPages < 5 ? this.totalPages : 5
        },
        totalPages() {
            return Math.ceil(this.sum / this.pagesize)
        }
    },
    created() {
        // 保留原始的参数
        this.originParams = JSON.parse(JSON.stringify(this.params))
        // 请求方式的不同
        if (this.$route.query.hasOwnProperty('page')) {
            this.params = this.$route.query
            if (this.isFirstRequest) {
                this.params.cmd = 'firstpage'
            }
        }
        this._getAlbumList()
    },
    methods: {
        _getAlbumList() {
            getAlbumList(this.params).then((res) => {
                if (ERR_OK === res.code) {
                    // 解构赋值
                    if (this.isFirstRequest) {
                        this.tags = this.buildTags(res.data.tag)
                        this.params.cmd = 'get_album_info'
                        this.isFirstRequest = false
                    }
                    // 歌单数据
                    this.albumlist = res.data.albumlist
                    // 分页
                    this.sum = res.data.sum
                }
            })
        },
        // 构建符合页面结构的标签分类数据
        buildTags(data) {
            let one = {}, two = {};
            ({
                language: one.language,
                genre: one.genre,
                pay: one.pay,
                type: two.type,
                year: two.year,
                company: two.company
            } = data);
            two.type.flag = false
            two.year.flag = false
            two.company.flag = false
            return { one, two }
        },
        // 标签类别名
        getTagName(key) {
            return tagNames[key]
        },
        // 获取被选择的标签
        getChoicedTagName(item) {
            let tagObj = this.tagsArray[item.tag]
            for (let index in tagObj) {
                if (tagObj[index].id == item.id) {
                    return tagObj[index].name
                }
            }
        },
        // 是否选择该标签
        isCurrent(key, id) {
            return this.params[key] == id
        },
        showPop(key) {
            // 遍历键名
            for (let _key in this.popFlag) {
                if (_key != key) {
                    this.popFlag[_key] = false
                } else {
                    this.popFlag[_key] = true
                }
            }
            let handler = event.addEvent(document, 'click', ()=>{
                this.popFlag[key] = false
                event.removeEvent(document, 'click', handler)
            })
        },
        selectTag(key, id) {
            // 拷贝一个副本
            let _params = JSON.parse(JSON.stringify(this.params))
            _params[key] = id
            this.params = _params
        },
        deleteTag(item) {
            let _params = JSON.parse(JSON.stringify(this.params))
            _params[item.tag] = this.originParams[item.tag]
            this.params = _params
        },
        selectSortType(type) {
            if (type == this.params.sort) return
            let _params = JSON.parse(JSON.stringify(this.params))
            _params.sort = type
            this.params = _params
        },
        getAlbumPic(item) {
            return `//y.gtimg.cn/music/photo_new/T002R300x300M000${item.album_mid}.jpg?max_age=2592000`
        },
        // 列表
        selectItem(item) {
            this.$router.push({
                path: `/music/albuminfo/${item.album_mid}`
            })
        },
        //直接播放 
        playAlbum(item){
            this._getSongList(item.album_mid)
        },
        _getSongList(id) {
            getAlbumInfo(id).then((res) => {
                if (res.code === ERR_OK) {
                    this.playAll( this._normalizeSongs(res.data.list) )
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
        iconShow(index) {
            this.overIndex = index
        },
        iconDiss(index) {
            this.overIndex = -1
        },
        pageChange(page) {
            let _params = JSON.parse(JSON.stringify(this.params))
            _params.page = page - 1
            this.params = _params
        },
        ...mapMutations({
            setShowMode: 'SET_SHOW_MODE',
        }),
        ...mapActions([
            "playAll"
        ])
    },
    watch: {
        params(val) {
            this.albumlist = []
            this.$router.push({ path: '/music/album', query: val })
            this._getAlbumList()
        }
    },
    components: {
        Loading,
        Page
    }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
.album
    width: 100%;
    min-height: 900px
    position: relative;
    top: 0;
    z-index: 100;
    opacity 1
    background #F5F5F5
    &.fade-enter-active, &.fade-leave-active
        transition all .3s
    &.fade-enter, .fade-leave-to
        opacity 0
    .main
        width 1200px
        margin 0 auto 20px
        .nav-container
            position relative
            // height 180px
            padding 40px 0 0 40px
            .tag
                position relative
                &:after
                    content ''
                    display block
                    clear both
            .tag-item
                float left
                height 24px
                padding-right 26px
                padding-bottom 15px
                line-height 36px
                color #333
                font-size 14px
                cursor pointer
            
                span
                    padding 6px
                    &:hover
                        background #ddd
            .two-tag-box
               
                .pop
                    position absolute
                    padding 10px 20px 
                    // width 500px
                    top 36px
                    left 0px
                    right 0
                    background #fff
                    z-index 200
                    border-radius 5px
                    box-shadow 0px 0px 2px 2px #ddd     
                    &.pop-enter-active, &.pop-leave-active
                        transition all .5s
                    &.pop-enter, &.pop-leave-to
                        opacity 0
                        transform scale(.6)
            .current
                background $color-theme!important
                color #fff
        .tool
            height 44px
            padding 0 20px 0 40px
            overflow hidden
            .choicedTags
                float left
                height 100%
                position relative
                .item
                    float left
                    padding-left 10px
                    padding-right 10px
                    height 42px
                    margin-right 10px
                    line-height 44px
                    font-size 14px
                    background #fff
                    border 1px solid #ddd
                    transition all .6s
                    &:hover
                        background $color-theme 
                        color #fff    
                    // &.choicedTagBox-move
                    //     transition all .6s
                    &.choicedTagBox-leave-active
                        position absolute
                        top 0
                        left 50%
                        z-index 10
                    &.choicedTagBox-enter, &.choicedTagBox-leave-to
                        opacity 0
                        transform translateY(-30px)
                    .icon-delete 
                        margin-left 3px
                        padding 2px
                        color #fff
                        font-size 12px 
                        transform scale(0.8)
                        border-radius 50%
                        background #fff
                        cursor pointer
                        &:hover
                             background #eee
                             color $color-theme-m
                            // transform scale(1.1)
            .sort
                float right
                height 100%
                .item
                    float left
                    margin-left -1px
                    height 42px
                    width 60px
                    text-align center
                    // margin-right 20px
                    line-height 44px
                    font-size 14px
                    background #fff
                    border 1px solid #ddd
                    transition all .4s
                    cursor pointer
                    &:hover
                       color $color-theme
                    &.current
                        background $color-theme 
                        color #fff 
        .list
            overflow hidden
            padding 20px 20px 0
            &.listfade-enter-active, &.listfade-leave-active
                transition all .6s
            &.listfade-enter, &.listfade-leave-to
                opacity 0
            ul
                margin-right -20px
                .item
                    float left
                    width 20%
                    color #333
                    // background #fff
                    .inner
                        margin-right 20px
                        .img-box
                            overflow hidden
                            position relative
                            .fitler
                                position absolute
                                top 0
                                left 0
                                width 100%
                                height 100%
                                z-index 1 
                                background rgba(0, 0, 0, .2)
                                .icon-play
                                    position absolute
                                    top 50%
                                    left 50%
                                    margin-top -24px
                                    margin-left -24px
                                    color #fff
                                    font-size 48px
                                    font-weight bold
                                    cursor pointer
                                &.iconPlay-enter-active
                                    transition all .4s
                                    .icon-play
                                        transition all .4s
                                &.iconPlay-enter, &.iconPlay-leave-to
                                    // opacity 0
                                    .icon-play
                                        opacity 0
                                        // font-size 12px
                                        transform scale(0)
                                        
                                    
                            .img 
                                width 100%
                                height 100%
                                transform-origin 50% 50%
                                transition all .5s
                                &.active 
                                    transform scale(1.1)
                        .desc
                            height 100px
                            margin-bottom 15px
                            line-height 22px
                            .dissname
                                padding-top 10px
                                max-height 44px
                                font-size 14px
                                color #222
                                overflow hidden
                                // width 210px
                                // margin 0 auto
                                // no-wrap()
                                cursor pointer
                                a
                                    color #222
                                    font-size 14px
                                    &:hover
                                        color $color-theme
                            .singers
                                a
                                    color #999
                                    font-size 14px
                                    &:hover
                                        color $color-theme
                            .time
                                color #999
                                font-size 14px
</style>
