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
    <!-- Top bar: Title + Buttons -->
    <div class="flex justify-between items-center bg-black/60 rounded-md px-3 py-3 mb-3">
      <h3 class="text-white text-md font-bold">
        {{ request.name }}
      </h3>
      <div class="flex gap-3">
        <button
          v-if="type !== 'accepted'"
          @click="$emit('accept', request)"
          class="border border-teal-500 text-teal-400 rounded-full px-4 py-1.5 text-sm font-medium transition-all
                  hover:bg-teal-600/20 hover:border-teal-500 hover:text-teal-400"
        >
          Accept
        </button>
        <button
          v-if="type !== 'declined'"
          @click="$emit('decline', request)"
          class="border border-red-500 text-red-400 rounded-full px-4 py-1.5 text-sm font-medium transition-all
                hover:bg-red-600/20 hover:border-red-500 hover:text-red-400"
        >
          Decline
        </button>
      </div>
    </div>

    <!-- Status Label -->
    <div class="text-sm text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mb-2 m-4">
      {{ statusLabel }}
    </div>

    <!-- Date and Time -->
    <div class="text-sm text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 flex items-center gap-4 m-4">
      <div class="flex items-center gap-1">
        <span class="material-icons">event</span>
        <span>{{ request.date }}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="material-icons">schedule</span>
        <span>{{ request.time }}</span>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue'
const props = defineProps({
  request: Object,
  type: String
})

const statusLabel = computed(() => {
  if (props.type === 'accepted') return 'Accepted on'
  if (props.type === 'declined') return 'Declined on'
  return 'Requested on'
})
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
