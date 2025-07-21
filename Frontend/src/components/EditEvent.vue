<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../services/api'
import HostEvent from './HostEvent.vue'

const route = useRoute()
const router = useRouter()
const form = ref({
  eventName: '',
  theme: '',
  date: '',
  time: '',
  city: '',
  location: null,
  poster: null,
  orgName: '',
  orgMobile: '',
  orgEmail: '',
  regLink: '',
  regFee: '',
  targetAudience: '',
  capacity: '',
  essentials: ''
})

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await api.get(`/events/${id}`)
    const data = res.data

    form.value = {
      ...data,
      location: data.location || null,  // sanitize
    }
  } catch (err) {
    console.error('Error fetching event:', err)
  }
})

async function updateEvent() {
  const id = route.params.id

  const payload = {
    ...form.value,
    location: form.value.location
      ? {
          lat: form.value.location.lat,
          lng: form.value.location.lng
        }
      : null
  }

  try {
    await api.put(`/events/update/${id}`, payload)
    alert('Event updated successfully!')
    router.push('/admin-panel/added') // Redirect
  } catch (err) {
    console.error('Failed to update event:', err)
  }
}
</script>

<template>
  <HostEvent></HostEvent>
</template>
