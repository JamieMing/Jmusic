<template>
    <div class="progress-bar" ref="progressBar" @click.stop="progressClick" :class="{'full-screen':isFullScreen}">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn" @mousedown.stop="progressStart">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
    <!-- @mousemove.stop="progressMove" 
                            @mouseup.stop="progressUp"
                            @mouseout.stop="progressUp" -->
</template>
<script>
import { prefixStyle } from 'common/js/dom'
import { fixedMouse } from 'common/js/util'

const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
    props: {
        percent: {
            type: Number,
            default: 0
        },
        isFullScreen:{
            type: Boolean,
            default: false
        }
    },
    created() {
        this.pos = {}
    },
    
    methods: {
        progressClick(e) {
            const rect = this.$refs.progressBar.getBoundingClientRect()
            const offsetWidth = e.pageX - rect.left
            this._offset(offsetWidth)
            this._triggerPercent()
        },
        progressStart(e) {
            this.pos.init = true
            this.pos.startX = e.pageX
            // 当前进度条位置
            this.pos.left = this.$refs.progress.clientWidth
            // var _this = this
            document.addEventListener('mousemove', (e) => {
                if (!this.pos.init) {
                    return
                }
               
                    const deltaX = e.pageX - this.pos.startX
                    // 限定范围， 0到进度条最大值
                    const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.pos.left + deltaX))
                    this._offset(offsetWidth)
                
            })
            document.addEventListener('mouseup', () => {
                this.pos.init = false
                this._triggerPercent()

            })
        },
        progressMove(e) {
            if (!this.pos.init) {
                return
            }
            const deltaX = e.pageX - this.pos.startX
            // 限定范围， 0到进度条最大值
            const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.pos.left + deltaX))
            this._offset(offsetWidth)

        },
        progressUp() {
            this.pos.init = false
            this._triggerPercent()
        },
        _triggerPercent() {
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
            const percent = this.$refs.progress.clientWidth / barWidth
            this.$emit('percentChange', percent)
        },
        _offset(offsetWidth) {
            this.$refs.progress.style.width = `${offsetWidth}px`
            this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        }
    },
    watch: {
        percent(newPercent) {
            if (newPercent >= 0 && !this.pos.init) {
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
                const offsetWidth = newPercent * barWidth
                this._offset(offsetWidth)
            }
        }
    }
}
</script>
<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.progress-bar   
    height 30px
    cursor pointer
    .bar-inner
        position relative
        top 13px
        height 4px
        background rgba(0, 0, 0, .3)
        .progress
            position absolute
            height 100%
            background $color-theme
        .progress-btn-wrapper
            position absolute
            left -8px
            top -13px
            width 30px
            height 30px
            .progress-btn
                position relative
                top 7px
                left 7px
                box-sizing border-box
                width 16px
                height 16px
                border 3px solid #fff 
                border-radius 50%
                background $color-theme 
                &:before
                    content ''
                    display block
                    position relative
                    top -5px
                    left -5px
                    right -5px
                    bottom -5px
    &.full-screen
        .bar-inner
            background $color-text-l
</style>
