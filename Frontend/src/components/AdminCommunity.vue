<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow rounded">
    <h2 class="text-2xl font-bold mb-4">Create New Community</h2>

    <form @submit.prevent="createCommunity">
      <!-- Theme Select -->
      <label class="block mb-2 font-medium">Select Theme</label>
      <select v-model="form.theme" required class="w-full p-2 border rounded mb-4">
        <option disabled value="">-- Select a theme --</option>
        <option v-for="theme in themes" :key="theme._id" :value="theme._id">
          {{ theme.name }}
        </option>
      </select>

      <!-- Cities Input -->
      <label class="block mb-2 font-medium">Cities (comma-separated)</label>
      <input
        type="text"
        v-model="form.citiesInput"
        placeholder="e.g. Narsapur, Palakollu"
        class="w-full p-2 border rounded mb-4"
        required
      />

      <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Create Community
      </button>

      <p v-if="success" class="text-green-600 mt-4">✅ Community created successfully!</p>
      <p v-if="error" class="text-red-600 mt-4">❌ {{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'

const form = ref({
  theme: '',
  citiesInput: ''
})

const themes = ref([])
const success = ref(false)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await api.get('/events/get-event-themes') // Assumes a route exists to list all themes
    themes.value = res.data
  } catch (err) {
    console.error('Failed to load themes:', err)
    error.value = 'Could not fetch theme list.'
  }
})

const createCommunity = async () => {
  success.value = false
  error.value = null

  const cities = form.value.citiesInput.split(',').map(c => c.trim()).filter(Boolean)

  try {
    await api.post('/communities', {
      theme: form.value.theme,
      cities
    })
    success.value = true
    form.value.theme = ''
    form.value.citiesInput = ''
  } catch (err) {
    console.error('Failed to create community:', err)
    error.value = 'Server error while creating community.'
  }
}
</script>
