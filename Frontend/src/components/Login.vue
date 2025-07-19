<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-300 to-teal-400 px-3">
    <div class="bg-black p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-bold mb-2 text-center text-white">Welcome Back</h2>
      <p class="mb-6 text-center text-gray-400">Sign in to your Nearby Happenings account</p>

      <!-- Email -->
      <input 
        v-model="email"
        type="email" 
        placeholder="Enter your email" 
        class="border p-3 mb-3 rounded w-full bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      <p v-if="errors.email" class="text-red-500 text-sm mb-2">{{ errors.email }}</p>

      <!-- Password -->
      <input 
        v-model="password"
        type="password" 
        placeholder="Enter your password" 
        class="border p-3 mb-3 rounded w-full bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      <p v-if="errors.password" class="text-red-500 text-sm mb-2">{{ errors.password }}</p>

      <!-- Sign In Button -->
      <button 
        @click="submitForm"
        class="bg-teal-500 hover:bg-teal-600 text-white p-3 rounded w-full mb-4 font-semibold transition-colors"
      >
        Sign In
      </button>

      <!-- Divider -->
      <div class="flex items-center my-4">
        <hr class="flex-grow border-t border-gray-600" />
        <span class="mx-2 text-gray-500">or</span>
        <hr class="flex-grow border-t border-gray-600" />
      </div>

      <!-- Google -->
      <button class="flex items-center justify-center border p-3 rounded w-full bg-gray-800 hover:bg-gray-700 transition-colors text-gray-200">
        <img src="https://static.vecteezy.com/system/resources/previews/011/598/471/original/google-logo-icon-illustration-free-vector.jpg" alt="Google" class="w-8 h-8 mr-2" />
        Continue with Google
      </button>

      <!-- Sign Up Switch -->
      <p class="mt-6 text-center text-gray-400">
        Don't have an account?
        <button @click="$emit('switchPanel', 'signup')" class="text-teal-400 font-semibold">Sign up</button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '@/services/api' // Adjust path as needed
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'  // adjust path if needed

const email = ref('')
const password = ref('')

const router = useRouter()
const authStore = useAuthStore()

const errors = ref({
  email: '',
  password: '',
})

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

const submitForm = async () => {
  errors.value = {
    email: '',
    password: '',
  }

  if (!email.value) {
    errors.value.email = 'Email is required'
  } else if (!validateEmail(email.value)) {
    errors.value.email = 'Invalid email format'
  }

  if (!password.value) {
    errors.value.password = 'Password is required'
  }

  if (!errors.value.email && !errors.value.password) {
    try {
      console.log("🛂 Submitting login:", email.value)

      // ✅ Call the authStore's login action
      await authStore.login(email.value, password.value)

      console.log("✅ Login success. Tokens saved in store")

      // ✅ Redirect after successful login
      router.push('/')

    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message)
    }
  }
}

</script>
