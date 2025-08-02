<template>
  <div class="max-w-2xl min-h-screen mx-auto pt-10 pb-1 px-4 text-white flex flex-col">
    <!-- Header -->
    <h1 class="text-2xl font-semibold text-teal-500 mb-8">
      Welcome, {{ user.name?.split(' ')[0] || 'User' }}!
    </h1>

    <!-- Avatar & Info -->
    <div class="flex items-center gap-4 mb-6">
      <div class="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-xl font-bold shadow">
        {{ firstLetter }}
      </div>
      <div>
        <p class="text-base font-medium">{{ user.name }}</p>
        <p class="text-sm text-teal-400">{{ user.email }}</p>
      </div>
    </div>

    <!-- Interests Section -->
<div class=" space-y-2 py-3">
  <div
    @click="showInterests = !showInterests"
    class="flex items-center justify-between px-5 py-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition border border-teal-500 shadow-md"
  >
    <div class="flex items-center gap-3">
      <span class="material-icons text-teal-400">interests</span>
      <span class="text-white font-medium">Your Interests</span>
    </div>
    <span class="material-icons text-teal-400">
      {{ showInterests ? 'expand_less' : 'expand_more' }}
    </span>
  </div>

  <!-- Dropdown Content -->
  <div
    v-if="showInterests"
    class="px-6 pt-2 pb-4 bg-gray-900 rounded-lg text-sm text-white border border-teal-500"
  >
    <ul v-if="userInterestNames.length > 0" class="list-disc pl-5">
      <li v-for="name in userInterestNames" :key="name">{{ name }}</li>
    </ul>
    <p v-else class="text-gray-400">No interests selected.</p>
  </div>
</div>

    <!-- Action Sections -->
<div class="mt-2 space-y-4">
  <div
    @click="goToContact"
    class="flex items-center justify-between px-5 py-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition border border-teal-500 shadow-md"
  >
    <div class="flex items-center gap-3">
      <span class="material-icons text-teal-400">support_agent</span>
      <span class="text-white font-medium">Contact</span>
    </div>
    <span class="material-icons text-teal-400">chevron_right</span>
  </div>

  <div
    @click="goToFeedback"
    class="flex items-center justify-between px-5 py-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition border border-teal-500 shadow-md"
  >
    <div class="flex items-center gap-3">
      <span class="material-icons text-teal-400">feedback</span>
      <span class="text-white font-medium">Feedback</span>
    </div>
    <span class="material-icons text-teal-400">chevron_right</span>
  </div>

  <div
    @click="goToReview"
    class="flex items-center justify-between px-5 py-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition border border-teal-500 shadow-md"
  >
    <div class="flex items-center gap-3">
      <span class="material-icons text-teal-400">rate_review</span>
      <span class="text-white font-medium">Review</span>
    </div>
    <span class="material-icons text-teal-400">chevron_right</span>
  </div>
</div>

<!-- Sign Out fixed to bottom of the profile panel -->
<div class="mt-auto w-full">
  <button
    @click="$emit('SignOut')"
    class="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-4 rounded-none transition flex items-center justify-between"
  >
    <span>Sign Out</span>
    <span class="material-icons">logout</span>
  </button>
</div>

</div>
</template>




<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({ email: String })
const user = ref({})
const allThemes = ref([])
const userInterestNames = ref([])
const showInterests = ref(false)

const fetchProfile = async () => {
  try {
    const res = await api.get('/auth/profile')
    user.value = res.data.user
    console.log('👤 User profile:', user.value)
  } catch (error) {
    console.error('❌ Failed to fetch profile:', error)
  }
}

const fetchAllThemes = async () => {
  try {
    const res = await api.get('/events/get-all-event-themes')
    allThemes.value = res.data
    console.log('🎨 All themes:', allThemes.value)
    mapUserInterests() // ✅ call after themes are fetched
  } catch (error) {
    console.error('❌ Failed to fetch themes:', error)
  }
}

const mapUserInterests = () => {
  const userInterests = user.value?.interests || []

  userInterestNames.value = userInterests.map(themeId => {
    const matched = allThemes.value.find(theme =>
      String(theme._id) === String(themeId)
    )
    return matched?.name || 'Unknown'
  })

  console.log('✅ Mapped Interests:', userInterestNames.value)
}

const firstLetter = computed(() => {
  if (user.value?.name) {
    return user.value.name.charAt(0).toUpperCase()
  } else if (user.value?.email) {
    return user.value.email.charAt(0).toUpperCase()
  } else {
    return '?'
  }
})



const goToContact = () => {
  router.push('/contact')
}
const goToFeedback = () => {
  router.push('/feedback')
}
const goToReview = () => {
  router.push('/reviews')
}
onMounted(async () => {
  await fetchProfile()
  await fetchAllThemes()
})
</script>