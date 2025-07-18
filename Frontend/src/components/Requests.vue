<template>
  <div class="min-h-screen bg-black text-green-400 font-sans ml-24 p-4 pt-1">
    <!-- Section Headings (Tabs) -->
    <div class="flex justify-center space-x-8 mb-4 text-xl font-bold tracking-wide">
      <h2
        v-for="tab in tabs"
        :key="tab"
        @click="switchTab(tab)"
        :class="[
          'cursor-pointer transition-all border-b-2 pb-2',
          currentTab === tab
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400'
            : 'border-transparent text-gray-500 hover:text-green-300'
        ]"
      >
        {{ tab }}
      </h2>
    </div>

    <!-- Card Section -->
    <transition-group
      tag="div"
      name="fade-move"
      class="grid gap-6 grid-cols-3"
    >
      <RequestCard
        v-for="request in paginatedList"
        :key="request.id"
        :request="request"
        :type="currentTab.toLowerCase()"
        @accept="handleAccept"
        @decline="handleDecline"
      />
    </transition-group>

    <!-- Pagination -->
    <!-- Fixed Pagination -->
<div
  v-if="currentTab !== 'Add'"
  class="fixed bottom-0 left-24 w-full bg-black/90 backdrop-blur-sm border-t border-gray-800 py-3 flex justify-center items-center space-x-6 z-50"
>
  <button
    @click="prevPage"
    :disabled="currentPage === 1"
    class="px-4 py-1 rounded bg-gray-800 text-green-300 hover:bg-green-500 hover:text-black transition disabled:opacity-50"
  >
    Prev
  </button>

  <span class="text-gray-400">Page {{ currentPage }} of {{ totalPages }}</span>

  <button
    @click="nextPage"
    :disabled="!hasNextPage"
    class="px-4 py-1 rounded bg-gray-800 text-green-300 hover:bg-green-500 hover:text-black transition disabled:opacity-50"
  >
    Next
  </button>
</div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RequestCard from './RequestCard.vue'

const tabs = ['Requests', 'Accepted', 'Declined']
const currentTab = ref('Requests')
const currentPage = ref(1)
const itemsPerPage = 9

const requests = ref([
  { id: 1, name: 'VueConf 2025', date: '2025-07-15', time: '10:00 AM' },
  { id: 2, name: 'DevFest India', date: '2025-07-20', time: '2:00 PM' },
  { id: 3, name: 'HackathonX', date: '2025-07-22', time: '5:00 PM' },
  { id: 4, name: 'JS Party', date: '2025-07-25', time: '1:00 PM' },
  { id: 5, name: 'FOSS Meetup', date: '2025-07-28', time: '4:30 PM' },
  { id: 6, name: 'Tailwind Workshop', date: '2025-07-30', time: '3:00 PM' },
  { id: 7, name: 'VueConf 2025', date: '2025-07-15', time: '10:00 AM' },
  { id: 8, name: 'DevFest India', date: '2025-07-20', time: '2:00 PM' },
  { id: 9, name: 'HackathonX', date: '2025-07-22', time: '5:00 PM' },
])

const accepted = ref([])
const declined = ref([])

function switchTab(tab) {
  currentTab.value = tab
  currentPage.value = 1
}

function handleAccept(request) {
  removeFromCurrentList(request)
  accepted.value.push(request)
}

function handleDecline(request) {
  removeFromCurrentList(request)
  declined.value.push(request)
}

function removeFromCurrentList(request) {
  const list =
    currentTab.value === 'Requests'
      ? requests
      : currentTab.value === 'Accepted'
      ? accepted
      : declined

  list.value = list.value.filter(r => r.id !== request.id)
}

const paginatedList = computed(() => {
  const list =
    currentTab.value === 'Requests'
      ? requests.value
      : currentTab.value === 'Accepted'
      ? accepted.value
      : declined.value
  const start = (currentPage.value - 1) * itemsPerPage
  return list.slice(start, start + itemsPerPage)
})

const hasNextPage = computed(() => {
  const list =
    currentTab.value === 'Requests'
      ? requests.value
      : currentTab.value === 'Accepted'
      ? accepted.value
      : declined.value
  return currentPage.value * itemsPerPage < list.length
})

function nextPage() {
  if (hasNextPage.value) currentPage.value++
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
</script>
<style scoped>
.fade-move-enter-active,
.fade-move-leave-active,
.fade-move-move {
  transition: all 0.4s ease;
}

.fade-move-leave-active {
  position: absolute;
  opacity: 0;
  transform: translateX(100px); /* Slide out to the right */
}

.fade-move-enter-from {
  opacity: 0;
  transform: translateX(-100px); /* Slide in from the left */
}

.fade-move-move {
  transition: transform 0.4s ease; /* Smooth sliding for reordering */
}
</style>