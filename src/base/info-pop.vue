<template>
    <div class="info-pop" v-show="flag" :class="comStyle" >
        <div class="content" v-html="realText"></div>
    </div>
</template>
<script>
import { popType} from 'common/js/config'
import {event} from 'common/js/dom'
export default {
    props: {
        desc: {
            type: String,
            default: ''
        },
        showType:{
            type: Number,
            default : popType.normal
        }
    },
    computed:{
        comStyle(){
            return this.showType == popType.scroll ? 'scroll': 'normal'
        },
        realText(){
            // \s会匹配到\n 和\t
            return this.desc.replace(/\n+/g, '<br>').replace(/\t/g, '  ').replace(/\s+/g, ' ')
        }
    },
    data() {
        return {
            flag: false,
        }
    },
    methods: {
        show() {
            
            this.flag = true
            let handler = event.addEvent(document, 'click', ()=>{
                this.flag = false
                event.removeEvent(document, 'click', handler)
            })
            // document.addEventListener('click', () => {
            //     this.flag = false
            // })
        }
    }
}
</script>
<style lang="stylus" scoped>
.info-pop
    position absolute
    padding 20px 
    z-index 100  
    background #fff
    border-radius 5px
    box-shadow 0px 0px 2px 2px #ddd
    
    &.normal
        top 120px
        width 720px
        left -730px
        .content
            max-height 400px
            font-size: 14px
            overflow-y: scroll  
    &.scroll
        padding-right 10px
        top: 36px
        right: 200px
        width: 550px
        &:before
            content ''
            position absolute
            top -6px
            right 18px
            width 10px
            height 10px
            border-top 1px solid #dddddd
            border-left 1px solid #dddddd
            background #fff
            // box-shadow 0px 0px 2px 2px #ddd
            transform rotate(45deg)
        .content
            max-height 400px
            font-size: 14px
            overflow-y: scroll   
    p
        line-height 22px
        color #333
        min-height: 22px;
        text-align: justify;
        word-break: break-all;
        font-size 14px
    .icon-delete
        position absolute
        right 10px
        top 10px
        font-size 18px
        color #999
        cursor pointer
</style>
