<template>
    <transition name="fade">
        <div class="volume-progress" ref="progressBar" @click.stop="progressClick">
            <div class="bar-inner">
                <div class="progress" ref="progress"></div>
                <div class="progress-btn-wrapper" ref="progressBtn" @mousedown.stop="progressStart">
                    <div class="progress-btn"></div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import { prefixStyle } from 'common/js/dom'
import { fixedMouse } from 'common/js/util'
const progressBtnHeight = 4
const transform = prefixStyle('transform') 
export default {
    props: {
        percent: {
            type: Number,
            default: 0
        }
    },
    created() {
        this.pos = {}
    },
    methods: {
        // 获取元素,为了看起来短一点
        getPB() {
            return this.$refs.progressBar
        },
        getP() {
            return this.$refs.progress
        },
        progressClick(e) {

            const rect = this.getPB().getBoundingClientRect()
            const offsetHeight = this.getPB().clientHeight - (e.pageY - rect.top)
            this._offset(offsetHeight)
            this._triggerPercent()
        },
        progressStart(e) {
            this.pos.init = true
            this.pos.startY = e.pageY
            // 当前进度条位置
            this.pos.bottom = this.getP().clientHeight
            // var _this = this
            document.addEventListener('mousemove', (e) => {
                if (!this.pos.init) {
                    return
                }
                const deltaY = this.pos.startY - e.pageY
                // 限定范围， 0到进度条最大值
                const offsetHeight = Math.min(this.getPB().clientHeight - progressBtnHeight, Math.max(0, this.pos.bottom + deltaY))
                this._offset(offsetHeight)
                this._triggerPercent()

            });
            // 在屏幕上点击取消显示
            let handler = event.addEvent(document, 'click', ()=>{
                this.pos.init = false
                event.removeEvent(document, 'click', handler)
            })
        },
        _triggerPercent() {
            const barHeight = this.getPB().clientHeight - progressBtnHeight
            const percent = this.getP().clientHeight / barHeight
            this.$emit('percentChange', percent)
        },
        // 视图的变化
        _offset(offsetHeight) {
            this.getP().style.height = `${offsetHeight}px`
            this.$refs.progressBtn.style[transform] = `translate3d(0, -${offsetHeight}px, 0)`
        }
    },
    watch: {
        // 值必须发生变化，才会触发变动
        percent(newPercent) {
            if (newPercent >= 0 && !this.pos.init) {
                const barHeight = this.getPB().clientHeight - progressBtnHeight
                const offsetHeight = newPercent * barHeight
                this._offset(offsetHeight)
            }
        }
    }
}
</script>
<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.volume-progress  
    height: 100px;
    width: 12px;
    box-sizing border-box
    position: absolute
    padding: 1% 4px;
    bottom: 30px;
    left: 1px;
    border-radius: 3px;
    background: $color-text-l 
    &.fade-enter-active, &.fade-leave-active
        transition all .4s
    &.fade-enter , &.fade-leave-to
        opacity 0
    .bar-inner
        position relative
        height 98%
        border-radius 3px
        background rgba(0, 0, 0, .3)
        .progress
            position absolute
            width  100%
            bottom 0
            background $color-theme
        .progress-btn-wrapper
            position absolute
            bottom 0%
            width 21px
            .progress-btn
                position relative
                left -9px
                box-sizing border-box
                width 21px
                height 4px
                border-radius 1px
                background $color-theme 
                &:before
                    content ''
                    display block
                    position relative
                    top -16px
                    left -16px
                    right -16px
                    bottom -16px
</style>
