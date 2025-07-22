<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-300 to-teal-400">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm h-[350px] text-center">
      <h2 class="text-2xl font-bold text-black mb-1">Hi User!</h2>
      <p class="text-black-600 mb-6">{{ email }}</p>

      <button
        @click="$emit('SignOut')"
        class="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-full transition-colors"
      >
        Sign Out
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ email: String })
</script>