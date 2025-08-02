<template>
  <div class="text-green-400 font-sans ml-24 p-4 pt-1">
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
  class="fixed bottom-0 left-24 w-full bg-[#1b1a1f] backdrop-blur-sm border-t border-gray-800 py-3 flex justify-center items-center space-x-6 z-50"
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
import { ref, computed,onMounted } from 'vue'
import {api} from '../services/api'
import RequestCard from './RequestCard.vue'

const tabs = ['Requests', 'Accepted', 'Declined']
const currentTab = ref('Requests')
const currentPage = ref(1)
const itemsPerPage = 9

const accepted = ref([])
const declined = ref([])

function switchTab(tab) {
  currentTab.value = tab
  currentPage.value = 1

  if (tab === 'Requests') {
    fetchPendingRequests()
  } else if (tab === 'Accepted') {
    fetchAcceptedRequests()
  } else if (tab === 'Declined') {
    fetchDeclinedRequests()
  }
}


async function handleAccept(request, status) {
  await api.put(`/events/update-status/${request._id}`, { status })
  removeFromCurrentList(request)
  accepted.value.unshift({ ...request, status })
}

async function handleDecline(request, status) {
  await api.put(`/events/update-status/${request._id}`, { status })
  removeFromCurrentList(request)
  declined.value.unshift({ ...request, status })
}


const pendingRequests = ref([])

const fetchPendingRequests = async () => {
  try {
    const res = await api.get('/events/pending-requests') // your backend URL
    pendingRequests.value = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error fetching pending events:', error)
  }
}

const fetchAcceptedRequests = async () => {
  try {
    const res = await api.get('/events/accepted-requests')
    accepted.value = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error fetching accepted requests:', error)
  }
}

const fetchDeclinedRequests = async () => {
  try {
    const res = await api.get('/events/declined-requests')
    declined.value = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error fetching declined requests:', error)
  }
}


function removeFromCurrentList(request) {
  if (currentTab.value === 'Requests') {
    pendingRequests.value = pendingRequests.value.filter(r => r._id !== request._id)
  } else if (currentTab.value === 'Accepted') {
    accepted.value = accepted.value.filter(r => r._id !== request._id)
  } else if (currentTab.value === 'Declined') {
    declined.value = declined.value.filter(r => r._id !== request._id)
  }
}



const paginatedList = computed(() => {
  const list =
    currentTab.value === 'Requests'
      ? pendingRequests.value
      : currentTab.value === 'Accepted'
      ? accepted.value
      : declined.value
  const start = (currentPage.value - 1) * itemsPerPage
  return list.slice(start, start + itemsPerPage)
})

const hasNextPage = computed(() => {
  const list =
    currentTab.value === 'Requests'
      ? pendingRequests.value
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

onMounted(() => {
  fetchPendingRequests()
  fetchAcceptedRequests()
  fetchDeclinedRequests()
})

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