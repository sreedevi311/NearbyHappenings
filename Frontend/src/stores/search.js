import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSearchStore = defineStore('search', () => {
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

  const filteredEventTypes = computed(() =>
    eventTypes.filter(type =>
      type.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )

  function selectType(type) {
    searchQuery.value = type
  }

  return {
    searchQuery,
    eventTypes,
    filteredEventTypes,
    selectType
  }
})
