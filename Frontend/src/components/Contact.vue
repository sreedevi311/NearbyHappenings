<template>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow">
    <h2 class="text-2xl font-bold text-teal-400 mb-4">Contact Us</h2>
    <form @submit.prevent="submitContact">
      <div class="mb-4">
        <label class="block mb-1 text-teal-300">Name</label>
        <input type="text" v-model="form.name" class="w-full p-2 rounded bg-gray-700" required />
      </div>
      <div class="mb-4">
        <label class="block mb-1 text-teal-300">Email</label>
        <input type="email" v-model="form.email" class="w-full p-2 rounded bg-gray-700" required />
      </div>
      <div class="mb-4">
  <label class="block mb-1 text-teal-300">Subject</label>
  <select v-model="form.subject" class="w-full p-2 rounded bg-gray-700 text-white" required>
    <option disabled value="">Select a subject</option>
    <option>Login Issue</option>
    <option>Event Request</option>
    <option>Website Feedback</option>
    <option>Report a Bug</option>
    <option>Other</option>
  </select>
</div>

      <div class="mb-4">
        <label class="block mb-1 text-teal-300">Message</label>
        <textarea v-model="form.message" rows="5" class="w-full p-2 rounded bg-gray-700" required></textarea>
      </div>
      <button type="submit" class="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded transition">Send Message</button>
    </form>
    <p v-if="successMessage" class="text-green-400 mt-4">{{ successMessage }}</p>
    <p v-if="errorMessage" class="text-red-400 mt-4">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const successMessage = ref('')
const errorMessage = ref('')

const fetchUser = async () => {
  try {
    const res = await api.get('/auth/profile')
    form.value.name = res.data.user.name
    form.value.email = res.data.user.email
  } catch (err) {
    console.warn('Not logged in or error fetching user')
  }
}

const submitContact = async () => {
  try {
    const res = await api.post('/contact', form.value)
    successMessage.value = res.data.message
    errorMessage.value = ''
    form.value.subject = ''
    form.value.message = ''
  } catch (err) {
    errorMessage.value = 'Failed to send message. Please try again.'
    successMessage.value = ''
  }
}

onMounted(fetchUser)
</script>