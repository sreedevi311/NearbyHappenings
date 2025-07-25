import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePreferencesStore = defineStore('preferences', () => {
  const selectedCity = ref('')
  const selectedThemes = ref([])

  function setCity(city) {
    selectedCity.value = city
  }

  function setThemes(themes) {
    selectedThemes.value = themes
  }

  return {
    selectedCity,
    selectedThemes,
    setCity,
    setThemes
  }
})
