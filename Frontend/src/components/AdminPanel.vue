<template>
    <div class="flex flex-1">
      <!-- Sidebar -->
  <aside class="fixed top-15 left-0 h-screen w-24 bg-gray-900 text-white flex flex-col justify-between items-center py-8 z-20">
    <nav class="p-2 flex flex-col items-center">
      <ul class="space-y-10 w-full">
        <li><img
          src="../nearbyHappeningsLogo.png"
          alt=""
          class="h-12 object-contain"
        /></li>
        <li
          v-for="item in navItems"
          :key="item.name"
          class="w-full rounded-xl transition-colors"
          :class="{
            'bg-teal-700/30': activeNav === item.name,
            'hover:bg-teal-700/30': true
          }"
        >
          <router-link
            :to="item.route"
            class="flex flex-col items-center justify-center p-4 w-full"
            @click="activeNav = item.name"
          >
            <!-- Icon -->
            <span class="material-icons text-teal-400 text-5xl mb-1">
              {{ item.icon }}
            </span>
            <!-- Label -->
            <span class="text-base text-gray-300 font-medium">
              {{ item.name }}
            </span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
  <div class="flex-1 p-3 px-7">
    <router-view /> 
  </div>
  </div>
</template>

<script setup>

import {ref} from 'vue'
import Requests from './Requests.vue'

const activeNav = ref(Requests)
const navItems = ref([
  { name: 'Requests', icon: 'notifications', route: '/requests' },
  { name: 'AddEvent', icon: 'add_circle', route: '/add-event' },
])

</script>