<template>
  <div id="app">
    <jheader></jheader>
    <keep-alive>
      <router-view v-show="!playerShowMode"></router-view>
    </keep-alive>
    <player></player>
    <playlist></playlist>
    <bottom></bottom>
  </div>
</template>

<script>
import Jheader from 'components/Jheader/Jheader'
import Player from 'components/player/player'
import Playlist from 'components/playlist/playlist'
import {mapGetters} from 'vuex'
import {showMode} from 'common/js/config'
import Bottom from 'components/bottom/bottom'
export default {
  name: 'app',
  computed:{
    playerShowMode(){
      return this.showMode === showMode.fullScreen
    },
    ...mapGetters([
      "showMode"
    ])
  },
  components: {
    Jheader,
    Player,
    Playlist,
    Bottom
  }
}
</script>

<style>

</style>
