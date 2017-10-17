<template>
    <div class="disc-right">
        <section class="part1">
            <h4>简介</h4>
            <div class="desc">
                <p v-html="desc"></p>
            </div>
            <a href="" @click.prevent.stop="showMore">|更多|</a>
            <info-pop :desc="desc" ref="pop"></info-pop>
        </section>

    </div>
</template>
<script>
import InfoPop from 'base/info-pop'
export default {
    props: {
        desc: {
            type: String,
            default: ''
        }

    },
    methods:{
        showMore(){
            this.$refs.pop.show()
        }
    },
    components:{
        InfoPop
    }
}
</script>
<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.disc-right
    padding 0 20px
    .part1
        color $color-text
        position relative
        h4
            font-size 20px
            line-height 46px
            font-weight 400
        .desc
            margin-bottom 10px
            max-height 88px
            line-height 22px
            font-size 14px
            overflow hidden
        a 
            cursor pointer
            &:hover
                color $color-theme
       
</style>
