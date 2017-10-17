<template>
    <div class="search-box" @click.stop>
        <i class="icon-search"></i>
        <input type="text" class="box" :placeholder="placeholder" v-model="query" ref="query" @blur="blured" @focus="focused">
        <i class="icon-dismiss" @click="dismiss" v-show="query"></i>
        <!-- 下方结果框 -->
        <transition name="slide">
            <div class="mini-suggest" v-show="showFlag">
                <transition name="fade">
                    <div class="no-query" v-show="!result">
                        <ul class="hotkey">
                            <li class="hotkey-item" v-for="(item, index) in hotkey" :key="index" @click="setQueryAndSave(item.k)">
                                <i>{{index+1}}</i>
                                <span>{{item.k}}</span>
                                <span class="hotNumber">{{getHotNumber(item.n)}}万</span>
                            </li>
                        </ul>
                        <div class="search-title" v-show="searchHistory.length">搜索历史
                            <span class="icon-clear" @click="clearSearch"></span>
                        </div>
                        <search-history @select="setQuery"></search-history>
                    </div>
                </transition>
                <transition name="fade">
                    <div class="querys-box" v-show="resultByOrder">
                        <!-- 为undefined就不要 -->
                        <div class="part" v-for="(item, index) in resultByOrder" :key="index" v-if="item">
                            <h4>{{item.name}}</h4>
                            <ul>
                                <li class="item" v-for="(_item, index) in item.itemlist" :key="_item.id" @click="saveSearchHistory(query)">
                                    <router-link :to="{name:getRouterName(item.type), params:{mid: _item.mid}}" tag="a" v-html="getHighlight(_item, item.type)"></router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </transition>

            </div>
        </transition>

    </div>
</template>
<script>
import { debounce } from 'common/js/util'
import { getHotKey, getSmartKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { searchType } from 'common/js/config'
import SearchHistory from 'base/search-history'
import { mapActions,mapGetters } from 'vuex'
import { event } from 'common/js/dom'
//方便取名字 
const routerNames = {
    [searchType.song]: 'SingleSong',
    [searchType.album]: 'AlbumInfo',
    [searchType.singer]: 'SingerInfo'
}
export default {
    data() {
        return {
            query: '',
            hotkey: [],
            placeholder: '输入关键字',
            result: null,
            showFlag: false
        }
    },
    computed: {
        resultByOrder() {
            //通过解构赋值重新构建所需的数据 
            if (this.result) {
                let { album, song, singer } = this.result
                let [...ret] = [song, singer, album]
                return ret
            }
            return null
        },
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods: {
        dismiss() {
            this.query = ''
            this.placeholder = this.temp
        },
        setQuery(query) {
            this.query = this.trim(query)

        },
        setQueryAndSave(query) {
            this.query = this.trim(query)
            this.saveSearchHistory(query)
        },
        blur() {
            this.$refs.query.blur()
        },
        focused() {
            this.showFlag = true
            event.addEvent(document, 'click', () => {
                this.showFlag = false
            })
        },
        //失焦事件 
        blured() {
            // 复原 
            this.placeholder = this.temp
        },
        //去掉两端空格 
        trim(str) {
            return str.replace(/^\s+|\s+$/g, '')
        },
        //获取搜索量 
        getHotNumber(n) {
            //也许会有bug 
            let ret = (n / 10000).toFixed(1).replace(/(.0)/, '')
            return ret
        },
        //搜索结果要与关键字对应的高亮显示 
        getHighlight(item, type) {
            //歌手只需要一个字段 
            let str = type == searchType.singer ? item.name : item.name + ' - ' + item.singer
            return str.replace(new RegExp(`(${this.query})`, 'g'), `<span class=highlight>${this.query}</span>`)
        },
        //获取热搜关键字 
        _getHotKey() {
            getHotKey().then((res) => {
                if (res.code === ERR_OK) {
                    this.hotkey = res.data.hotkey.slice(0, 5)
                    this.placeholder = res.data.special_key
                    this.temp = res.data.special_key
                }

            })
        },
        //链接名 
        getRouterName(type) {
            return routerNames[type]
        },
        clearSearch(){
            this.clearSearchHistory()
        },
        ...mapActions([
            'saveSearchHistory',
            'clearSearchHistory'
        ])
    },
    created() {
        this._getHotKey()

        this.$watch('query', debounce((newQuery) => {
            if (newQuery == '') {
                this.result = null
                return
            }
            this.placeholder = '输入关键字'
            //搜索 
            getSmartKey(newQuery).then((res) => {
                if (res.code === ERR_OK) {
                    this.result = res.data
                }
            })
            //作为子组件的时候,向上传递 
            this.$emit('query', newQuery)
        }, 200))
    },
    components: {
        SearchHistory
    }

}
</script>
 
<style lang="stylus" >
//不加scoped 
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.search-box
    // margin-top 30px
    display flex
    box-sizing border-box
    position relative
    width 100%
    padding 0 6px
    align-items center
    height 40px
    // background $color-highlight-background
    .icon-search
        line-height 18px 
        font-size 24px
        cursor pointer
    .box
        flex 1
        // margin 0 5px
        line-height 18px
        height 36px       
        color $color-text
        font-size $font-size-medium
        outline none
        &::placeholder
            color #999
    .icon-dismiss
        font-size 16px
        color #ddd
        cursor pointer
        &:hover
            color #999
    .mini-suggest
        position absolute
        box-sizing border-box
        width 101%
        top 40px
        left -1px
        color $color-text
        background #fff
        z-index 1000
        border 1px solid rgba(0,0,0,0.3)
        &.slide-enter-active, &.slide-leave-active
            transition all .4s ease-in-out
        &.slide-enter, &.slide-leave-to
            transform scaleY(0)
            transform-origin 0 0
            // height 0
        li
            padding 0 8px
            cursor pointer
            height 32px
            line-height 32px
            font-size 14px
            no-wrap()
            &:hover
                background $color-theme
                color #fff
                .hotNumber
                    color #fff!important
        .no-query
            &.fade-enter-active
                transition all .4s
            &.fade-enter, &.fade-leave-to
                // height 0
                opacity 0
            .hotkey
                li
                    overflow hidden
                    i 
                        color $color-red-l
                        margin-right 8px
                    .hotNumber
                        float right
                        font-size 12px
                        color #999
        .search-title
            padding 0 8px   
            overflow hidden 
            height 24px
            font-size 14px
            color #999
            line-height 24px
            .icon-clear
                float right
                line-height 24px
                cursor pointer
        .querys-box
            &.fade-enter-active
                transition all .4s
            &.fade-enter, &.fade-leave-to
                // height 0
                opacity 0
            .part
                h4
                    padding 0 8px
                    height 28px
                    line-height 28px
                    font-size 14px
                    color #333
                .item
                    padding-left 24px
                    padding-right 5px
                    a
                        display block
                        no-wrap()
                        .highlight
                            color $color-theme
                        &:hover
                            color #fff
                            .highlight
                                color #fff
                        
</style>
