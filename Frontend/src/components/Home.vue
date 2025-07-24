<template>
  <div class="flex flex-col min-h-screen bg-black text-gray-300">
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-black shadow-md border border-gray-800 text-green-300 px-4 pb-3 flex items-center justify-between gap-4  transition-all">
      <div class="flex items-center w-full px-4 pt-6 gap-4 justify-between">
        <!-- Logo -->
        <img
          src="../nearbyHappeningsLogo.png"
          alt="Nearby Happenings Logo"
          class="h-10 object-contain"
        />

        <!-- Search Bar -->
        <div class="relative flex-grow px-10">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search events, artists, venues..."
            class="w-full py-2 px-4 pr-10 rounded-full bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          />
          <span class="material-icons absolute right-14 top-2.5 text-gray-500">search</span>

          <!-- Tag pills -->
          <div
            v-if="searchQuery"
            class="absolute top-full left-0 w-full flex gap-2 mt-2 z-50 overflow-x-auto whitespace-nowrap hide-scrollbar px-1"
          >
            <button
              v-for="type in filteredEventTypes"
              :key="type"
              @click="selectType(type)"
              class="border border-teal-500 text-teal-400 rounded-full px-4 py-1.5 text-sm font-medium transition-all hover:bg-teal-600/20 hover:border-teal-500 hover:text-teal-400"
            >
              {{ type }}
            </button>
          </div>
        </div>

        <!-- Location -->
        <div
  class="flex items-center gap-1 text-gray-400 hover:text-teal-400 cursor-pointer transition-colors pr-4"
  @click="showLocationModal = true"
>
          <span class="material-icons text-teal-400">location_on</span>
          <span class="text-sm font-medium">{{ selectedCity || 'Select Location' }}</span>
        </div>

        <!-- Sign In / Profile -->
        <div>
          <button
            v-if="!isLoggedIn"
            @click="openPanel('login')"
            class="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-full transition-colors"
          >
            Sign In
          </button>
          <div v-else class="flex items-center cursor-pointer px-4">
            <span class="material-icons text-teal-400 pt-1" style="font-size: 35px" @click="openPanel('profile')">account_circle</span>
          </div>
        </div>
      </div>
    </header>

    <div class="flex flex-1">
      <!-- Sidebar -->
  <aside class="fixed top-15 left-0 h-[calc(100vh-5rem)] w-28 bg-gray-900 text-white flex flex-col justify-between items-center py-8 z-20 ">
    <nav class="p-2 flex flex-col items-center">
      <ul class="space-y-10 w-full">
        <li
          v-for="item in navItems"
          :key="item.name"
          class="w-24 rounded-xl transition-colors"
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


      <!-- Main Content -->
      <main class="flex-1 p-10 pt-3 ml-28 overflow-x-hidden">
         <div class="h-8 w-328 bg-transparent"></div>
        <div>
          <carousel :events="upcomingEvents" />
        </div>

        <div v-if="Object.keys(groupedEvents).length" class="space-y-10 px-4 py-6">
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
            @click="$router.push({ path: `/events` })"
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

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-10 px-8 ml-28">
      <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <h2 class="text-xl font-bold text-teal-400">Nearby Happenings</h2>
          <p class="text-sm mt-2">&copy; 2025 Nearby Happenings Limited</p>
        </div>
        <div>
          <h3 class="font-semibold mb-2 text-gray-300">Company</h3>
          <ul class="space-y-1">
            <li><a href="#" class="hover:underline">About Us</a></li>
            <li><a href="#" class="hover:underline">Our Mission</a></li>
            <li><a href="#" class="hover:underline">Team</a></li>
            <li><a href="#" class="hover:underline">Stories</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold mb-2 text-gray-300">Contact Us</h3>
          <ul class="space-y-1">
            <li><span class="material-icons text-teal-400 text-sm">call</span> +91-9876543210</li>
            <li><span class="material-icons text-teal-400 text-sm">email</span> support@nearbyhappenings.com</li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold mb-2 text-gray-300">Explore Events</h3>
          <ul class="space-y-1">
            <li><a href="#" class="hover:underline">Yoga Sessions</a></li>
            <li><a href="#" class="hover:underline">Art Exhibitions</a></li>
            <li><a href="#" class="hover:underline">Music Concerts</a></li>
            <li><a href="#" class="hover:underline">Workshops</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
        Made with <span class="material-icons text-teal-400 text-sm">favorite</span> for local communities
      </div>
    </footer>

    <!-- Slide-in Panel -->
    <transition name="slide">
      <div
        v-if="showPanel"
        class="fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 bg-gray-900 shadow-lg z-50 overflow-y-auto"
      >
        <button
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-300"
          @click="closePanel"
        >
          <span class="material-icons">close</span>
        </button>
       <component
  :is="activeComponent"
  @switchPanel="handleSwitch"
  @loginSuccess="handleLoginSuccess"
  @signupSuccess="handleSignupSuccess"
  @signOut="handleSignOut"
/>

      </div>
    </transition>
    <LocationSelector
  v-if="showLocationModal"
  @select="handleLocationSelect"
  @close="showLocationModal = false"
/>
<InterestSelector
  v-if="showInterestModal"
  @submit="handleThemeSelection"
  @close="showInterestModal = false"
/>
  </div>
  
</template>


<script setup>
import { ref,computed,watch, onMounted } from 'vue'
import {api} from '../services/api'
import EventCard from './EventCard.vue'
import carousel from './carousel.vue'
import Login from './Login.vue'
import Signup from './SignUp.vue'
import Profile from './Profile.vue'
import LocationSelector from './LocationSelector.vue'
import InterestSelector from './InterestSelector.vue'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
import { useEventStore } from '@/stores/event'
const eventStore = useEventStore()

const selectedCity = ref('')
const selectedThemes = ref([])

const showLocationModal = ref(false)
const showInterestModal = ref(false)

const isLoggedIn = computed(() => !!authStore.user)
const userEmail = computed(() => authStore.user?.email || 'User')
const activeNav = ref('Home')
const navItems = ref([
  { name: 'Home', icon: 'home', route: '/' },
  { name: 'Events', icon: 'celebration', route: '/events' },
  { name: 'Community', icon: 'groups', route: '/admin-panel' },
  { name: 'Host', icon: 'description', route: '/host-event' },
])

const searchQuery = ref('')
const eventTypes = [
  'Sunburn Festival',
  'Art & Craft Workshop',
  'Yoga Morning Session',
  'Tech Meetup',
  'Standup Comedy',
  'Food Festival',
  'Music Concert',
  'Dance Workshop',
  'Startup Pitch Night',
]

const filteredEventTypes = computed(() => {
  return eventTypes.filter(type => 
    type.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function selectType(type) {
  searchQuery.value = type
}

const upcomingEvents= computed(() => eventStore.upcomingEvents)

const groupedEvents = computed(() => eventStore.groupedEvents)

const showPanel = ref(false)
const activeComponent = ref(null)

function openPanel(type) {
  if (type === 'login') {
    activeComponent.value = Login
  } else if (type === 'signup') {
    activeComponent.value = Signup
  } else if (type === 'profile') {
    activeComponent.value = Profile
  }
  showPanel.value = true
}

function closePanel() {
  showPanel.value = false
}
function handleSwitch(type) {
  if (type === 'signup') {
    activeComponent.value = Signup
  } else if (type === 'login') {
    activeComponent.value = Login
  }else if (type === 'profile') {
    activeComponent.value = Profile
  }
  showPanel.value=true
}
async function handleLoginSuccess() {
  const user = authStore.user  // ✅ safer & ensures latest user data
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

  closePanel()
  console.log('🎉 User logged in:', user.email)
}


function handleSignupSuccess(user) {

  closePanel()
  console.log('User signed up:', user.email) 
  if (!authStore.user?.location || !authStore.user?.interests?.length) {
    showLocationModal.value = true
  }
}

async function handleSignOut() {
  await authStore.logout()
  console.log('logged out!')
  selectedCity.value='Select Location'
  closePanel()
}

function handleLocationSelect(city) {
  selectedCity.value = city
  showLocationModal.value = false
  showInterestModal.value = true // Move to interest selection
}

async function handleThemeSelection(themes) {
  console.log('📌 handleThemeSelection called with themes:', themes)

  selectedThemes.value = themes
  showInterestModal.value = false

  try {
    const themeIds = selectedThemes.value.map(t => t._id)
    const city = selectedCity.value

    console.log('📤 Calling authStore.updatePreferences with:', city, themeIds)

    await authStore.updatePreferences(city, themeIds)

    // 💡 Re-fetch events immediately after updating preferences
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

watch(
  () => authStore.user,
  async (user) => {
    if (user && user._id) {
      // Logged-in user – fetch personalized data
      await eventStore.fetchGroupedEvents(user._id)
      await eventStore.fetchUpcomingEvents(user._id)
      if (user?.city) {
        selectedCity.value = user.city
        console.log('🌆 selectedCity updated from user:', selectedCity.value)
      }
    } else {
      // Guest or no user – fetch default events
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

  // Only set selectedCity if user is logged in
  if (authStore.user?.city) {
    selectedCity.value = authStore.user.city
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