<template>
  <div class="sticky top-0 z-20 bg-gray-950 border-b border-gray-800 shadow-md">
    <header class="bg-gray-950 shadow-md border border-gray-800 text-green-300 px-8 py-4 flex items-center justify-between gap-4 transition-all">
      <div class="flex items-center w-full gap-4 justify-between">
        <!-- Logo -->
        <img
          src="../nearbyHappeningsLogo.png"
          alt="Nearby Happenings Logo"
          class="h-8 object-contain"
        />

        <!-- Search Bar -->

        <div class="relative w-full max-w-2xl ml-44">
          <input
            v-model="searchStore.searchQuery"
            @focus="handleInputFocus"
            @blur="searchStore.handleBlur"
            type="text"
            placeholder="Search for Events"
            class="w-full py-1.5 px-4 rounded-full bg-transparent border border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          />

          <button
            @click="searchStore.handleSearchClick(router)"
            class="px-4 text-white hover:text-green-400 absolute right-[2px] top-2"
          >
            <span class="material-icons text-teal-500">search</span>
          </button>

          <!-- Tag Pills -->
          <div
            v-if="searchStore.inputFocused"
            class="absolute top-full mt-5 left-0 w-full flex gap-2 z-50 overflow-x-auto whitespace-nowrap hide-scrollbar px-1"
          >
            <button
              v-for="type in searchStore.filteredTags"
              :key="type"
              @mousedown.prevent="searchStore.selectType(type)"
              class="border border-teal-500 text-teal-400 rounded-full px-4 py-1.5 text-sm font-medium transition-all hover:bg-teal-600/20 hover:border-teal-500 hover:text-teal-400"
            >
              {{ type }}
            </button>
          </div>

          <div
            v-if="searchStore.inputFocused && (searchStore.searchQuery || searchStore.filteredResults.length > 0)"
            class="absolute left-0 w-full mt-16 z-40 bg-gray-900 rounded-xl p-4 shadow-lg max-h-96 overflow-y-auto"
          >
            <!-- Results -->
            <div
              v-for="result in searchStore.filteredResults"
              :key="result._id"
              @click="searchStore.goToEvent(result,router)"
              @mousedown.prevent="searchStore.selectResult(result,router)"
              class="relative flex items-center py-2 pl-10 pr-4 hover:bg-gray-800 rounded cursor-pointer text-white transition duration-150"
            >
              <span class="material-icons absolute left-3 text-teal-500">search</span>
              {{ result.eventName }}
            </div>

            <!-- No results fallback -->
            <div
              v-if="searchStore.searchQuery && searchStore.filteredResults.length === 0"
              class="text-gray-400 text-sm text-center py-2"
            >
              No results found.
            </div>
          </div>
        </div>

        <!-- Location -->
        <div
          class="flex items-center gap-1 text-gray-400 hover:text-teal-400 cursor-pointer transition-colors pr-4 text-sm"
          @click="handleLocationModel"
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
            <span
              class="material-icons text-teal-400"
              style="font-size: 28px"
              @click="openPanel('profile')"
              >account_circle</span
            >
          </div>
        </div>
      </div>
    </header>

    <!-- Top Navigation -->
    <nav class="bg-card/50 bg-gray-950 backdrop-blur-sm px-10 py-2.5 overflow-x-auto hide-scrollbar">
      <ul class="flex items-center gap-8 whitespace-nowrap">
        <li
          v-for="item in navItems"
          :key="item.name"
          class="relative group cursor-pointer"
        >
          <router-link
            :to="item.route"
            class="flex items-center gap-2 text-sm font-medium transition-all duration-300"
            :class="activeNav === item.name 
              ? 'text-teal-500' 
              : 'text-gray-400'"
            @click="activeNav = item.name"
          >
            <span>{{ item.name }}</span>
          </router-link>
          <div
            v-if="activeNav === item.name"
            class="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full shadow-[0_0_10px_theme(colors.primary/0.5)]"
          ></div>
        </li>
      </ul>
    </nav>
  </div>
</template>


<script setup>
import { ref, computed, onMounted ,watch} from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSearchStore } from '@/stores/search'
import { usePreferencesStore } from '@/stores/preferences'
import { useUiStore } from '@/stores/ui'
import {api} from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()

// Auth state
const authStore = useAuthStore()
const isLoggedIn = computed(() => !!authStore.user)

// Preferences
const preferencesStore = usePreferencesStore()
const selectedCity = computed(() => preferencesStore.selectedCity)

// UI control
const uiStore = useUiStore()
const openPanel = uiStore.openPanel

// Search logic
const searchStore = useSearchStore()
const {
  setAllTags
} = searchStore

// Navigation items
const navItems = [
  { name: 'Home', icon: 'home', route: '/' },
  { name: 'Events', icon: 'celebration', route: '/events' },
  { name: 'Community', icon: 'groups', route: '/communities' },
  { name: 'Host', icon: 'description', route: '/host-event' },
]

const activeNav = ref('Home')

function handleInputFocus() {
  if (!authStore.user || !authStore.user._id) {
    uiStore.openPanel('login')
    return
  }
  searchStore.inputFocused = true
}

function handleLocationModel() {
  if (!authStore.user || !authStore.user._id) {
    uiStore.openPanel('login')
    return
  }
  uiStore.showLocationModal = true
}


watch(() => searchStore.searchQuery, async (newQuery) => {
  console.log('User typed:', newQuery)
  if (!newQuery.trim()) {
    searchStore.filteredResults = []
    return
  }
  await searchStore.fetchSearchResults(newQuery)
})


// Load tags on mount
onMounted(async () => {
  const res = await api.get('/events/tags')
  console.log("TAGS:", res.data) // Should be an array of strings
  setAllTags(res.data)
})

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