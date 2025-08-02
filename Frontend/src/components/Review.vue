<template>
  <div class="bg-gray-900 min-h-screen p-6 text-white">
    <h2 class="text-3xl font-bold mb-4 text-center">🌟 User Reviews</h2>

    <!-- Average Rating Summary -->
    

    <div v-if="reviews.length === 0" class="text-gray-400 text-center">No reviews available.</div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="review in reviews"
        :key="review._id"
        class="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:shadow-lg hover:border-teal-400 transition-all duration-300"
      >
        <div class="flex items-center gap-3 mb-2">
          <div
            class="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm"
          >
            {{ getInitials(review.name) }}
          </div>
          <div>
            <div class="font-semibold text-teal-400 truncate">{{ review.name }}</div>
            <p class="text-gray-400 text-xs">{{ formatDate(review.createdAt) }}</p>
          </div>
        </div>

        <div class="text-yellow-400 text-sm mb-1">
          <i
            v-for="i in 5"
            :key="i"
            class="fa-star"
            :class="i <= review.rating ? 'fas' : 'far'"
          ></i>
        </div>
        <p class="text-gray-400 text-xs mb-2 truncate">{{ review.email }}</p>
        <p class="text-gray-300 text-sm line-clamp-4">{{ review.message }}</p>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div
      v-if="totalPages > 1"
      class="flex justify-center items-center mt-8 space-x-4"
    >
      <button
        class="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-40 transition"
        :disabled="page === 1"
        @click="changePage(page - 1)"
      >
        ⬅ Prev
      </button>
      <span class="text-gray-300">Page {{ page }} of {{ totalPages }}</span>
      <button
        class="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-40 transition"
        :disabled="page === totalPages"
        @click="changePage(page + 1)"
      >
        Next ➡
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';
import { api } from '@/services/api';

const reviews = ref([]);
const page = ref(1);
const totalPages = ref(1);
const totalReviews = ref(0);

const limit = 9;

const fetchReviews = async () => {
  try {
   const res = await api.get(`/feedback?page=${page.value}&limit=${limit}`);

    reviews.value = res.data.feedbacks;
    totalPages.value = res.data.totalPages;
    totalReviews.value = res.data.totalFeedbackCount || res.data.feedbacks.length;
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
  }
};

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage;
  }
};

const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

watch(page, fetchReviews);
onMounted(fetchReviews);
</script>


<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* Optional: Tailwind plugin required for line-clamp */
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>