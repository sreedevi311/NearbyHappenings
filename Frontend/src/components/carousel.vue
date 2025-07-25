<template>
  <section class="mb-12 relative mt-2">

    <div class="relative w-[1000px] mx-auto overflow-visible">
      <!-- Carousel Track -->
      <div
        class="flex transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(event, index) in events"
          :key="event._id"
          class="flex-shrink-0 relative"
          style="width: 1000px"
        >
          <router-link :to="`/event/${event._id}`">
            <div
              class="relative h-[297px] w-[900px] mx-auto overflow-hidden rounded-xl border border-teal-400/20 bg-gray-900/20 shadow-xl"
            >
              <img
                :src="event.posterUrl"
                :alt="event.eventName"
                class="w-full h-full object-cover rounded-xl"
              />

              <!-- Event Info -->
              <div
                class="absolute bottom-0 left-0 right-0 px-6 pt-12 h-36 bg-gradient-to-t from-black/90 to-transparent z-10"
              >
                <h3 class="text-xl font-bold text-white mb-2">{{ event.eventName }}</h3>
                <div class="flex flex-wrap items-center text-teal-300 gap-x-4 gap-y-2 text-md">
                  <div class="flex items-center">
                    <span class="material-icons mr-1 text-sm">event</span>
                    <span>{{ dayjs(event.date).format('MMMM D, YYYY') }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="material-icons mr-1 text-sm">schedule</span>
                    <span>{{ event.time }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="material-icons mr-1 text-sm">location_on</span>
                    <span>{{ event.location.address }}</span>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Arrows (only once, outside the loop) -->
      <!-- Arrows aligned to container edges -->
      <button
        @click.stop="prev"
        class="absolute left-[-150px] top-1/2 -translate-y-1/2 z-20 bg-gray-900/80 hover:bg-teal-500 text-white p-2 rounded-full shadow-xl"
      >
        <span class="material-icons">chevron_left</span>
      </button>
      <button
        @click.stop="next"
        class="absolute right-[-150px] top-1/2 -translate-y-1/2 z-20 bg-gray-900/80 hover:bg-teal-500 text-white p-2 rounded-full shadow-xl"
      >
        <span class="material-icons">chevron_right</span>
      </button>


      <!-- Dots -->
      <div class="mt-6 flex justify-center space-x-2">
        <button
          v-for="(event, index) in events"
          :key="event.id"
          @click="goToSlide(index)"
          class="w-3 h-3 rounded-full transition-all duration-300"
          :class="{
            'bg-teal-400 w-6': currentIndex === index,
            'bg-gray-400/50 hover:bg-teal-300': currentIndex !== index
          }"
        />
      </div>
    </div>
  </section>
</template>




<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  events: {
    type: Array,
    required: true,
    default: () => []
  }
})

const currentIndex = ref(0)
let autoScrollInterval = null

const currentEvent = computed(() => {
  return props.events[currentIndex.value]
})

const next = () => {
  if (props.events.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % props.events.length
}

const prev = () => {
  if (props.events.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + props.events.length) % props.events.length
}

const goToSlide = (index) => {
  if (props.events.length === 0) return
  currentIndex.value = index
}

const pauseAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval)
    autoScrollInterval = null
  }
}

const resumeAutoScroll = () => {
  pauseAutoScroll()
  if (props.events.length > 1) {
    autoScrollInterval = setInterval(next, 3000)
    console.log('▶️ Auto-scroll started')
  }
}

watch(
  () => props.events,
  (newEvents) => {
    if (newEvents && newEvents.length > 1) {
      console.log('📦 Events updated, starting auto-scroll')
      currentIndex.value = 0
      resumeAutoScroll()
    }
  },
  { immediate: true }
)

onMounted(() => {
  console.log('🎬 Carousel mounted. Initial events:', props.events.length)
})

onBeforeUnmount(() => {
  pauseAutoScroll()
  console.log('🛑 Carousel unmounted. Auto-scroll stopped')
})
</script>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.carousel-enter-active,
.carousel-leave-active {
  transition: all 0.5s ease;
  position: absolute;
  width: 100%;
}
.carousel-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.carousel-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>