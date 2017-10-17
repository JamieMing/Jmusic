import Vue from 'vue'
import Router from 'vue-router'
// import Music from 'components/music/music'
// import Index from '@/components/index/index'
// import Singer from '@/components/singer/singer'
// import Rank from '@/components/rank/rank'
// import Disc from '@/components/disc/disc'
// import SingerInfo from '@/components/singer-info/singer-info'
// import Album from '@/components/album/album'
// import Discs from '@/components/discs/discs'
// import AlbumInfo from 'components/album-info/album-info'
// import SingleSong from 'components/single-song/single-song'
// import User from 'components/user/user'
Vue.use(Router)

//组件异步请求，代码分割 
const Music = ((resolve)=>{
  import('components/music/music').then((module)=>{
    resolve(module)
  })
})
const Index = ((resolve)=>{
  import('components/index/index').then((module)=>{
    resolve(module)
  })
})
const Singer = ((resolve)=>{
  import('components/singer/singer').then((module)=>{
    resolve(module)
  })
})
const Rank = ((resolve)=>{
  import('components/rank/rank').then((module)=>{
    resolve(module)
  })
})
const Disc = ((resolve)=>{
  import('components/disc/disc').then((module)=>{
    resolve(module)
  })
})
const SingerInfo = ((resolve)=>{
  import('components/singer-info/singer-info').then((module)=>{
    resolve(module)
  })
})
const Discs = ((resolve)=>{
  import('components/discs/discs').then((module)=>{
    resolve(module)
  })
})
const AlbumInfo = ((resolve)=>{
  import('components/album-info/album-info').then((module)=>{
    resolve(module)
  })
})
const SingleSong = ((resolve)=>{
  import('components/single-song/single-song').then((module)=>{
    resolve(module)
  })
})
const User = ((resolve)=>{
  import('components/user/user').then((module)=>{
    resolve(module)
  })
})
const Album = ((resolve)=>{
  import('components/album/album').then((module)=>{
    resolve(module)
  })
})

//路由设置 
export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      redirect: '/music/index'
    },
    {
      path: '/music',
      redirect: '/music/index',
      name: 'Index',
      component: Music,
      children: [{
          path: '/music/index',
          component: Index
        },
        {
          path: '/music/disc/:mid',
          name: 'Disc',
          component: Disc
        },
        {
          path: '/music/singer',
          name: 'Singer',
          component: Singer
        },
        {
          path: '/music/rank',
          name: 'Rank',
          component: Rank,
          children:[{
            path: '/music/rank/:id',
            component: Rank
          }]
        },{
          path: '/music/singerinfo/:mid',
          name: 'SingerInfo',
          component: SingerInfo
        },{
          path:'/music/album',
          name: 'Album',
          component: Album
        },
        {
          path:'/music/singlesong/:mid',
          name: 'SingleSong',
          component: SingleSong
        },
        {
          path:'/music/albuminfo/:mid',
          name: 'AlbumInfo',
          component: AlbumInfo
        },
        {
          path:'/music/discs',
          name: 'Discs',
          component: Discs
        }
      ]
    },
    {
      path: '/user',
      component: User
    }

  ],
  //滚动到顶部 
  scrollBehavior (to, from, savedPosition) {
    // console.log(this.$el);
    return {y: 0}
  }
})
