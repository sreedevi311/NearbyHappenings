<!-- CommunityPanel.vue -->
<template>
  <div class="flex h-screen">
   <!-- Sidebar -->
<div class="w-96 bg-[#0f161b] text-white flex flex-col fixed top-28 left-0 h-[calc(100vh-7rem)] element-with-scrollbar">
  <div class="px-4 py-4 border-b border-gray-700">
    <h2 class="text-lg font-bold text-teal-500">Your Communities</h2>
  </div>

  <div class="flex-1 overflow-y-auto">
    <div
      v-for="community in communityStore.suggested"
      :key="community._id"
      @click="selectCommunity(community._id)"
      class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#1e2a32]"
      :class="{ 'bg-[#1e2a32]': selectedCommunity?.id === community._id }"
    >
      <div>
        <p class="text-sm font-medium">{{ community.theme.name }}</p>
        <p class="text-xs text-gray-400 truncate">Cities: {{ community.cities.join(', ') }}</p>
      </div>
      <button
        @click.stop="join(community._id)"
        :disabled="communityStore.joined.includes(community._id)"
        :class="communityStore.joined.includes(community._id)
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-teal-500 hover:bg-teal-600'"
        class="text-sm text-white px-4 py-2 rounded-full"
      >
        {{ communityStore.joined.includes(community._id) ? 'leave' : 'Join' }}
      </button>
    </div>
  </div>
</div>



    <!-- Main Chat Area -->
    <div class="flex-1 bg-[#111B1F] ml-96">
      <CommunityChat v-if="selectedCommunity" :community="selectedCommunity" />
      <div v-else class="h-full flex items-center justify-center text-gray-400">
        Select a community to view chat
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCommunityStore } from '@/stores/community'
import { useAuthStore } from '@/stores/auth'
import CommunityChat from '@/components/communityView.vue'

const communityStore = useCommunityStore()
const authStore = useAuthStore()
const selectedCommunity = ref(null)
const hoveredCommunity = ref(null)

async function toggleJoin(id) {
  if (communityStore.joined.includes(id)) {
    await communityStore.leaveCommunity(id)
  } else {
    await communityStore.joinCommunity(id)
  }
  await selectCommunity(id)
}

onMounted(() => {
  communityStore.fetchSuggested(
    authStore.user.city,
    authStore.user.interests,
    authStore.user.nearbyCities
  )
  communityStore.fetchJoinedCommunities(authStore.user._id)
})

async function join(id) {
  await communityStore.joinCommunity(id)
  await selectCommunity(id)
}

async function selectCommunity(id) {
  await communityStore.loadCommunity(id)
  selectedCommunity.value = communityStore.activeCommunity
}
</script>

<style scoped>
.element-with-scrollbar::-webkit-scrollbar {
  display: none;
}
.element-with-scrollbar{
  -ms-overflow-style: none;  /* IE/Edge */
  scrollbar-width: none;
}
</style>
