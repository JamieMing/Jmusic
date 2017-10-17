<template>
    <div class="tab">
        <router-link tag="div" class="tab-item link" to="/music/index">
            <span class="tab-link">首页</span>
        </router-link>
        <router-link tag="div" class="tab-item link" to="/music/singer">
            <span class="tab-link">歌手</span>
        </router-link>
        <router-link tag="div" class="tab-item link" to="/music/album">
            <span class="tab-link">专辑
            </span>
        </router-link>
        <router-link tag="div" class="tab-item link" to="/music/rank">
            <span class="tab-link">排行
            </span>
        </router-link>
        <router-link tag="div" class="tab-item link" to="/music/discs">
            <span class="tab-link">分类歌单
            </span>
        </router-link>
    </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" tpye="text/stylus">
@import "~common/stylus/variable"
.tab
    // display flex
    box-sizing border-box
    width 1200px
    height 52px
    margin 0 auto 
    padding-left 230px
    overflow hidden
    font-size $font-size-medium
    overflow hidden
    .tab-item
        float left
        margin-right 47px
        .tab-link
            font-size $font-size-medium
            line-height 52px
        &.router-link-active
            .tab-link
                color $color-theme

</style>