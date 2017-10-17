<template>
    <div class="recommend" @mouseenter="clearTimer" @mouseleave="setTimer" ref="recommend">
        <!-- <h3 class="title">精彩推荐</h3> -->
        <div class="box">
            <div class="wrapper">
                <li class="item" :class="itemClass[index]" v-for="(item, index) in data" :key="index">
                    <a :href="item.jumpurl" @click="itemClick(index, $event)">
                        <img :src="item.pic" alt="">
                    </a>
                </li>

            </div>
            <div class="operator">
                <span class="btn" v-for="(item, index) in data" :key="index" @click="btnClick(index)" :class="{active: currentIndex == index}"></span>
            </div>
        </div>
        <arrow :showArrow="showArrow" @prev="prev" @next="next"></arrow>

    </div>
</template>
<script>
import Arrow from 'base/arrow'
import { fixedMouse } from 'common/js/util'
export default {
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            recommends: [],
            useClass: [],
            currentIndex: 2,
            showArrow: false,
            originclass: []
        }
    },

    computed: {
        itemClass() {
            return this.useClass
        }
    },
    mounted() {
        this.initData();

        //创建css
        var dom = `<style>${this.createStyle()}<style>`;
        var head = document.getElementsByTagName('head')[0]
        head.innerHTML += dom;
        let arr = []
        for (let i = 0; i < this.data.length; i++) {
            arr.push(`p${i}`)
        }
        this.originclass = arr
        this.useClass = Array.prototype.slice.call(this.originclass);
        this.timer = setInterval(this.main, 4000);
    },
    created() {

    },
    methods: {
        initData() {
            this.data.map(function(item) {
                if (item.type == 10002 && item.jumpurl == '') {
                    item.jumpurl = `https://y.qq.com/n/yqq/album/${item.id}.html`
                } else if (item.type == 10012 && item.jumpurl == '') {
                    item.jumpurl = `https://y.qq.com/n/yqq/mv/v/${item.id}.html`
                }
            })
        },
        createStyle() {

            let style = ''
            for (let i = 0; i < this.data.length; i++) {

                let opacity = i == 2 ? 1 : (i - 2) * (i - 2) == 1 ? 0.9 : 0;
                let transition = 'transition:none;';
                style += `.p${i}{transform:translate3d(${this.getTransX(i)}px, 0, 0) scale(${i == 2 ? 1 : 0.81});opacity: ${opacity};z-index:${i == 2 ? 1 : 0};${i == this.data.length - 1 ? transition : ''}}`
            }
            return style
        },
        getTransX(index) {
            let width = 751
            return (width * 0.81 * 0.81 + (width * 0.19) / 2) * (index - 2)
        },

        setTimer(e) {
            this.showArrow = false
            this.timer = setInterval(this.main, 4000);

            // e = e || window.event
            // let target = this.$refs.recommend

            // if (fixedMouse(e, target)) {
            //     this.showArrow = false
            //     this.timer = setInterval(this.main, 4000);
            // }

        },
        clearTimer(e) {
            this.showArrow = true
            // e = e || window.event
            // let target = this.$refs.recommend
            // if (fixedMouse(e, target)) {
            //     this.showArrow = true

            // }
            clearInterval(this.timer)
        },
        prev() {
            this.main(-1)
        },
        next() {
            this.main(1);
        },
        move(i) {
            //变换位置，为不同的item添加相应的class
            i = i < 2 ? this.data.length + i : i;
            var tempArr = this.originclass.slice();
            for (var j = 2; j < i; j++) {
                tempArr.unshift(tempArr.pop());
            }
            this.useClass = tempArr;

        },
        btnClick(i) {
            this.currentIndex = i;
            this.move(i);
        },
        itemClick(i, event) {
            if (i != this.currentIndex) {
                this.currentIndex = i;
                this.move(i)
                event.preventDefault();
            }
        },
        main(dir) {
            this.currentIndex = this.currentIndex + (Math.abs(dir) == 1 ? dir : 1);
            if (this.currentIndex > this.data.length - 1) {
                this.currentIndex = 0
            } else if (this.currentIndex < 0) {
                this.currentIndex = this.data.length - 1;
            }
            this.move(this.currentIndex);
        }
    },
    components: {
        Arrow
    }
}



</script>
<style lang="stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

$image-width = 750;

// getTransX(index)
// t = index - 2
// ($image-width * 0.81 * 0.81 + ( $image-width * 0.19 ) / 2 ) * t px
.recommend {
    position: relative;
    background: url('./bg_index_new.jpg') no-repeat;
    background-size: cover;
    overflow: hidden;
    padding-top: 40px;
    padding-bottom: 20px;

    .title {
        text-align: center;
        font-size: 40px;
    }

    .box {
        width: 1200px;
        margin: 20px auto;
        padding-bottom: 24px;
        height: 300px;
        position: relative;

        .wrapper {
            position: relative;
            overflow: hidden;
            height: 100%;

            .item {
                position: absolute;
                top: 0;
                left: 50%;
                margin-left: -($image-width / 2) px;
                width: $image-width px;
                height: 300px;
                background: url('~common/image/loading.gif') no-repeat;
                background-position: center center;
                background-size: 64px 64px;
                transition: all 0.3s ease-out;

                a {
                    display: block;
                    width: 100%;
                    height: 100%;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }

        .operator {
            text-align: center;
            margin-top: 20px;

            .btn {
                display: inline-block;
                width: 30px;
                height: 5px;
                border-radius: 2px;
                margin-right: 5px;
                font-size: 12px;
                background: #eee;
                text-align: center;
                cursor: pointer;
                color: #585757;
                line-height: 20px;

                &.active {
                    background: $color-theme-d;
                    opacity: 0.8;
                }
            }
        }
    }
}
</style>
