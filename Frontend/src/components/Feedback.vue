feedback.vue:
<template>
  <div
    class="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10"
    style="background-image: url('https://images.blocksurvey.io/cdn-cgi/imagedelivery/G6cPOuGZ4Z_bEV13gBxixw/template-category/event-experience.svg/l?auto=format&fit=crop&w=1350&q=80');"
  >
    <div class="max-w-lg w-full bg-black bg-opacity-80 p-8 rounded-2xl shadow-lg border border-gray-700 text-white">
      <h2 class="text-3xl font-bold mb-6 text-center text-teal-400">
        Share Your Feedback
      </h2>

      <div v-if="alreadySubmitted" class="text-center text-teal-400 font-semibold text-lg">
         You have already submitted feedback. Thank you!
      </div>

      <form v-else @submit.prevent="submitFeedback" class="space-y-5">
        <div>
          <label for="name" class="block text-sm text-gray-300 mb-1">Name</label>
          <input
            v-model="form.name"
            id="name"
            required
            class="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label for="email" class="block text-sm text-gray-300 mb-1">Email</label>
          <input
            v-model="form.email"
            id="email"
            type="email"
            required
            class="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-300 mb-1">Rating</label>
          <div class="flex items-center space-x-1 text-teal-400 text-2xl">
            <i
              v-for="i in 5"
              :key="i"
              class="fa-star cursor-pointer transition transform hover:scale-125"
              :class="i <= form.rating ? 'fas' : 'far'"
              @click="form.rating = i"
            ></i>
          </div>
        </div>

        <div>
          <label for="message" class="block text-sm text-gray-300 mb-1">Message</label>
          <textarea
            v-model="form.message"
            id="message"
            required
            rows="4"
            class="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            placeholder="Write your feedback..."
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg text-white font-semibold shadow-md transition transform hover:scale-105"
        >
          🚀 Submit Feedback
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  name: '',
  email: '',
  rating: 0,
  message: ''
});

const alreadySubmitted = ref(false);

onMounted(async () => {
  if (authStore.user) {
    form.value.name = authStore.user.name;
    form.value.email = authStore.user.email;

    try {
      const res = await api.get(`/feedback/check?email=${authStore.user.email}`);
      alreadySubmitted.value = res.data.exists;
    } catch (err) {
      console.error('Error checking feedback existence:', err);
    }
  }
});

const submitFeedback = async () => {
  try {
    await api.post('/feedback', form.value);
    router.push('/reviews');
  } catch (err) {
    if (err.response?.status === 409) {
      alert('You have already submitted feedback.');
      alreadySubmitted.value = true;
    } else {
      alert('Something went wrong. Please try again.');
      console.error('Submit error:', err);
    }
  }
};
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>