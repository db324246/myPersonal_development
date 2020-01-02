import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'wisdomForm',
      component: () => import('@/views/addFrom')
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('@/views/preview')
    }
  ]
})
