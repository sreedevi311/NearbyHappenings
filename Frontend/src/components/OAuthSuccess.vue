<template>
  <div class="flex items-center justify-center min-h-screen bg-black text-green-400 text-xl">
    Logging you in with Google...
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  try {
    // Optional: if you’re passing access/refresh tokens via query params
    const access = route.query.access
    const refresh = route.query.refresh

    if (access && refresh) {
      authStore.setTokens(access, refresh)
    }

    await authStore.fetchProfile()
    router.push('/')  // Redirect to home or dashboard
  } catch (err) {
    console.error('OAuth login failed:', err)
    authStore.setActivePanel('signup')  // Show signup panel
    authStore.setLoginError('Account already exists. Please log in instead.')
    router.push('/') // Go back to the root where your login/signup panel is
  }
})
</script>