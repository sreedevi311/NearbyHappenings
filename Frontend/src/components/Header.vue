<template>
    <header class="sticky top-0 z-10 bg-gray-900 shadow-md border border-gray-800 text-green-300 px-8 py-4 flex items-center justify-between gap-4 transition-all bg-gray-900">
  <div class="flex items-center w-full gap-4 justify-between">
    <!-- Logo -->
    <img
      src="../nearbyHappeningsLogo.png"
      alt="Nearby Happenings Logo"
      class="h-8 object-contain"
    />

    <!-- Search Bar -->
    <div class="relative flex-grow px-8">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search events, artists, venues..."
        class="w-full py-2 px-3 pr-10 rounded-full bg-gray-800 border border-gray-600 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
      />
      <span class="material-icons absolute right-10 top-2 text-gray-500 text-sm">search</span>

      <!-- Tag pills -->
      <div
        v-if="searchQuery"
        class="absolute top-full left-0 w-full flex gap-2 mt-2 z-50 overflow-x-auto whitespace-nowrap hide-scrollbar px-1"
      >
        <button
          v-for="type in filteredEventTypes"
          :key="type"
          @click="selectType(type)"
          class="border border-teal-500 text-teal-400 rounded-full px-3 py-1 textsms font-medium transition-all hover:bg-teal-600/20 hover:border-teal-500 hover:text-teal-400"
        >
          {{ type }}
        </button>
      </div>
    </div>

    <!-- Location -->
    <div
      class="flex items-center gap-1 text-gray-400 hover:text-teal-400 cursor-pointer transition-colors pr-4 text-sm"
      @click="uiStore.showLocationModal=true"
    >
      <span class="material-icons text-teal-400 text-base">location_on</span>
      <span class="font-medium">{{ selectedCity || 'Select Location' }}</span>
    </div>

    <!-- Sign In / Profile -->
    <div>
      <button
        v-if="!isLoggedIn"
        @click="openPanel('login')"
        class="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-3 py-1.5 text-sm rounded-full transition-colors"
      >
        Sign In
      </button>
      <div v-else class="flex items-center cursor-pointer px-3">
        <span class="material-icons text-teal-400" style="font-size: 28px" @click="openPanel('profile')">account_circle</span>
      </div>
    </div>
  </div>
</header>

    <!-- Top Navigation -->
    <nav class="bg-gray-800 text-gray-400 px-10 py-2 border-t border-b border-gray-800 flex items-center gap-6 justify-start overflow-x-auto hide-scrollbar">
      <ul class="flex items-center gap-6 whitespace-nowrap">
        <li
          v-for="item in navItems"
          :key="item.name"
          class="cursor-pointer text-sm font-medium transition-colors"
          :class="{
            'text-teal-400 pb-1': activeNav === item.name,
            'hover:text-teal-300': true
          }"
        >
          <router-link
            :to="item.route"
            class="flex items-center gap-2"
            @click="activeNav = item.name"
          >
            <span>{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSearchStore } from '@/stores/search'
import { usePreferencesStore } from '@/stores/preferences'
import { useUiStore } from '@/stores/ui'

const authStore = useAuthStore()
const isLoggedIn = computed(() => !!authStore.user)

const searchStore = useSearchStore()
const { searchQuery, filteredEventTypes, selectType } = searchStore

const preferencesStore = usePreferencesStore()
const selectedCity = computed(() => preferencesStore.selectedCity)

const uiStore = useUiStore()
const openPanel = uiStore.openPanel

const navItems = [
  { name: 'Home', icon: 'home', route: '/' },
  { name: 'Events', icon: 'celebration', route: '/events' },
  { name: 'Community', icon: 'groups', route: '/communities' },
  { name: 'Host', icon: 'description', route: '/host-event' },
]

const activeNav = ref('Home')
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE & Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>