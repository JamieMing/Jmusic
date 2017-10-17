<template>
    <div class="operator">
        <span class="btn" v-for="n in data" :key="n" @click="btnClick(n)" :class="{active: realIndex == n}"></span>
    </div>
</template>
<script>
export default {
    props:{
        data:{
            type: Number,
            default: []
        },
        realIndex:{
            type: Number,
            default: 0
        }
    },
    methods:{
        btnClick(index){
            this.$emit('btnClick', index)
        }
    }
}
</script>
<style lang="stylus">
@import "~common/stylus/variable"
 .operator 
    text-align: center;
    margin-top: 5px;
    .btn 
        display: inline-block;
        width: 30px;
        height: 5px;
        border-radius: 2px;
        margin-right: 5px;
        font-size: 12px;
        background: #ddd;
        text-align: center;
        cursor: pointer;
        color: #585757;
        line-height: 20px;
        &.active
            background: $color-theme-d;
            opacity .8
                    // color: white;
    
</style>
