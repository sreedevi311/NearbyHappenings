<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-300 to-teal-400 px-3">
    <div class="bg-black p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-bold mb-2 text-center">Join Nearby Happenings</h2>
      <p class="mb-6 text-center text-gray-400">Create your account to discover local events</p>

      <!-- Email -->
      <input 
        v-model="email"
        type="email" 
        placeholder="Enter your email" 
        class="border p-3 rounded w-full mb-3  bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400" 
      />
      <p v-if="errors.email" class="text-red-500 text-sm mb-2">{{ errors.email }}</p>

      <!-- Password -->
      <input 
        v-model="password"
        type="password" 
        placeholder="Create a password" 
        class="border p-3 rounded w-full mb-3  bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400" 
      />
      <p v-if="errors.password" class="text-red-500 text-sm mb-2">{{ errors.password }}</p>

      <!-- Confirm Password -->
      <input 
        v-model="confirmPassword"
        type="password" 
        placeholder="Confirm your password" 
        class="border p-3 rounded w-full mb-3  bg-gray-800 text-gray-200 placeholder-gray-500focus:outline-none focus:ring-2 focus:ring-teal-400" 
      />
      <p v-if="errors.confirmPassword" class="text-red-500 text-sm mb-2">{{ errors.confirmPassword }}</p>

      <!-- Submit button -->
      <button 
        @click="submitForm"
        class="bg-teal-500 hover:bg-t eal-600 text-white p-3 rounded w-full mb-4 font-semibold"
      >
        Create Account
      </button>

      <!-- Divider -->
      <div class="flex items-center my-4">
        <hr class="flex-grow border-t border-gray-300" />
        <span class="mx-2 text-gray-500">or</span>
        <hr class="flex-grow border-t border-gray-300" />
      </div>

      <!-- Google button -->
      <button class="flex items-center justify-center border p-3 rounded w-full hover:bg-gray-700  bg-gray-800 text-gray-200 placeholder-gray-500">
        <img src="https://static.vecteezy.com/system/resources/previews/011/598/471/original/google-logo-icon-illustration-free-vector.jpg" alt="Google" class="w-8 h-8 mr-2" />
        Continue with Google
      </button>

      <!-- Already have account -->
      <p class="mt-6 text-center text-gray-400">
        Already have an account?
        <button @click="$emit('switchPanel', 'login')" class="text-teal-500 font-semibold">Sign in</button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const errors = ref({
  email: '',
  password: '',
  confirmPassword: '',
})

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

const submitForm = () => {
  errors.value = {
    email: '',
    password: '',
    confirmPassword: '',
  }

  if (!email.value) {
    errors.value.email = 'Email is required'
  } else if (!validateEmail(email.value)) {
    errors.value.email = 'Invalid email format'
  }

  if (!password.value) {
    errors.value.password = 'Password is required'
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }

  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = 'Passwords do not match'
  }

  // If no errors, submit
  if (!errors.value.email && !errors.value.password && !errors.value.confirmPassword) {
    alert('Form submitted successfully!')
    
  }
}
</script>