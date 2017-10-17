<template>
  <div class="favorite-list">
      <div class="favorite-item" v-for="(item, index) in list" :key="item.id"
      @click="selectItem(item.mid)">
          <div class="index">{{index+1}}</div>
          <div class="pic"><img :src="item.pic" alt=""></div>
          <div class="name" v-html="item.name"></div>
          <div class="delete">
              <span class="icon-delete" @click.stop="deleteItem(item)"></span>
          </div>
      </div>
      <div class="nolist" v-show="!list.length">
          该栏目没有收藏条目~<br>
          <br>
          快去收藏吧~~
          <br><br>
          <router-link :to="{name:getRouterName()}" tag="a">--传送门--</router-link>
      </div>
  </div>
</template>
<script>
import { favoriteTypes, favoriteType } from 'common/js/config'
import {mapActions} from 'vuex'
const routerNames = {
    [favoriteTypes.diss]: 'Disc',
    [favoriteTypes.album]: 'AlbumInfo',
    [favoriteTypes.singer]: 'SingerInfo'
}
const tabRouterName = {
    [favoriteTypes.diss]: 'Discs',
    [favoriteTypes.album]: 'Album',
    [favoriteTypes.singer]: 'Singer'
}
//对应localstorage的字段 
const map = {
    [favoriteTypes.diss]: favoriteType.diss,
    [favoriteTypes.album]: favoriteType.album,
    [favoriteTypes.singer]: favoriteType.singer
}
    export default {
        props:{
            list:{
                type:Array,
                default: []
            },
            favoriteType:{
                type: Number,
                default: favoriteTypes.album
            }
        },
        methods:{
            selectItem(mid){
                this.$router.push({name:routerNames[this.favoriteType], params:{mid: mid}})
            },
            deleteItem(item){
                this.deleteFavoriteList({
                    data: item,
                    type: map[this.favoriteType]
                })
            },
            getRouterName(){
                return tabRouterName[this.favoriteType]
            },
            ...mapActions([
                "deleteFavoriteList"
            ])
        }
    }
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.favorite-list
    width 100%
    // background #f5f5f5
    .favorite-item
        height 60px
        display flex
        line-height 60px
        margin-bottom 10px
        &:nth-of-type(2n)
            background #fbfbfd
        >div
            flex 1
            text-align center
            cursor pointer
            
        .index
            flex 0 0 100px
        .pic
            flex 0 0 100px
            height 60px
            display flex
            align-items center
            justify-content  center
            img 
                width 50px
                height 50px
        .name
            overflow hidden
            no-wrap()
            &:hover
                color $color-theme
        .delete
            .icon-delete
                // extend-click()
                &:hover
                    color $color-theme
    .nolist
        a
            color $color-theme
            
</style>
