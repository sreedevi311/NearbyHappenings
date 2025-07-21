<!-- src/components/InterestSelector.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white text-black w-full max-w-3xl rounded-xl p-6 relative">
      <!-- Close Button -->
      <button class="absolute top-4 right-4 text-gray-500" @click="$emit('close')">
        <span class="material-icons">close</span>
      </button>

      <!-- Title and Subtext -->
      <h2 class="text-2xl font-semibold text-center mb-6">Select Your Interests</h2>
      <p class="text-center mb-4 text-teal-400">Choose one or more themes you’re interested in:</p>

      <!-- Theme Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        <button
          v-for="theme in themes"
          :key="theme._id"
          @click="toggleTheme(theme)"
          :class="[
            'rounded px-4 py-2 border transition-all',
            selected.includes(theme)
              ? 'bg-teal-500 text-white border-teal-600'
              : 'bg-white text-black border-gray-300 hover:bg-teal-600 hover:text-white'
          ]"
        >
          {{ theme.name }}
        </button>
      </div>

      <!-- Continue Button -->
      <button
        :disabled="selected.length === 0"
        class="w-full py-2 rounded bg-teal-500 text-white font-semibold hover:bg-teal-600 disabled:opacity-50"
        @click="submitSelection"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {api} from '../services/api'

const themes=ref([]);

const fetchEventThemes=async()=>{
    const {data}=await api.get('/events/get-event-themes')
    themes.value=data;
}

// Track selected themes
const selected = ref([])

// Toggle theme selection
function toggleTheme(theme) {
  if (selected.value.includes(theme)) {
    selected.value = selected.value.filter(t => t !== theme)
  } else {
    selected.value.push(theme)
  }
}

// Emit selected themes to parent
function submitSelection() {
  emit('submit', selected.value)
}

const emit = defineEmits(['submit', 'close'])

onMounted(() => fetchEventThemes())
</script>