<template>
  <section class="mb-16 relative">
    <h2 class="text-xl font-bold mb-6 ml-32 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300">
      Upcoming Events
    </h2>

    <div class="relative w-[900px] mx-auto overflow-visible">
      <!-- Carousel Track -->
      <div class="flex transition-transform duration-500 ease-in-out"
           :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div
          v-for="(event, index) in events"
          :key="event.id"
          class="w-[900px] flex-shrink-0 px-4 relative"
        >
          <div
            class="relative h-[420px] w-[850px] overflow-hidden rounded-xl border border-teal-400/20 bg-gray-900/20 shadow-xl"
          >
            <img
              :src="event.image"
              :alt="event.name"
              class="w-full h-full object-cover rounded-xl"
            />

            <!-- Event Info -->
            <div class="absolute bottom-0 left-0 right-0 px-6 pt-12 pb-6 h-40 bg-gradient-to-t from-black/90 to-transparent z-10">
              <h3 class="text-2xl font-bold text-white mb-2">{{ event.name }}</h3>
              <div class="flex flex-wrap items-center text-teal-300 gap-x-4 gap-y-2">
                <div class="flex items-center">
                  <span class="material-icons mr-1 text-teal-400">event</span>
                  <span>{{ event.date }}</span>
                </div>
                <div class="flex items-center">
                  <span class="material-icons mr-1 text-teal-400">schedule</span>
                  <span>{{ event.time }}</span>
                </div>
                <div class="flex items-center">
                  <span class="material-icons mr-1 text-teal-400">location_on</span>
                  <span>{{ event.location }}</span>
                </div>
              </div>
            </div>

            <!-- Arrows -->
            <button
              @click.stop="prev"
              class="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-gray-900/70 hover:bg-teal-500 text-white p-2 rounded-full shadow-lg"
            >
              <span class="material-icons">chevron_left</span>
            </button>
            <button
              @click.stop="next"
              class="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-gray-900/70 hover:bg-teal-500 text-white p-2 rounded-full shadow-lg"
            >
              <span class="material-icons">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

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

watch(() => props.events, () => {
  currentIndex.value = 0
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

const pauseAutoScroll = () => clearInterval(autoScrollInterval)

const resumeAutoScroll = () => {
  pauseAutoScroll()
  if (props.events.length > 1) {
    autoScrollInterval = setInterval(next, 3000)
  }
}

onMounted(resumeAutoScroll)
onBeforeUnmount(pauseAutoScroll)
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