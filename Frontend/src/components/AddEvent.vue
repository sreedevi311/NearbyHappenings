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
      <HostEvent @add-event="addTask" @switch-tab="switchTab"/>
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
        :key="task.id"
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
import { ref, computed } from 'vue'
import TaskCard from './TaskCard.vue'
import HostEvent from './HostEvent.vue'

const tabs = ['Add', 'Added', 'Deleted']
const currentTab = ref('Add')
const currentPage = ref(1)
const itemsPerPage = 9

const added = ref([
  { id: 1, name: 'Task 1', date: '2025-07-15', time: '10:00 AM' },
  { id: 2, name: 'Task 2', date: '2025-07-20', time: '2:00 PM' },
  { id: 3, name: 'Task 3', date: '2025-07-22', time: '5:00 PM' },
  { id: 4, name: 'Task 4', date: '2025-07-25', time: '1:00 PM' },
  { id: 5, name: 'Task 5', date: '2025-07-28', time: '4:30 PM' },
  { id: 6, name: 'Task 6', date: '2025-07-30', time: '3:00 PM' },
  { id: 7, name: 'Task 1', date: '2025-07-15', time: '10:00 AM' },
  { id: 8, name: 'Task 2', date: '2025-07-20', time: '2:00 PM' },
  { id: 9, name: 'Task 3', date: '2025-07-22', time: '5:00 PM' },
])
const deleted = ref([])

function switchTab(tab) {
  currentTab.value = tab
  currentPage.value = 1
}

function handleAdd(task) {
  removeFromCurrentList(task)
  added.value.unshift(task)
  currentPage.value = 1
}

function handleDelete(task) {
  removeFromCurrentList(task)
  deleted.value.unshift(task)
  currentPage.value = 1
}

function removeFromCurrentList(task) {
  const list = currentTab.value === 'Added' ? added : deleted
  list.value = list.value.filter(t => t.id !== task.id)
}

const paginatedList = computed(() => {
  const list = currentTab.value === 'Added' ? added.value : deleted.value
  const start = (currentPage.value - 1) * itemsPerPage
  return list.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  const list = currentTab.value === 'Added' ? added.value : deleted.value
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

function addTask(task) {
  const maxId = Math.max(0, ...added.value.map(t => t.id || 0), ...deleted.value.map(t => t.id || 0))
  const newTask = {
    id: maxId + 1,
    name: task.name,
    date: task.date,
    time: task.time,
    theme: task.theme,
    city: task.city,
    location: task.location,
    orgName: task.orgName,
    orgMobile: task.orgMobile,
    orgEmail: task.orgEmail,
    regLink: task.regLink,
    regFee: task.regFee,
    targetAudience: task.targetAudience,
    capacity: task.capacity,
    essentials: task.essentials,
    poster: task.poster,
  }
  added.value.unshift(newTask)
  currentPage.value = 1
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