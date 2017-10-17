import { mapActions } from 'vuex'
import { playMode, showMode, favoriteType } from 'common/js/config'
const favoriteLists = {
    [favoriteType.song]: 'favoriteSongList',
    [favoriteType.album]: 'favoriteAlbumList',
    [favoriteType.singer]: 'favoriteSingerList',
    [favoriteType.diss]: 'favoriteDissList'
}
//共用的收藏方法 
export const favoriteMixin = {
    data(){
        return {
            favoriteType: favoriteType.song
        }
    },
    created(){
        this.initFavoriteType()
    },
    computed:{
        favoriteList(){
            return this.$store.getters[favoriteLists[this.favoriteType]]
        }
    },
    methods:{
        initFavoriteType(){
            throw new Error('component must implement handlePlaylist method')
        },
        //收藏相关
        isFavorite(obj) {
            const index = this.favoriteList.findIndex((item) => {
                return item.id === obj.id
            })
            return index > -1
        },
        getFavoriteIcon(obj) {
            if (this.isFavorite(obj)) {
                return 'icon-favorite'
            }
            return 'icon-not-favorite'
        },
        toggleFavorite(obj) {
            if (this.isFavorite(obj)) {
                this.deleteFavoriteList({
                    data: obj,
                    type: this.favoriteType
                })
            } else {
                this.saveFavoriteList({
                    data: obj,
                    type: this.favoriteType
                })
            }
        },
        favoriteTitle(obj) {
            return this.isFavorite(obj) ? '取消收藏' : '点击收藏'
        },
        favoriteText(obj) {
            return this.isFavorite(obj) ? '已收藏' : '收藏'
        },
        ...mapActions([
            "saveFavoriteList",
            "deleteFavoriteList",
        ])
    }
}