import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Events from '../components/Events.vue'
import HostEvent from '../components/HostEvent.vue'
import ThemeEvents from '../components/ThemeEvents.vue'
import EventDetails from '../components/EventDetails.vue'
import AdminPanel from '../components/AdminPanel.vue'
import Requests from '../components/Requests.vue'
import AddEvent from '../components/AddEvent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // User routes
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/events',
      name: 'events',
      component: Events
    },
    {
      path: '/host-event',
      name: 'host-event',
      component: HostEvent
    },
    {
      path: '/events/:theme',
      name: 'theme-events',
      component: ThemeEvents,
      props: true
    },
    {
      path: '/events/:theme/:id', // ✅ Corrected path
      name: 'event-details',
      component: EventDetails,
      props: true,
    },
    // Admin Panel with nested children
    {
      path: '/admin-panel',
      component: AdminPanel,
      children: [
        {
          path: '', // default child route when /admin-panel is visited
          redirect: 'requests'
        },
        {
          path: '/requests',
          name: 'admin-requests',
          component: Requests
        },
        {
          path: '/add-event',
          name: 'admin-add-event',
          component: AddEvent
        }
      ]
    }
  ]
})
export default router;