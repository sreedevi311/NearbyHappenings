<template>
  <div class="min-h-screen bg-black text-green-400 p-4 pt-1 font-sans ml-24">
    <!-- Section Headings (Tabs) -->
    <div class="flex justify-center space-x-8 mb-4 text-xl font-bold tracking-wide">
      <h2
        v-for="tab in tabs"
        :key="tab"
        @click="switchTab(tab)"
        :class="[
          'cursor-pointer transition-all border-b-2 pb-1',
          currentTab === tab
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400'
            : 'border-transparent text-gray-500 hover:text-green-300'
        ]"
      >
        {{ tab }}
      </h2>
    </div>

    <!-- Add Section (Form) -->
    <div v-if="currentTab === 'Add'" class="text-center text-gray-400">
      <HostEvent @switch-tab="switchTab"/>
    </div>

    <!-- Card Section for Added and Deleted -->
    <transition-group
      v-else
      tag="div"
      name="fade-move"
      class="grid gap-6 grid-cols-3"
    >
      <TaskCard
        v-for="task in paginatedList"
        :key="task._id"
        :task="task"
        :type="currentTab.toLowerCase()"
        @add="handleAdd"
        @delete="handleDelete"
      />
    </transition-group>

    <!-- Empty State -->
    <div v-if="currentTab !== 'Add' && paginatedList.length === 0" class="text-center text-gray-400">
      No {{ currentTab.toLowerCase() }} events yet.
    </div>

    <!-- Pagination (for Added and Deleted sections) -->
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
import { ref, computed, onMounted } from 'vue'
import {api} from '../services/api'
import TaskCard from './TaskCard.vue'
import HostEvent from './HostEvent.vue'

const tabs = ['Add', 'Added', 'Deleted']
const currentTab = ref('Add')
const currentPage = ref(1)
const itemsPerPage = 9

const added = ref([])
const deleted = ref([])

function switchTab(tab) {
  currentTab.value = tab
  currentPage.value = 1
  if (tab === 'Added') {
    fetchAdminEvents()
  }
}

async function handleAdd(task) {
  try {
    const res = await api.post('/events/admin-readd', task)
    removeFromCurrentList(task)
    added.value.unshift(res.data)
    currentPage.value = 1
  } catch (err) {
    console.error('Failed to re-add event:', err)
  }
}

async function handleDelete(task) {
  try {
    await api.delete(`/events/admin-deleted/${task._id}`) // DELETE request to backend
    removeFromCurrentList(task) // remove from the "Added" list
    deleted.value.unshift(task) // add to "Deleted"
  } catch (err) {
    console.error('Failed to delete event:', err)
  }
}

const adminEvents = ref([])

const fetchAdminEvents=async(req,res)=>{
  try {
    const res = await api.get('/events/admin-added')
    adminEvents.value = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (err) {
    console.error('Error fetching admin events:', err)
  }
}
function removeFromCurrentList(task) {
  if (currentTab.value === 'Added') {
    adminEvents.value = adminEvents.value.filter(t => t._id !== task._id)
  } else if (currentTab.value === 'Deleted') {
    deleted.value = deleted.value.filter(t => t._id !== task._id)
  }
}

const paginatedList = computed(() => {
  const list = currentTab.value === 'Added' ? adminEvents.value : deleted.value
  const start = (currentPage.value - 1) * itemsPerPage
  return list.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  const list = currentTab.value === 'Added' ? adminEvents.value : deleted.value
  return Math.ceil(list.length / itemsPerPage)
})

const hasNextPage = computed(() => {
  return currentPage.value < totalPages.value
})

function nextPage() {
  if (hasNextPage.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

onMounted(fetchAdminEvents)
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
  transform: translateX(100px);
}
.fade-move-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}
.fade-move-move {
  transition: transform 0.4s ease;
}
</style>