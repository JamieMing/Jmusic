<template>
  <transition name="fade">
    <div class="rank">
      <div class="main">
        <!-- 左侧导航栏 -->
        <div class="left-nav" v-if="toplistCate.length">
          <h4 class="cate-title">{{toplistCate[0].GroupName}}</h4>
          <ul class="qqRank">
            <li class="nav-item" v-for="(item, index) in toplistCate[0].List" :key="index" @click="selectRank(item.topID)" :class="{'current':item.topID == currentCateID}">
              {{item.ListName}}
            </li>
          </ul>
          <h4 class="cate-title">{{toplistCate[1].GroupName}}</h4>
          <ul class="worldRank">
            <li class="nav-item" v-for="(item, index) in toplistCate[1].List" :key="index" @click="selectRank(item.topID)" :class="{'current':item.topID == currentCateID}">
              {{item.ListName}}
            </li>
          </ul>
        </div>

        <div class="right">
          <div class="right-top">
            <h3>
              <span class="pic"><img :src="currentCate.pic" alt=""></span>
              <span class="right-title">{{currentCate.ListName}}</span>
              <span class="time">{{update_time}}</span>
            </h3>
            <div class="operator">
              <div class="btn playAllBtn" @click="playAllClick">
                <span class="icon-play"></span>
                <span>播放全部</span>
              </div>
              <!-- <div class="btn favoriteBtn">
                <span class="icon-favorite"></span>
                <span>收藏</span>
              </div> -->
            </div>
          </div>
          <!-- 歌曲列表 -->
          <div class="right-content">
            <song-list :songs="songs" :showType="songListType.rank" :page="currentPage"></song-list>
            <div class="page-container" v-if="songs.length">
              <page :currentPage="currentPage" @pageChange="pageChange" :showNumbers="pageBtnNums" :totalNumber="totalPages"></page>
            </div>

          </div>
        </div>
      </div>

    </div>
  </transition>
</template>
<script>
import { getToplist, getToplistCate } from 'api/toplist'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import SongList from 'base/song-list'
import { createSong } from 'common/js/song'
// 告诉songlist，取什么样式
import { songListType } from 'common/js/config'
import Page from 'base/page'
export default {
  data() {
    return {
      songs: [],
      currentCateID: -1,
      songListType: songListType,
      update_time: "00-00-00",
      total_song_num: 0,
      currentCate: {},
      currentPage: 1,
      countsPerPage: 30
    }
  },
  computed: {
    song_begin() {
      return (this.currentPage - 1) * this.countsPerPage
    },
    // 计算总页数
    totalPages() {
      let delta = this.total_song_num % this.countsPerPage == 0 ? 0 : 1 
      return this.total_song_num / this.countsPerPage + delta | 0
    },
    //分页栏需要几个按钮
    pageBtnNums(){
      return this.totalPages 
    },
    ...mapGetters([
      "toplistCate",
    ])
  },
  created() {
    let topID = this.$route.params.id || 4;
    this.currentCateID = Number(topID);
    // 因为重新刷新，vuex的数据是没有了的，所以重新拉取
    if (!this.toplistCate.length) {
      this._getToplistCate()
    }
    this._getToplist();
  },
  methods: {
    // 获取歌单数据
    _getToplist() {
      getToplist(this.currentCateID, this.song_begin, this.countsPerPage).then((res) => {
        // 更新标题栏
        this.update_time = res.update_time
        this.currentCate = res.topinfo
        // 更新分页组件
        this.total_song_num = res.total_song_num
        // 更新歌曲列表
        this.songs = this._normalizeSong(res.songlist)
      }).catch((e) => {
        console.log(e);
      })
    },
    // 封装song对象
    _normalizeSong(list) {
      let ret = []
      list.forEach((item) => {
        let song = createSong(item.data);
        // 以下判断， 根据数据及其表现，大致模仿qq的算法，得出排名变化，qq音乐为何是这样，其中缘由，猜不透
        let temp = Number(item.old_count) == 0 || Number(item.in_count) % 1 != 0 ? (Number(item.in_count) * 100 | 0) + '%' : Number(item.old_count) - Number(item.cur_count);
        //添加一个排名变化的字段
        Object.assign(song, {
          deltaCount: temp
        });
        ret.push(song)
      })
      return ret
    },
    // 排行榜分类
    _getToplistCate() {
      getToplistCate().then((res) => {
        // console.log(res);
        this.setToplistCate(res)
      });
    },
    // 播放全部，vuex管理
    playAllClick() {
      this.playAll(this.songs)
    },
    // 通过改变路由去换数据
    selectRank(id) {
      this.$router.push({
        path: `/music/rank/${id}`
      })
      this.songs = []
    },
    // 换页
    pageChange(page) {
      // 清空歌曲数组
      this.songs = []
      this.currentPage = page
      window.scrollTo(0, 0);
      // 重新请求数据
      this._getToplist()
    },
    ...mapMutations({
      setToplistCate: 'SET_TOPLIST_CATE'
    }),
    ...mapActions([
      "playAll"
    ])
  },
  components: {
    SongList,
    Page
  },
  watch: {
    // 榜单切换
    $route(val, oldVal) {
      this.currentCateID =  val.params.id
      this.currentPage = 1
      this._getToplist()
    },

  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.rank
    background: url('~common/image/bg_detail.jpg') no-repeat;
    width: 100%;
    min-height 1000px
    // height: 100%;
    position: relative;
    top: 0;
    z-index: 100;
    opacity 1
    &.fade-enter-active, &.fade-leave-active
        transition all .3s
    &.fade-enter, .fade-leave-to
        opacity 0
    .main
        width 1200px
        padding-top 60px
        margin 0 auto
        display flex
        .left-nav
          flex 0 0 180px
          height 100%
          border 1px solid #ddd
          box-sizing border-box
          line-height 22px
          font-size 15px
          h4 
            padding 0 17px
            height 70px
            font-size 20px
            line-height 70px
            position relative
            &:after
              content ''
              display block
              position absolute
              bottom 0px
              left 17px
              width 146px
              height 1px
              background #ddd

          ul
            padding-bottom 20px
            li
              display flex
              align-items center
              height 56px
              padding 0 17px
              cursor pointer
              &:hover
                color $color-theme
              &.current
                background $color-theme
                color #fff
        .right
          flex 1
          padding-left 35px
          .right-top
            h3
              height 80px
              line-height 80px
              .pic
                img 
                  width 50px
                  height 50px
                  vertical-align top
              .right-title
                font-size 24px
                color #333
              .time
                color #999999
                margin-left 20px

            .operator
              overflow hidden

              .btn
                  float left 
                  margin-right 20px
                  width 140px
                  height 40px
                  line-height 40px
                  font-size 16px
                  border-radius 2px
                  text-align center
                  cursor pointer
                  .icon-play, icon-favorite
                      font-size 18px
                      vertical-align middle
                  span 
                      vertical-align middle
                      letter-spacing 2px
              .playAllBtn
                  background $color-theme-m
                  color #fff
                  &:hover
                      background $color-theme
              .favoriteBtn
                  background #eee
                  color $color-text
                  &:hover
                      background #ddd
          .right-content 
            padding-top 20px
            .page-container
              padding-top 20px
</style>
