<template>
  <transition name="fade">
    <div class="singer">
      <div class="banner">
        <img src="./bg_index_new.jpg" alt="">
        <transition name="open">
          <h1 v-if="bannerTitleShow">万千歌手，尽在眼前</h1>
        </transition>

      </div>
      <div class="main">
        <!-- 导航，标签栏 -->
        <div class="nav-container">
          <!-- 标签 -->
          <div class="tag">
            <ul>
              <li class="tag-item" v-for="(item, index) in singerTags" :key="index" @click="selectTag(index)">
                <span :class="{current:index == currentTagIndex}">{{item.value}}</span>
              </li>
            </ul>
          </div>
          <div class="word">
            <ul>
              <li class="word-item" v-for="(item,index) in words" :key="index" @click="selectWord(index)">
                <span :class="{current:index == currentWordIndex}">{{item == 'all'?'热门':item=='9' ?'#':item}}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 前10的 -->
        <div class="top10" v-if="singerData.list">
          <ul>
            <dl class="top10-singer-item" v-for="(item, index) in top10List" :key="index">
              <div class="wrap">
                <dt>
                  <router-link :to="{name:'SingerInfo', params:{mid: item.Fsinger_mid}}" tag="a">
                    <img v-lazy="getPic(item)" :alt="item.Fsinger_name">
                  </router-link>
                </dt>
                <dd>
                  <router-link :to="{name:'SingerInfo', params:{mid: item.Fsinger_mid}}" tag="a" v-html="item.Fsinger_name">
                  </router-link>
                </dd>
              </div>

            </dl>
          </ul>
        </div>
        <!-- 剩余的 -->
        <ul class="rest" v-if="singerData.list">
          <li class="rest-item" v-for="(item, index) in restList" :key="index">
            <router-link :to="{name:'SingerInfo', params:{mid: item.Fsinger_mid}}" tag="a" v-html="item.Fsinger_name">
            </router-link>
          </li>
        </ul>
        <loading v-show="!singerData.list"></loading>
        <div class="page-container" v-show="singerData.list">
          <page :currentPage="pagenum" :totalNumber="singerData.total_page" @pageChange="pageChange" :showNumbers="5"></page>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { singerTags, getWords } from './singerTags'
import { getSingers } from 'api/singer'
import { ERR_OK } from 'api/config'
import Loading from 'base/loading'
import Page from 'base/page'
export default {
  data() {
    return {
      words: getWords(),
      singerTags,
      pagenum: 1,
      // key: singerTags[0].key,
      singerData: {},
      currentTagIndex: 0,
      currentWordIndex: 0,
      bannerTitleShow: false
    }
  },
  computed: {
    top10List() {
      return this.singerData.list.slice(0, 10)
    },
    restList() {
      return this.singerData.list.slice(10)
    }
  },
  created() {
    this.$nextTick(() => {
      this.bannerTitleShow = true
    })
    // console.log(this.words);
    this._getSingers()
  },
  methods: {
    // 根据当前的关键字拼接key查询字符串
    _getFullKey() {
      return `${this.singerTags[this.currentTagIndex].key}_${this.words[this.currentWordIndex]}`
    },
    _getSingers() {
      getSingers(this._getFullKey(), this.pagenum).then((res) => {
        if (res.code === ERR_OK) {
          this.singerData = res.data
        }
      })
    },
    getPic(item) {
      return `//y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
    },
    selectTag(index) {
      this.singerData = {}
      this.currentTagIndex = index
      this.pagenum = 1
      this._getSingers()
    },
    selectWord(index) {
      this.singerData = {}
      this.currentWordIndex = index
      this.pagenum = 1
      this._getSingers()
    },
    // 换页
    pageChange(page) {
      // 清空歌曲数组
      this.singerData = {}
      window.scrollTo(0, 700);
      // 重新请求数据
      this.pagenum = page
      this._getSingers()
    },
  },
  components: {
    Loading,
    Page
  }
}
</script>
<style lang="stylus" scoped>

@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.singer
    width: 100%;
    min-height 1000px
    position: relative;
    top: 0;
    z-index: 100;
    opacity 1
    &.fade-enter-active, &.fade-leave-active
        transition all .3s
    &.fade-enter, .fade-leave-to
        opacity 0
    a
      display block
    .banner
      height 376px
      position relative
      img 
        width 100%
        height 100%
      h1
        position absolute
        top 40%
        left 50%
        font-size 50px
        margin-left -600px
        width 1200px
        height 120px
        color #fff
        text-align center
        vertical-align bottom
        &.open-enter-active
          animation bounce-in .8s
    @keyframes bounce-in {
      0%{
        transform scale(0) 
        top 10%
        left -600px
      }
      50%{
        transform scale(1.2)
        // left 35%
      }
      100%{
        top 40%
        transform scale(1)
        left 50%
      }
    }
    .main
      width 1200px
      margin 20px auto
      .nav-container
        height 180px
        background #fbfbfd
        padding 40px 0 0 40px
        .tag
          overflow hidden
          .tag-item
            float left
            // width 58px
            height 40px
            padding-right 15px
            padding-bottom 15px
            line-height 40px
            color #333
            font-size 14px
            cursor pointer
            
            span
              padding 8px
              &:hover
                background #ddd
        .word
          overflow hidden
          .word-item
            float left
            // width 26px
            height 36px
            line-height 36px
            padding-right 10px
            font-size 13px
            cursor pointer
            text-align center
            span 
              padding 5px 10px
              &:hover
                background #ddd
      .current
        background $color-theme!important
        color #fff
      .top10
        padding-top 20px
        ul
          margin-right -20px
          overflow hidden
          dl
            float left
            margin-bottom 20px
            width 20%
            height 245px
            .wrap
              margin-right 20px
              padding 25px 0
              height 100%
              box-sizing border-box
              background #fbfbfd
              dt
                
                width 100%
                text-align center
                img 
                  width 140px
                  height 140px
                  border-radius 50%
              dd
                padding-top 20px
                margin 0 30px        
                text-align center
                a
                  no-wrap()      
                  color $color-text    
                  &:hover
                    color $color-theme
      .rest
        padding-bottom 20px
        overflow hidden
        margin-right -20px
        .rest-item
          float left
          width 20%
          height 36px
          line-height 36px
          text-align center
          a
            no-wrap()
            font-size 14px
            color #333
            &:hover
              color $color-theme
      .page-container
        margin-top 20px

</style>
