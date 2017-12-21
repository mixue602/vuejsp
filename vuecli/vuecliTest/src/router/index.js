import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import hi from '@/components/hi'
import hi11 from '@/components/hi11'
import hi22 from '@/components/hi22'
import router1 from '@/components/router1'
import router2 from '@/components/router2'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      components: {
        default:HelloWorld,
        left:router1,
        right:router2,
      }
    },
    {
      path: '/change',
      name: 'HelloWorld',
      components: {
        default:HelloWorld,
        left:router2,
        right:router1,
      }
    },
    {
      path:'/hi',
      component:hi,
      children:[
        {
          path:'/',
          name:'HelloWorld/hi',
          component:hi
        },
        {
          path:'hi11',
          name:'hi11',
          component:hi11
        },
        {
          path:'hi22',
          name:'HelloWorld/hi/hi11',
          component:hi22
        }
      ]
    }
  ]
})
