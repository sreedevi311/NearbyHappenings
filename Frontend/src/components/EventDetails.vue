<template>
  <transition name="fade">
  <div v-if="eventStore.selectedEvent" class="min-h-screen bg-[#0b0f1a] text-white px-4 py-8 md:px-16 font-sans">
    <h1 class="text-3xl md:text-4xl font-bold mb-6 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300 capitalize animate-slide-down">
      {{ eventStore.selectedEvent.eventName }}
    </h1>

    <div class="flex flex-col md:flex-row gap-6 animate-fade-in">
      <div class="flex-1 flex flex-col">
        <div class="relative group neon-border rounded-xl overflow-hidden mb-4">
          <img
            :src="eventStore.selectedEvent.posterUrl"
            :alt="eventStore.selectedEvent.eventName"
            class="rounded-xl w-full h-[450px] object-cover hover:scale-105 transition-transform duration-500"
            @load="loaded = true"
          />
          <div
            class="absolute bottom-2 left-2 flex flex-row gap-2 transition-all duration-500"
            :class="{'translate-x-0': loaded, '-translate-x-full': !loaded}"
          >
            <div class="bg-teal-500/90 text-xl font-bold px-2 py-1 rounded-xl text-white">{{ eventStore.selectedEvent.tag }}</div>
          </div>
        </div>

        <div class="flex justify-end items-center mt-4 flex-wrap gap-2">
          <div class="flex items-center space-x-4">
            <p class="flex items-center text-teal-400 font-semibold">
              <span class="material-icons mr-1">thumb_up</span>
              {{ interestedCount }} are interested
            </p>
            <button
              @click="handleInterested"
              class="bg-transparent border border-teal-400 text-teal-400 px-4 py-1 rounded-full hover:bg-teal-400 hover:text-black transition"
            >
              {{ userInterested ? "Undo" : "I'm Interested" }}
            </button>
          </div>
        </div>

        <h2 class="mt-6 text-2xl font-semibold mb-2 gradient-text inline-block">About The Event</h2>
        <div class="text-lg text-gray-300">{{ eventStore.selectedEvent.description }}</div>

        <div class="mt-6">
          <h2 class="text-2xl font-semibold mb-2 gradient-text inline-block">Organizer Details</h2>
          <p>
            <span class="block gradient-text font-semibold mb-2">Contact:</span>
            <span class="block text-md text-gray-300">
              <span class="material-icons text-teal-400 text-sm mr-1 align-middle">call</span>
              {{ eventStore.selectedEvent.organizer.mobile || 'N/A' }}
            </span>
            <span class="block text-md text-gray-300">
              <span class="material-icons text-teal-400 text-sm mr-1 align-middle">email</span>
              {{ eventStore.selectedEvent.organizer.email || 'N/A' }}
            </span>
          </p>
        </div>
      </div>

      <div class="w-full md:w-[420px] h-[450px] bg-[#1b2236] neon-border rounded-xl p-6 shadow-lg space-y-4">
        <div class="flex items-center gap-2">
          <span class="material-icons text-teal-400 text-base mr-1 align-middle">calendar_today</span>
          <span class="gradient-text">{{ eventStore.selectedEvent.date }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="material-icons text-teal-400 text-base mr-1 align-middle">schedule</span>
          <span class="gradient-text">{{ eventStore.selectedEvent.time }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="material-icons text-teal-400 text-base mr-1 align-middle">location_city</span>
          <span class="gradient-text">{{ eventStore.selectedEvent.city || 'City not specified' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="material-icons text-teal-400 text-base mr-1 align-middle">location_on</span>
          <span class="gradient-text">{{ eventStore.selectedEvent.location.address }}</span>
        </div>
        <div>
          <span class="material-icons text-teal-400 text-base mr-1 align-middle">groups</span>
          <strong class="gradient-text">Target Audience:</strong> {{ eventStore.selectedEvent.targetAudience || 'All' }}
        </div>
        <div>
          <span class="material-icons text-teal-400 text-base mr-1 align-middle">event_seat</span>
          <strong class="gradient-text">Capacity:</strong> {{ eventStore.selectedEvent.capacity || 'No Limit' }}
        </div>
        <div>
          <span class="material-icons text-teal-400 text-base mr-1">backpack</span>
          <strong class="gradient-text">Essentials:</strong> {{ eventStore.selectedEvent.essentialsToCarry || 'None' }}
        </div>
        <div v-if="eventStore.selectedEvent.registrationFee">
          <span class="material-icons text-teal-400 text-base mr-1 align-middle">request_quote</span>
          <strong class="gradient-text">Fee:</strong> {{ eventStore.selectedEvent.registrationFee }}
        </div>

        <div v-if="eventStore.selectedEvent.registrationLink" class="flex justify-center">
          <a
            :href="eventStore.selectedEvent.registrationLink"
            target="_blank"
            class="inline-block neon-border gradient-text text-black font-bold py-2 px-6 rounded-xl hover:bg-teal-400 hover:text-black transition pulse-animation mb-2"
          >
            Register Now
          </a>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-teal-400 animate-pulse">
      Loading event details...
    </div>
  </transition>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useEventStore } from '@/stores/event'

const route = useRoute()
const eventStore = useEventStore()

const loading = ref(true)

const fetchEvent = async (id) => {
  loading.value = true
  await eventStore.fetchEventById(id)
  loading.value = false
}

onMounted(() => {
  fetchEvent(route.params.id)
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) fetchEvent(newId)
  }
)

const interestedCount = ref(0)
const userInterested = ref(false)

const handleInterested = () => {
  if (!userInterested.value) {
    interestedCount.value++
    userInterested.value = true
  } else {
    interestedCount.value--
    userInterested.value = false
  }
}
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
.gradient-text {
  @apply text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>