<template>
    <div class="page">
        <div class="prev" v-show="current > 1" @click="prev">
            上一页
        </div>

        <div class="btn" v-for="page in showPages" :key="page" :class="{'current': page === current}" @click="selectPage(page)">{{page}}</div>

        <div class="next" v-show="current < totalNumber" @click="next">
            下一页
        </div>
    </div>
</template>
<script>
export default {
    props: {
        totalNumber: {
            type: Number,
            default: 100
        },
        // 显示的按钮数， 不包括最后一个或者最前面一个，
        showNumbers: {
            type: Number,
            default: 10
        },
        currentPage: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            showPages: [],
            current: this.currentPage
        }
    },
    created() {

        this._createBtns()
    },
    methods: {
        _createBtns() {
            this.showPages = [];
            // 构建按钮数组
            if(this.showNumbers <= 1) return ;
            let middle = ( this.showNumbers / 2 + 1 )| 0
            let leftCount = middle - 1
            let rightCount = this.showNumbers - middle
            // 最左边
            if (this.currentPage < middle) {
                for (let i = 1; i <= this.showNumbers; i++) {
                    this.showPages.push(i)
                }
                return
            }
            // 最右边
            if (this.totalNumber - this.currentPage < rightCount) {
                for (let i = this.showNumbers; i > 0; i--) {
                    this.showPages.push(this.totalNumber - i + 1)
                }
                return
            }
            // 普通情况的左边
            for (let i = leftCount; i > 0; i--) {
                this.showPages.push(this.currentPage - i)
            }
            // 加入中间值
            this.showPages.push(this.currentPage)
            // 普通情况的右边
            for (let i = 1; i <= rightCount; i++) {
                this.showPages.push(this.currentPage + i)
            }
        },
        prev(){
            this.current--
        },
        next(){
            this.current++
        },
        selectPage(page){
            this.current = page
        }
    },
    watch: {
        current(val) {
            this._createBtns()
            this.$emit('pageChange', val)
        },
        currentPage(val){
            this.current = val
        },
        //数量的改变，需要重绘按钮 
        totalNumber(){
            this._createBtns()
        },
        showNumbers(){
            this._createBtns()
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
$btn-size = 60px 
$btn-size-lg = 70px 
.page
    display flex
    // max-width 600px
    justify-content center
    >div
        cursor pointer
        height $btn-size
        line-height $btn-size
        text-align center
        margin  5px
        &:hover
            background #ddd
    .prev, .next
        flex 0 0 $btn-size-lg
        
        font-size 12px
    
    .btn
        color #333333
        flex 0 0 $btn-size
        
        &.current
            background $color-theme
            color #fff
            font-size 18px
</style>
