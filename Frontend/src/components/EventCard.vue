<template>
  <div
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    :class="{
      'theme-hover transform transition-all duration-300': true,
      'border-teal-500': hovered
    }"
    class="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden neon-border"
  >
    <!-- Image with title overlay -->
    <div class="relative">
      <img
        :src="event.posterUrl"
        :alt="event.eventName"
        class="w-full h-48 object-cover"
      >
      <!-- Tag on top right -->
      <div
        class="absolute top-2 right-2 bg-teal-500/90 text-xs font-bold px-2 py-1 rounded-full text-white"
      >
        {{ event.tag }}
      </div>
      <!-- Title overlay -->
      <h3
        class="absolute bottom-0 left-0 w-full bg-black/60 text-white text-lg font-bold px-3 py-2"
      >
        {{ event.eventName }}
      </h3>
    </div>

    <!-- Event details -->
    <div class="p-4 space-y-1 text-gray-300">
      <p class="flex items-center text-sm">
        <span class="material-icons text-teal-400 text-base mr-1">calendar_today</span>
        {{ event.date }} &nbsp; | &nbsp;
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
</template>

<script setup>
import { ref } from 'vue'
const hovered = ref(false)
defineProps(['event'])
</script>

<style scoped>
.theme-hover:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(66, 184, 131, 0.3);
}

.neon-border {
  position: relative;
}
.neon-border::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid transparent;
  border-radius: inherit;
  background: linear-gradient(45deg, #42b883, #35495e) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  pointer-events: none;
}
</style>