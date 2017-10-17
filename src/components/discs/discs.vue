<template>
    <transition name="fade">
        <div class="discs">
            <div class="main">
                <!-- 导航，标签栏 -->
                <div class="nav-container" v-if="categories.length">
                    <!-- 标签 -->
                    <div class="tag" v-for="(item, key) in categories" :key="key">
                        <div class="tag-item tagName">{{item.categoryGroupName}}</div>
                        <ul>
                            <li class="tag-item" v-for="(_item, _index) in item.items" :key="_index" @click="selectCategory( _item.categoryId)">
                                <span :class="{'current': isCurrent(_item.categoryId)}" v-html="_item.categoryName"></span>
                            </li>
                        </ul>
                    </div>

                </div>
                <!-- 选择的标签 -->
                <div class="tool" v-if="categories.length">
                    <div class="choicedTags" v-if="choicedCate">
                        <transition name="choicedTagBox">
                            <div class="item">
                                <span>{{choicedCate.categoryName}}</span>
                                <span class="icon-delete" @click="deleteTag"></span>
                            </div>
                        </transition>

                    </div>
                    <div class="sort">
                        <div class="item" @click="selectSortType(item.sortId)" :class="{'current': params.sortId == item.sortId}" v-for="(item, index) in sorts.items[0].allsorts" :key="index">{{item.sortName}}</div>
                    </div>
                </div>
                <!-- 歌单列表 -->
                <transition name="listfade">
                    <div class="list" v-if="discslist.length">
                        <ul>
                            <li class="item" v-for="(item, index) in discslist" :key="index">
                                <div class="inner">
                                    <div class="img-box" @click="selectItem(item)" @mouseenter="iconShow(index, $event)" @mouseleave="iconDiss(index, $event)" ref="imgBox">
                                        <img v-lazy="item.imgurl" alt="" class="img" :class="{'active':index == overIndex}">
                                        <transition name="iconPlay">
                                            <div class="fitler" v-show="overIndex == index">
                                                <span class="icon-play" @click.stop="playDisc(item)"></span>
                                            </div>
                                        </transition>

                                    </div>
                                    <div class="desc">
                                        <p class="dissname">
                                            <router-link :to="{name: 'Disc', params:{mid: item.dissid}}" tag="a" v-html="item.dissname"></router-link>
                                        </p>
                                        <p class="singers">
                                            {{item.creator.name}}

                                        </p>
                                        <p class="time">{{item.createtime}}</p>
                                    </div>
                                </div>

                            </li>
                        </ul>
                    </div>
                </transition>

                <loading v-show="!discslist.length"></loading>
                <div class="page-contai">
                    <page :currentPage="Number(params.page)" @pageChange="pageChange" :showNumbers="pageBtnNums" :totalNumber="totalPages"></page>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import { getDiscsList, getDiscsTag } from 'api/disc'
import { getSongList } from 'api/recommend'
import { createSong } from 'common/js/song'
import { showMode } from 'common/js/config'
import { ERR_OK } from 'api/config'
import { event } from 'common/js/dom'
import { orderType } from 'common/js/config'
import { fixedMouse } from 'common/js/util'
import Loading from 'base/loading'
import Page from 'base/page'
import { mapActions, mapMutations } from 'vuex'
// import InfoPop from 'base/info-pop'
export default {
    data() {
        return {
            params: { page: 1, sortId: 1, categoryId: 10000000 },
            categories: [],
            sorts: {},
            popFlag: {
                company: false,
                type: false,
                year: false
            },
            discslist: [],
            overIndex: -1,
            sum: 0,
            cates: [],//数据单一的分类数组
            pagesize: 30 //请求的时候就是固定的了
        }
    },
    computed: {
        choicedCate() {
            return this.cates.find((item) => {
                return item.categoryId == this.params.categoryId
            })
        },

        _orderType() {
            return orderType
        },
        // 保持分类选择栏的显示
        // showNav() {
        //     return this.tags.one.hasOwnProperty('language')
        // },
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
        }
        this._getDiscsList()
        this._getCategories()
    },
    methods: {
        _getDiscsList() {
            getDiscsList(this.params).then((res) => {

                if (ERR_OK === res.code) {
                    // 歌单数据
                    this.discslist = Array.from(res.data.list)
                    // 分页
                    this.sum = res.data.sum

                }
            })
        },
        _getCategories() {
            getDiscsTag().then((res) => {
                if (ERR_OK == res.code) {
                    let temp = Array.from(res.data.categories)
                    this.categories = temp.slice(1)
                    this.sorts = temp.slice(0, 1)[0]

                    for (let i = 0; i < 5; i++) {
                        this.cates.push(...this.categories[i].items)
                    }
                }
            })
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
        isCurrent(id) {
            return this.params.categoryId == id
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
            event.addEvent(document, 'click', () => {
                this.popFlag[key] = false
            })
        },
        selectCategory(cid) {
            // 拷贝一个副本
            let _params = JSON.parse(JSON.stringify(this.params))
            _params.categoryId = cid
            this.params = _params
        },
        deleteTag(item) {
            let _params = JSON.parse(JSON.stringify(this.params))
            _params.categoryId = 10000000
            this.params = _params
        },
        selectSortType(type) {
            if (type == this.params.sortId) return
            let _params = JSON.parse(JSON.stringify(this.params))
            _params.sortId = type
            this.params = _params
        },
        // getAlbumPic(item) {
        //     return `//y.gtimg.cn/music/photo_new/T002R300x300M000${item.album_mid}.jpg?max_age=2592000`
        // },
        // 列表
        selectItem(item) {
            this.$router.push({
                path: `/music/disc/${item.dissid}`
            })
        },
        iconShow(index, e) {
            this.overIndex = index    
        },
        iconDiss(index, e) {
            this.overIndex = -1
        },
        pageChange(page) {
            let _params = JSON.parse(JSON.stringify(this.params))
            _params.page = page 
            this.params = _params
        },
        // 直接全屏播放歌曲
        playDisc(item) {
            this._getSongList(item.dissid)
        },
        _getSongList(id) {
            getSongList(id).then((res) => {
                if (res.code === ERR_OK) {
                    this.playAll(this._normalizeSongs(res.cdlist[0].songlist))
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
    watch: {
        params(val) {
            this.discslist = []
            this.$router.push({ path: '/music/discs', query: val })
            this._getDiscsList()
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
.discs
    width: 100%;
    min-height: 1000px
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
                ul
                    float left
                    width 1100px
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
            .tagName
                font-size 16px
                font-weight 700
                color $color-theme
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
            padding-left 40px
            padding-right 20px
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
                    // margin-right 6px
                    height 42px
                    width 60px
                    text-align center
                    // margin-right 20px
                    line-height 44px
                    font-size 14px
                    background #fff
                    border 1px solid #ddd
                    margin-left -1px
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
                                
                                color #999
                                font-size 14px
                               
                            .time
                                color #999
                                font-size 14px
</style>
