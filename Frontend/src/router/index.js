import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Events from '../components/Events.vue'
import HostEvent from '../components/HostEvent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },{
      path:'/events',
      name:'events',
      component:Events,
    },{
      path:'/host-event',
      name:'host-event',
      component:HostEvent
    }
  ],
})

export default router
