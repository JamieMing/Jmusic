<template>
    <div class="index">

        <recommend :data="focus" v-if="focus.length>0" v-show="!routerViewShow"></recommend>
        <rank-nav v-show="!routerViewShow" v-if="toplistCate.length" :toplistCate="toplistCate"></rank-nav>
        <hotdiss :data="hotdiss" v-if="hotdiss.length" v-show="!routerViewShow"></hotdiss>
        <router-view></router-view>
    </div>
</template>
<script>
import Recommend from 'components/recommend/recommend'
import RankNav from 'components/rank-nav/rank-nav'
import Hotdiss from 'components/hotdiss/hotdiss'
import { getRecommends } from 'api/recommend'
import {getToplistCate,getToplist} from 'api/toplist'
import { ERR_OK } from 'api/config'
import {mapGetters, mapMutations} from 'vuex'
export default {
    name: 'app',
    data() {
        return {
            focus: [],
            hotdiss: [],
            toplist: [],
            toplistCate: [],
            routerViewShow: false
        }
    },
    created() {
        this.routerViewShow = /^\/music\/index\/disc\/\d+/.test(this.$route.path)
        this._getRecommends();
        this._getToplistCate();
    },
    methods: {
        _getRecommends() {
            getRecommends().then((res) => {
                if (res.code === ERR_OK) {
                    this.focus = Array.from(res.data.focus)
                    this.hotdiss = Array.from(res.data.hotdiss.list)

                    // this.toplist = Array.from(res.data.toplist)
                }
            })
        },
        _getToplist(topid, begin, num) {
            getToplist(topid, begin, num).then((res) => {
                this.toplist = res.songlist
            })
        },
        _getToplistCate(){
            getToplistCate().then((res) => {
                // console.log(res);
                this.toplistCate = res
                // 存到vuex中也是为了在排行榜更快获取
                this.setToplistCate( res )
            })
        },
        ...mapMutations({
            setToplistCate : 'SET_TOPLIST_CATE'
        })
    },
    watch: {
        '$route': function(val, oldVal) {
            // 隐藏其余组件
            this.routerViewShow = /^\/music\/index\/disc\/\d+/.test(val.path)
        }
    },
    components: {
        Recommend,
        RankNav,
        Hotdiss
    }

}
</script>

<style lang="stylus" rel="stylesheet/stylus" tpye="text/stylus">
@import "~common/stylus/variable"
.index
    position relative
    width 100%
    min-height 1000px
    // background #eee
</style>