import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Events from '../components/Events.vue'
import HostEvent from '../components/HostEvent.vue'
import ThemeEvents from '../components/ThemeEvents.vue'
import EventDetails from '../components/EventDetails.vue'
import AdminPanel from '../components/AdminPanel.vue'
import Requests from '../components/Requests.vue'
import AddEvent from '../components/AddEvent.vue'
import Communities from '@/components/communities.vue'
import CommunityView from '@/components/communityView.vue'
import AdminCommunity from '@/components/AdminCommunity.vue'

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
      path: '/event/:id', // ✅ Corrected path
      name: 'event-details',
      component: EventDetails,
    },
    {
      path:'/communities',
      component:Communities,
    },
    {
      path: '/communities/:id',
      name: 'community-view',
      component: CommunityView
    },
    // Admin Panel with nested children
    {
      path: '/admin-panel',
      name:'admin-panel',
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
        },
        {
          path:'/add-community',
          name:'admin-add-community',
          component:AdminCommunity
        },
        {
          path: '/admin/edit-event/:id',
          name: 'admin-edit-event',
          component: HostEvent,
          props: route => ({ isEdit: true, eventId: route.params.id })
        }

      ]
    }
  ]
})

import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const ui = useUiStore();

  // Define paths that require authentication
  const protectedRoutes = ['/communities', '/host-event', '/events']; // Customize this list
  const needsAuth = protectedRoutes.includes(to.path);

  if (needsAuth && !auth.user) {
    ui.openPanel('login'); // 🔐 show login panel
    next(false);           // ❌ cancel navigation
  } else {
    next();                // ✅ allow navigation
  }
});

export default router;