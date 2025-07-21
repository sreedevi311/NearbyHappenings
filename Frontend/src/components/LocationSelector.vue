<template>
  <div class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white text-black w-full max-w-3xl rounded-xl p-6 relative">
      <button class="absolute top-4 right-4 text-gray-500" @click="$emit('close')">
        <span class="material-icons">close</span>
      </button>

      <h2 class="text-2xl font-semibold text-center mb-6 text-teal-400">Select Your Location</h2>

      <!-- Search bar -->
      <input
        v-model="search"
        type="text"
        placeholder="Search for your city"
        class="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none"
      />

      <!-- Popular Cities -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div
          v-for="city in filteredCities"
          :key="city._id"
          @click="selectCity(city.name)"
          class="cursor-pointer hover:bg-teal-400 p-3 rounded text-center border border-gray-300"
        >
          {{ city.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {api} from '../services/api'

const search = ref('')
const cities=ref([])

const fetchAllCities=async()=>{
  const {data}=await api.get('/events/get-all-cities')
  cities.value=data
}
const filteredCities = computed(() =>
  cities.value.filter(city =>
    city.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

function selectCity(city) {
  localStorage.setItem('selectedCity', city)
  emit('select', city)
}
const emit = defineEmits(['select', 'close'])

onMounted(() => fetchAllCities())
</script>