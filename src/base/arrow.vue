<template>
    <div class="arrow-box">
        <transition name="leftSlide">
            <div class="arrow left" @click.stop="prev" v-show="showArrow" ></div>
        </transition>
        <transition name="rightSlide">
            <div class="arrow right" @click.stop="next" v-show="showArrow"></div>
        </transition>
    </div>
</template>
<script>
    export default{
        props:{
            showArrow:{
                type:Boolean,
                default: false
            }
        },
        data(){
            return {
                isMouseover: false
            }
        },
        methods:{
            prev(){
                this.$emit('prev')
            },
            next(){
                this.$emit('next')
            }
        }
    }
</script>
<style lang="stylus">
@import "~common/stylus/variable"
.arrow-box
    .arrow
        position: absolute;
        top: 50%;
        width: 80px;
        height: 100px;
        margin-top: -50px;
        background: $color-theme;
        opacity: .6;
        cursor: pointer;
        transition width .3s
        &:hover 
            opacity: .8
            width 90px
    .left 
        left: 0px;     
        &:before 
            content: '';
            position: absolute;
            display: block;
            top: 40%;
            left: 40%;
            width: 15px;
            height: 15px;
            border-left: 2px solid white;
            border-top: 2px solid white;
            transform: rotate(-45deg);
        &.leftSlide-enter-active, &.leftSlide-leave-active
            transition all .4s
        &.leftSlide-enter, &.leftSlide-leave-to
            transform translate3d(-80px, 0, 0)
    .right 
        right: 0;
        &:before 
            content: '';
            position: absolute;
            display: block;
            top: 40%;
            right: 40%;
            width: 15px;
            height: 15px;
            border-right: 2px solid white;
            border-bottom: 2px solid white;
            transform: rotate(-45deg);
        &.rightSlide-enter-active, &.rightSlide-leave-active
            transition all .4s
        &.rightSlide-enter, &.rightSlide-leave-to
           transform translate3d(80px, 0, 0)
</style>
