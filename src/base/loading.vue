<template>
  <div class="loading">
    <img :width="size" :height="size" src="../common/image/loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      },
      size:{
          type:Number,
          default: 24
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"

  .loading
    width: 100%
    text-align: center
    .desc
      margin-top 20px
      line-height: 20px
      font-size: $font-size-medium-x
      color: $color-text
</style>