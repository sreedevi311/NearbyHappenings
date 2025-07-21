<template>
  <div
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="navigateToEdit"
    :class="{
      'theme-hover transform transition-all duration-300': true,
      'border-teal-500': hovered
    }"
    class="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden neon-border"
  >
    <!-- Top bar: Title + Buttons -->
    <div class="flex justify-between items-center bg-black/60 rounded-md px-3 py-3 mb-3">
      <h3 class="text-white text-lg font-bold">
        {{ task.eventName }}
      </h3>
      <div class="flex gap-3">
        <button
          v-if="type === 'added'"
          @click="$emit('delete', task)"
          class="border border-red-500 text-red-400 rounded-full px-4 py-1.5 text-sm font-medium transition-all
                 hover:bg-red-600/20 hover:border-red-500 hover:text-red-400"
        >
          Delete
        </button>
        <button
          v-if="type === 'deleted'"
          @click="$emit('add', task)"
          class="border border-teal-500 text-teal-400 rounded-full px-4 py-1.5 text-sm font-medium transition-all
                 hover:bg-teal-600/20 hover:border-teal-500 hover:text-teal-400"
        >
          Add
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
        <span>{{ formatDate(task.createdAt) }}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="material-icons">schedule</span>
        <span>{{ formatTime(task.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps({
  task: Object,
  type: String
})
const hovered = ref(false)

const router = useRouter()
function navigateToEdit() {
  router.push(`/admin/edit-event/${props.task._id}`)
}

const statusLabel = computed(() => {
  if (props.type === 'added') return 'Added on'
  if (props.type === 'deleted') return 'Deleted on'
  return 'Task'
})

const formatDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleDateString() // e.g., "7/17/2025"
}

const formatTime = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // e.g., "04:45 PM"
}
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