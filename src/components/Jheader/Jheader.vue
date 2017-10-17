<template>
    <div class="j-header">
        <div class="icon"></div>
        <span class="text">JM音乐</span>
        <div class="nav-box">
            <router-link tag="div" class="top_nav link" to="/music">
                音乐馆
            </router-link>
            <router-link tag="div" class="top_nav link" to="/user">
                我的音乐
            </router-link>
        </div>
        <div class="search">
            <search-box></search-box>
        </div>
        
    </div>
</template>
<script>
    import SearchBox from 'components/search-box/search-box'
    export default {
        components: {
            SearchBox
        }
    }
</script>


<style lang="stylus" rel="stylesheet/stylus" tpye="text/stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.j-header
    height 90px
    width 1200px
    margin 0 auto;
    position relative
    
    border-bottom 1px solid $color-background-d
    .icon
        position absolute
        top 22px
        vertical-align middle
        width 200px
        height 46px
        bg-image('logo')
        background-size 100% 46px
    .text
        position absolute
        top 22px
        left 205px
        vertical-align middle
        color $color-theme
        line-height 44px
        font-size $font-size-large
    .nav-box
        position absolute
        top 0
        left 250px
        margin-left 50px
        .top_nav
            display inline-block
            width 94px
            color $color-text
            line-height 90px
            text-align center
            &.router-link-active
                color $color-text-ll
                background $color-theme
    .search
        position absolute
        width 220px
        top 22px
        left 600px
        border 1px solid $color-background-d
        border-radius 3px 
        // margin-left 100px
</style>
