<template>
  <div class="bg-black text-gray-300 min-h-screen py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300 capitalize">
        {{ formattedThemeName }} Events
      </h1>

      <div v-if="groupedEvents">
        <div v-for="(cityEvents, city) in groupedEvents" :key="city" class="mb-10">
          <h2 class="text-2xl text-teal-300 font-semibold mb-4 capitalize">{{ city }} Events</h2>
          <div class="flex gap-6 overflow-x-auto hide-scrollbar pb-4 pt-3">
            <EventCard
              v-for="event in cityEvents"
              :key="event._id"
              :event="event"
              class="min-w-[300px]"
            />
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <h2 class="text-2xl font-bold">Loading...</h2>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api'
import EventCard from '@/components/EventCard.vue' // ✅ Make sure the path is correct

const route = useRoute()

const events = ref([])
const groupedEvents = ref(null)

const selectedTheme = route.params.theme.replace(/-/g, ' ')
const formattedThemeName = computed(() => selectedTheme)

const groupByCity = (eventsArray) => {
  const grouped = {}
  for (const event of eventsArray) {
    const city = event.city || 'Unknown'
    if (!grouped[city]) grouped[city] = []
    grouped[city].push(event)
  }
  return grouped
}

const fetchEvents = async () => {
  try {
    const response = await api.get(`/events/theme/${selectedTheme}`)
    events.value = response.data
    groupedEvents.value = groupByCity(response.data)
  } catch (err) {
    console.error("Error fetching events:", err)
  }
}

onMounted(() => {
  fetchEvents()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>


<style scoped>
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

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

