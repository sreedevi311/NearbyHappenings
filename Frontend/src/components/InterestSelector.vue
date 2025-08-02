<!-- src/components/InterestSelector.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white text-black w-full max-w-3xl rounded-xl p-6 relative">
      <!-- Close Button -->
      <button class="absolute top-4 right-4 text-gray-500" @click="ui.showInterestModal=false">
        <span class="material-icons">close</span>
      </button>

      <!-- Title and Subtext -->
      <h2 class="text-2xl font-semibold text-center mb-6">Select Your Interests</h2>
      <p class="text-center mb-4 text-teal-400">Choose one or more themes you’re interested in:</p>

      <!-- Theme Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div v-for="theme in themes" :key="theme._id" class="h-full">
          <button
            @click="toggleTheme(theme)"
            class="w-full h-full rounded px-4 py-2 border transition-all min-h-[60px]"
            :class="selected.includes(theme)
              ? 'bg-teal-500 text-white border-teal-600'
              : 'bg-white text-black border-gray-300 hover:bg-teal-600 hover:text-white'"
          >
            {{ theme.name }}
          </button>
        </div>
      </div>


      <!-- Continue Button -->
      <button
        :disabled="selected.length === 0"
        class="w-full py-2 rounded bg-teal-500 text-white font-semibold hover:bg-teal-600 disabled:opacity-50"
        @click="handleThemeSelection"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {api} from '../services/api'
import { useAuthStore } from '@/stores/auth'
import { useEventStore } from '@/stores/event'
import { useUiStore } from '@/stores/ui'
import { usePreferencesStore } from '@/stores/preferences'

const authStore = useAuthStore()
const eventStore=useEventStore()
const ui = useUiStore()
const prefs = usePreferencesStore()

const themes=ref([]);

const fetchEventThemes=async()=>{
    const {data}=await api.get('/events/get-all-event-themes')
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

async function handleThemeSelection() {
  console.log('📌 handleThemeSelection called with themes:', selected.value)

  prefs.setThemes(selected.value)
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


onMounted(() => fetchEventThemes())
</script>