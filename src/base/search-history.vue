<template>
<!-- 搜索列表的组件 -->
    <div class="search-list" v-show="searchHistory.length">
        <transition-group name="list" tag="ul">
            <li :key="item" class="search-item" @click="selectItem(item)" v-for="item in searchHistory">
                <span class="text">{{item}}</span>
                <span class="icon" @click.stop="deleteOne(item)">
                    <i class="icon-delete"></i>
                </span>
            </li>
        </transition-group>
    </div>
</template>
 
<script type="text/ecmascript-6">
import { mapGetters,mapActions } from 'vuex'
export default {
    computed: {
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods: {
        selectItem(item) {
            this.$emit('select', item)
        },
        deleteOne(item) {
            this.deleteSearchHistory(item)
        },
        ...mapActions([
            'deleteSearchHistory'
        ])
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      padding 0 8px
      height: 36px
      overflow: hidden
      cursor pointer
      &:hover
        background $color-theme
        .text
            color #fff!important
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: #333
        font-size $font-size-medium
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: #fff
</style>