<template>
    <div class="user">
        <div class="banner">
            <img src="https://y.gtimg.cn/mediastyle/yqq/img/bg_profile.jpg" alt="">
            <div class="welcome">聆听我的音乐</div>
            <nav class="top-nav">
                <div class="nav-item" @click="selectFavorite" :class="{'current':isShowNav}">我的收藏</div>
                <div class="nav-item" @click="selectHistory" :class="{'current':!isShowNav}">播放历史</div>
            </nav>
        </div>
        <!-- mode先出再进 -->
        <transition name="fade" mode="out-in">
            <div class="favorite-box" v-if="isShowNav" key="favorite">
                <div class="favoriteTypeNav">
                    <div class="nav-item" @click="selectFavoriteType(favoriteTypes.song)" :class="{'current':isSongType}">歌曲</div>
                    <div class="nav-item" @click="selectFavoriteType(favoriteTypes.album)" :class="{'current':isAlbumType}">专辑</div>
                    <div class="nav-item" @click="selectFavoriteType(favoriteTypes.singer)" :class="{'current':isSingerType}">歌手</div>
                    <div class="nav-item" @click="selectFavoriteType(favoriteTypes.diss)" :class="{'current':isDissType}">歌单</div>
                </div>
                <div class="content">
                    <transition @enter="enter" @leave="leave">
                        <!-- 四个栏目 -->
                        <div class="favorite-item song" v-if="isSongType" key="song">
                            <song-list :songs="favoriteSongList" v-if="favoriteSongList.length"></song-list>
                            <div class="nolist" v-show="!favoriteSongList.length">
                                该栏目没有收藏条目~<br>
                                <br> 快去收藏吧~~
                                <br><br>
                                <router-link to="/music/index" tag="a">--返回首页--</router-link>
                            </div>
                        </div>

                        <div class="favorite-item album" v-if="isAlbumType" key="album">
                            <favorite-list :list="favoriteAlbumList" :favoriteType="favoriteTypes.album"></favorite-list>
                        </div>

                        <div class="favorite-item singer" v-if="isSingerType" key="singer">
                            <favorite-list :list="favoriteSingerList" :favoriteType="favoriteTypes.singer"></favorite-list>
                        </div>

                        <div class="favorite-item diss" v-if="isDissType" key="diss">
                            <favorite-list :list="favoriteDissList" :favoriteType="favoriteTypes.diss"></favorite-list>
                        </div>
                    </transition>

                </div>

            </div>
            <div class="history-box" v-else key="history">
                <div class="content">
                    <song-list :songs="playHistory"></song-list>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SongList from 'base/song-list'
import Velocity from 'velocity-animate'
import { favoriteTypes } from 'common/js/config'
import FavoriteList from 'base/favorite-list'
const NAV = {
    favorite: 0,
    history: 1
}

export default {
    data() {
        return {
            currentNav: NAV.favorite,
            currentType: favoriteTypes.song,
            favoriteTypes: favoriteTypes,
            lastFavoriteType: favoriteTypes.song
        }
    },
    computed: {
        isShowNav() {
            return this.currentNav == NAV.favorite
        },
        isSongType() {
            return this.currentType == favoriteTypes.song
        },
        isAlbumType() {
            return this.currentType == favoriteTypes.album
        },
        isSingerType() {
            return this.currentType == favoriteTypes.singer
        },
        isDissType() {
            return this.currentType == favoriteTypes.diss
        },
        ...mapGetters([
            'playHistory',
            'favoriteSongList',
            'favoriteAlbumList',
            'favoriteSingerList',
            'favoriteDissList'
        ])
    },
    methods: {
        selectFavorite() {
            this.currentNav = NAV.favorite
        },
        selectHistory() {
            this.currentNav = NAV.history
        },
        selectFavoriteType(type) {
            this.lastFavoriteType = this.currentType
            this.currentType = type
        },

        //左右滑动的动画
        //进入 
        enter(el, done) {
            el.style.position = 'relative'
            if (this.currentType > this.lastFavoriteType) {
                Velocity(el, { opacity: 0, translateX: '100%' },
                    { duration: 0 })
            } else {
                Velocity(el, { opacity: 0, translateX: '-100%' },
                    { duration: 0 })
            }
            Velocity(el, { opacity: 1, translateX: 0 },
                { duration: 600, complete: done })
        },
        // 离开
        leave(el, done) {
            el.style.position = 'absolute'
            if (this.currentType > this.lastFavoriteType) {
                Velocity(el, { opacity: 0, translateX: '-100%' },
                    { duration: 600, complete: done })
            } else {
                Velocity(el, { opacity: 0, translateX: '100%' },
                    { duration: 600, complete: done })
            }
        },
    },
    components: {
        SongList,
        FavoriteList
    }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.user 
    min-height: 1000px;

    .current 
        color: $color-theme;
    .banner 
        position: relative;
        height: 283px;

        img 
            height: 100%;
            width: 100%;

        .welcome 
            position: absolute;
            width: 100%;
            top: 45%;
            color: #fff;
            text-align: center;
            font-size: 36px;
            text-shadow: 2px 2px 2px $color-theme;
        
        .top-nav 
            position: absolute;
            height: 60px;
            left: 50%;
            transform: translateX(-50%);
            line-height: 60px;
            bottom: 0;
            color: #ffffff;
            // background #eee
            overflow: hidden;

            .nav-item 
                float: left;
                margin: 0 10px;
                font-size: 18px;
                cursor: pointer;

    .favorite-box, .history-box 
        width: 1200px;
        margin: 0 auto;
        &.fade-enter-active, &.fade-leave-active 
            transition: all 0.4s;
        
        &.fade-enter, &.fade-leave-to 
            opacity: 0;
        .favoriteTypeNav 
            overflow: hidden;
            // background #eee
            .nav-item 
                float: left;
                width: 120px;
                height: 60px;
                text-align: center;
                line-height: 60px;
                cursor: pointer;
        .content 
            position: relative;
            margin-top: 15px;
            overflow hidden
            .favorite-item 
                position: relative;
                top: 0;
                left: 0;
                width: 100%;
                // transform translate3d(0, 0, 0)
                .nolist
                    a
                        color $color-theme

</style>
