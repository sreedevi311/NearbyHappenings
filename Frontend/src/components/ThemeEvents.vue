<template>
  <div class="bg-black text-gray-300 min-h-screen py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300 capitalize">
        {{ formattedThemeName }} Events
      </h1>

      <div v-if="events.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="event in events"
          :key="event.id"
          class="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden neon-border cursor-pointer"
          @click="goToEvent(event)"
        >
          <div class="relative h-48">
            <img :src="event.posterUrl" :alt="event.name" class="w-full h-full object-cover" />
            
            <div class="absolute bottom-0 left-0 w-full bg-black/60 text-white text-lg font-bold px-3 py-2">
              <h3>{{ event.eventName }}</h3>
            </div>
          </div>
          <div class="p-4 space-y-1">
            <p class="flex items-center text-sm">
              <span class="material-icons text-teal-400 text-base mr-1">calendar_today</span>
              {{ event.date }} &nbsp;|&nbsp;
              <span class="material-icons text-teal-400 text-base mr-1">schedule</span>
              {{ event.time }}
            </p>
            <p class="flex items-center text-sm">
              <span class="material-icons text-teal-400 text-base mr-1">near_me</span>
              {{ event.distance }}
            </p>
            <p class="flex items-center text-sm">
              <span class="material-icons text-teal-400 text-base mr-1">location_on</span>
              {{ event.location.address }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <h2 class="text-2xl font-bold">No events found</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../services/api'

const route = useRoute()
const router = useRouter()

const events = ref([])
const selectedTheme = route.params.theme.replace(/-/g, ' ')

const formattedThemeName = computed(() => selectedTheme)

const fetchEvents = async () => {
  try {
    const response = await api.get(`/events/theme/${selectedTheme}`)
    events.value = response.data
  } catch (err) {
    console.error("Error fetching events:", err)
  }
}

const goToEvent = (event) => {
  router.push({ 
    name: 'event-details', 
    params: { theme: event.theme, id: event._id },
    state: { event }
  })
}

onMounted(async () => {
  await fetchEvents()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>


<style scoped>
.pulse-animation {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.neon-border {
  position: relative;
  overflow: hidden;
  transition: transform 0.4s ease, box-shadow 0.3s ease;
}
.neon-border:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
}
.neon-border::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border: 2px solid transparent;
  border-radius: inherit;
  background: linear-gradient(45deg, #42b883, #35495e) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  pointer-events: none;
}
</style>
