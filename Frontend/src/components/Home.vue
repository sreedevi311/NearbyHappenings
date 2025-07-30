<template>
  <div class="flex flex-col">
    
    <div class="flex flex-1">
      <!-- Main Content -->
      <main class="flex-1 overflow-x-hidden">
        <div class="relative isolate overflow-hidden rounded-xl bg-black/30  backdrop-blur-xl mb-12">
          <!-- Neon Glow Background Blobs -->
          <div class="absolute inset-0 -z-10">
  <!-- Main dark base: subtle gray-950 background wash -->
  <div class="absolute inset-0 bg-gray-950/80"></div>

  <!-- Overlay gradient wash: cyan to emerald -->
  <div class="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-emerald-300/10 mix-blend-screen"></div>

  <!-- Top-right cyan to blue glow -->
  <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-neon-cyan/20 to-neon-blue/10 rounded-full blur-3xl mix-blend-screen"></div>

  <!-- Mid-center green glow -->
  <div class="absolute bottom-1/4 left-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-emerald-300/20 to-green-400/10 rounded-full blur-3xl mix-blend-screen"></div>

  <!-- Bottom-left green glow -->
  <div class="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-400/30 to-green-500/10 rounded-full blur-3xl mix-blend-screen"></div>
</div>




          <!-- Carousel -->
          <carousel :events="upcomingEvents" class="pt-10" />
        </div>


        <div v-if="Object.keys(groupedEvents).length" class="space-y-5 px-4">
          <div v-for="(events, theme) in groupedEvents" :key="theme">
            <h2 class="text-2xl font-bold text-teal-400 mb-4">{{ theme }} Events</h2>

            <div class="flex gap-6 overflow-x-auto hide-scrollbar pb-4">
              <EventCard
                v-for="event in events"
                :key="event._id"
                :event="event"
                class="min-w-[300px] mt-4"
              />
             </div>
           </div>
        </div>

        <div v-if="Object.keys(groupedEvents).length===1" class="flex items-center justify-center h-24">
          <button 
            @click="goToEvents"
            class="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full font-medium flex items-center gap-1 transition-all"
            >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Explore More Theme Events
          </button>
        </div>
      </main>
    </div>

    <!-- Slide-in Panel -->
    <transition name="slide">
      <div
        v-if="ui.showPanel"
        class="fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 bg-gray-900 shadow-lg z-50 overflow-y-auto"
      >
        <button
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-300"
          @click="ui.closePanel"
        >
          <span class="material-icons">close</span>
        </button>
        <component
          :is="ui.activeComponent"
          @switchPanel="handleSwitch"
          @loginSuccess="handleLoginSuccess"
          @signupSuccess="handleSignupSuccess"
          @signOut="handleSignOut"
        />
      </div>
    </transition>

    <LocationSelector
      v-if="ui.showLocationModal"
      @select="handleLocationSelect"
      @close="ui.showLocationModal = false"
    />

    <InterestSelector
      v-if="ui.showInterestModal"
      @submit="handleThemeSelection"
      @close="ui.showInterestModal = false"
    />
  </div>
</template>





<script setup>
import {ref, computed, watch, onMounted } from 'vue'
import { api } from '../services/api'
import EventCard from './EventCard.vue'
import carousel from './carousel.vue'
import LocationSelector from './LocationSelector.vue'
import InterestSelector from './InterestSelector.vue'

import { useAuthStore } from '@/stores/auth'
import { useEventStore } from '@/stores/event'
import { useUiStore } from '@/stores/ui'
import { usePreferencesStore } from '@/stores/preferences'

const authStore = useAuthStore()
const eventStore = useEventStore()
const ui = useUiStore()
const prefs = usePreferencesStore()

const upcomingEvents = computed(() => eventStore.upcomingEvents)
const groupedEvents = computed(() => eventStore.groupedEvents)

async function handleLoginSuccess() {
  const user = authStore.user
  if (!user || !user._id) {
    console.error("❌ User data missing after login")
    return
  }

  try {
    console.log("🔄 Fetching events for user:", user._id)
    await eventStore.fetchGroupedEvents(user._id)
    await eventStore.fetchUpcomingEvents(user._id)
    console.log("✅ Events fetched successfully")
  } catch (err) {
    console.error("❌ Failed to fetch events after login:", err)
  }

  ui.closePanel()
  console.log('🎉 User logged in:', user.email)
}

function handleSignupSuccess(user) {
  ui.closePanel()
  console.log('User signed up:', user.email)
  if (!authStore.user?.location || !authStore.user?.interests?.length) {
    ui.showLocationModal = true
  }
}

async function handleSignOut() {
  await authStore.logout()
  console.log('logged out!')
  prefs.setCity('Select Location')
  ui.closePanel()
}

function handleLocationSelect(city) {
  prefs.setCity(city)
  ui.showLocationModal = false
  ui.showInterestModal = true
}

async function handleThemeSelection(themes) {
  console.log('📌 handleThemeSelection called with themes:', themes)

  prefs.setThemes(themes)
  ui.showInterestModal = false

  try {
    const themeIds = prefs.selectedThemes.map(t => t._id)
    const city = prefs.selectedCity

    console.log('📤 Calling authStore.updatePreferences with:', city, themeIds)

    await authStore.updatePreferences(city, themeIds)

    const userId = authStore.user?._id
    if (userId) {
      await eventStore.fetchGroupedEvents(userId)
      await eventStore.fetchUpcomingEvents(userId)
      console.log('✅ Events fetched after updating preferences')
    } else {
      console.warn('⚠️ User ID missing after preferences update')
    }

  } catch (err) {
    console.error('❌ Failed to save preferences in handleThemeSelection:', err)
  }
}

function goToEvents() {
  if (!authStore.user || !authStore.user._id) {
    ui.openPanel('login')
    return
  }
  router.push('/events')
}

watch(
  () => authStore.user,
  async (user) => {
    if (user && user._id) {
      await eventStore.fetchGroupedEvents(user._id)
      await eventStore.fetchUpcomingEvents(user._id)
      if (user?.city) {
        prefs.setCity(user.city)
        console.log('🌆 selectedCity updated from user:', prefs.selectedCity)
      }
    } else {
      try {
        const response = await api.get('/events/upcoming-day-events')
        eventStore.upcomingEvents = response.data
      } catch (error) {
        console.error("❌ Failed to fetch default events:", error)
      }

      try {
        const { data } = await api.get('/events/random-theme-events')
        eventStore.groupedEvents = {
          [data.theme]: data.events
        }
      } catch (err) {
        console.error('❌ Failed to fetch random theme events:', err)
      }
    }
  },
  { immediate: true }
)

onMounted(async () => {
  await authStore.fetchProfile()
  if (authStore.user?.city) {
    prefs.setCity(authStore.user.city)
  }
})
</script>


<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE & Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>