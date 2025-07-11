<template>
  <div class="flex flex-col min-h-screen bg-black text-gray-300">
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-black shadow-md">
      <div class="flex items-center w-full px-4 p-5 pt-6 gap-4 justify-between">
        <!-- Logo -->
        <img
          src="../nearbyHappeningsLogo.png"
          alt="Nearby Happenings Logo"
          class="h-12 object-contain"
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
            class="absolute top-full left-0 w-full flex flex-wrap gap-2 mt-2 z-50"
          >
            <button
              v-for="type in filteredEventTypes"
              :key="type"
              @click="selectType(type)"
              class="border border-teal-500 text-teal-400 rounded-full px-4 py-1.5 text-sm font-medium transition-all
                hover:bg-teal-600/20 hover:border-teal-500 hover:text-teal-400"
            >
              {{ type }}
            </button>
          </div>
        </div>

        <!-- Location Selector -->
        <div class="flex items-center gap-1 text-gray-400 hover:text-teal-400 cursor-pointer transition-colors pr-4">
          <span class="material-icons text-teal-400">location_on</span>
          <span class="text-sm font-medium">Vizag</span>
        </div>

        <!-- Sign In / Profile -->
        <div>
          <button
            v-if="!isSignedIn"
            @click="openPanel('login')"
            class="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-full transition-colors"
          >
            Sign In
          </button>
          <div v-else class="flex items-center gap-2 cursor-pointer">
            <img src="../user-profile.png" alt="Profile" class="h-10 w-10 rounded-full object-cover border border-teal-500" />
          </div>
        </div>
      </div>
    </header>

    <!-- Empty space for search results -->
    <div class="h-8 w-full bg-transparent"></div>

    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside class="w-20 bg-gray-900 shadow-lg hidden md:block">
        <nav class="p-2 flex flex-col items-center">
          <ul class="space-y-4">
            <li v-for="item in navItems" :key="item.name" class="flex flex-col items-center">
              <router-link
                :to="item.route"
                class="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-teal-700/30 transition-colors"
                :class="{ 'bg-teal-700/30': activeNav === item.name }"
                @click="activeNav = item.name"
              >
                <!-- Icon -->
                <span
                  class="material-icons text-teal-400 mb-1"
                  style="font-size: 24px;"
                >
                  {{ item.icon }}
                </span>
                <!-- Label -->
                <span class="text-xs text-gray-300">{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 pt-0 overflow-x-hidden">
        <section class="mb-10">
          <h2 class="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300">Upcoming Events</h2>
          <div class="flex gap-8 overflow-x-auto pb-4 pt-4 hide-scrollbar">
            <EventCard class="min-w-[300px]" v-for="event in upcomingEvents" :key="event.id" :event="event" />
          </div>
        </section>

        <section>
          <h2 class="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300">You Might Like</h2>
          <div class="flex gap-8 overflow-x-auto pb-4 pt-4 hide-scrollbar">
            <EventCard class="min-w-[300px]" v-for="event in interestedEvents" :key="event.id" :event="event" />
          </div>
        </section>
      </main>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-10 px-6">
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
        <component :is="activeComponent" @switchPanel="handleSwitch"></component>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref,computed } from 'vue'
import EventCard from './EventCard.vue'
import Login from './Login.vue'
import Signup from './SignUp.vue'


const activeNav = ref('Home')
const navItems = ref([
  { name: 'Home', icon: 'home', route: '/' },
  { name: 'Events', icon: 'celebration', route: '/events' },
  { name: 'Community', icon: 'groups', route: '/community' },
  { name: 'Host', icon: 'description', route: '/host-event' },
])

const userLoggedIn = ref(true) // toggle this for demo

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

const upcomingEvents = ref([
  {
    id: 1,
    name: 'Sunrise Yoga Class',
    date: 'Oct 15, 2023',
    time: '7:00 AM',
    distance: '0.5 miles',
    location: 'Riverside Park',
    theme: 'health',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Group of people doing yoga outdoors at sunrise with city skyline in background'
  },
  {
    id: 2,
    name: 'Local Art Festival',
    date: 'Oct 18, 2023',
    time: '10:00 AM',
    distance: '1.2 miles',
    location: 'Downtown Square',
    theme: 'art',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
    alt: 'Colorful outdoor art festival with tents displaying paintings and sculptures'
  },
  {
    id: 3,
    name: 'Indie Music Night',
    date: 'Oct 20, 2023',
    time: '8:00 PM',
    distance: '0.8 miles',
    location: 'The Blue Note',
    theme: 'music',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Live band performing on stage with neon lights in a small intimate venue'
  },
  {
    id: 4,
    name: 'Farmers Market',
    date: 'Oct 22, 2023',
    time: '9:00 AM',
    distance: '1.5 miles',
    location: 'Central Park West',
    theme: 'food',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Outdoor farmers market with fresh produce, flowers and local vendors'
  },
  {
    id: 5,
    name: 'Jazz in the Garden',
    date: 'Oct 16, 2023',
    time: '6:30 PM',
    distance: '1.8 miles',
    location: 'Botanical Gardens',
    theme: 'music',
    image: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Jazz quartet performing in a lush garden setting with string lights'
  },
  {
    id: 6,
    name: 'Tech Meetup',
    date: 'Oct 19, 2023',
    time: '7:00 PM',
    distance: '2.1 miles',
    location: 'Innovation Center',
    theme: 'community',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
    alt: 'Group of professionals networking at a modern tech meetup with laptops and presentations'
  },
  {
    id: 7,
    name: 'Brewery Tour',
    date: 'Oct 21, 2023',
    time: '3:00 PM',
    distance: '1.3 miles',
    location: 'Local Craft Brewery',
    theme: 'food',
    image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    alt: 'Brewery equipment with shiny copper tanks and people sampling craft beer'
  },
  {
    id: 8,
    name: 'Book Reading',
    date: 'Oct 23, 2023',
    time: '5:30 PM',
    distance: '0.7 miles',
    location: 'Books & Beans',
    theme: 'community',
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Author reading a book to an attentive audience in a cozy bookstore cafe'
  }
]);

const interestedEvents = ref([
  {
    id: 5,
    name: 'Jazz in the Garden',
    date: 'Oct 16, 2023',
    time: '6:30 PM',
    distance: '1.8 miles',
    location: 'Botanical Gardens',
    theme: 'music',
    image: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Jazz quartet performing in a lush garden setting with string lights'
  },
  {
    id: 6,
    name: 'Tech Meetup',
    date: 'Oct 19, 2023',
    time: '7:00 PM',
    distance: '2.1 miles',
    location: 'Innovation Center',
    theme: 'community',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
    alt: 'Group of professionals networking at a modern tech meetup with laptops and presentations'
  },
  {
    id: 7,
    name: 'Brewery Tour',
    date: 'Oct 21, 2023',
    time: '3:00 PM',
    distance: '1.3 miles',
    location: 'Local Craft Brewery',
    theme: 'food',
    image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    alt: 'Brewery equipment with shiny copper tanks and people sampling craft beer'
  },
  {
    id: 8,
    name: 'Book Reading',
    date: 'Oct 23, 2023',
    time: '5:30 PM',
    distance: '0.7 miles',
    location: 'Books & Beans',
    theme: 'community',
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Author reading a book to an attentive audience in a cozy bookstore cafe'
  },
  {
    id: 1,
    name: 'Sunrise Yoga Class',
    date: 'Oct 15, 2023',
    time: '7:00 AM',
    distance: '0.5 miles',
    location: 'Riverside Park',
    theme: 'health',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Group of people doing yoga outdoors at sunrise with city skyline in background'
  },
  {
    id: 2,
    name: 'Local Art Festival',
    date: 'Oct 18, 2023',
    time: '10:00 AM',
    distance: '1.2 miles',
    location: 'Downtown Square',
    theme: 'art',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
    alt: 'Colorful outdoor art festival with tents displaying paintings and sculptures'
  },
  {
    id: 3,
    name: 'Indie Music Night',
    date: 'Oct 20, 2023',
    time: '8:00 PM',
    distance: '0.8 miles',
    location: 'The Blue Note',
    theme: 'music',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Live band performing on stage with neon lights in a small intimate venue'
  },
  {
    id: 4,
    name: 'Farmers Market',
    date: 'Oct 22, 2023',
    time: '9:00 AM',
    distance: '1.5 miles',
    location: 'Central Park West',
    theme: 'food',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Outdoor farmers market with fresh produce, flowers and local vendors'
  }
]);

const showPanel = ref(false)
const activeComponent = ref(null)

function openPanel(type) {
  activeComponent.value = type === 'login' ? Login : Signup
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
  }
}
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