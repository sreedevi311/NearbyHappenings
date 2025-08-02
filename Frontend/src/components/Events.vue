<template class="bg-black">
    <div class="container mx-auto px-4 py-6 pb-20">
        <!-- Header with animated glow-->
        <header class="text-center mb-10 relative">
            <h1 class="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
                Event Themes Explorer
            </h1>
        </header>

        <!-- Theme cards grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div 
                v-for="theme in themes" 
                :key="theme._id"
                @mouseenter="hoveredTheme = theme._id"
                @mouseleave="hoveredTheme = null"
                class="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden neon-border"
            >
                <div class="relative h-48">
                    <img 
                        :src="theme.posterUrl" 
                        :alt="theme.name"
                        class="w-full h-full object-cover"
                    >
                    
                    <div 
                        class="absolute top-2 right-2 bg-teal-500/90 text-xs font-bold px-2 py-1 rounded-full text-white transition-all duration-500"
                        :class="{'-translate-x-0': loaded, 'translate-x-full': !loaded}"
                    >
                        {{ theme.tag }}
                    </div>
                    
                    <div 
                        v-if="hoveredTheme === theme._id"
                        class="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300"
                    >
                    <button 
                    @click="$router.push({ path: `/events/${theme.name.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}` })"
                    class="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full font-medium flex items-center gap-1 transition-all"
                    >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Explore
                    </button>

                    </div>

                    <!--Title with Dark Overlay -->
                    <div class="absolute bottom-0 left-0 right-0">
                        <div 
                        class="backdrop-blur-md bg-black/60 rounded-md inline-block px-3 py-1 transition-all duration-1000 transform"
                        :class="{'-translate-x-0 opacity-100': loaded, '-translate-x-10 opacity-0': !loaded}"
                        >
                            <h3 class="text-white text-md font-bold">
                                {{ theme.name }}
                            </h3>
                        </div>
                    </div>
                </div>
                
                <!--CARD FOOTER-->
                <div class="p-5 flex justify-between items-center">
                    <span class="text-teal-400 text-xs font-medium bg-teal-900/30 px-2 py-1 rounded-full">
                        {{ theme.eventsCount }} events
                    </span>
                    <button 
                        @click="toggleFavorite(theme._id)"
                        class="p-1 rounded-full transition-colors"
                        :class="{
                            'text-yellow-400': theme.isFavorite,
                            'text-gray-400 hover:text-yellow-400': !theme.isFavorite
                        }"
                    >
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed,onMounted } from 'vue';
    import {api} from '../services/api'

    const themes=ref([]);
    const hoveredTheme = ref(null);

    const fetchEventThemes=async()=>{
        const {data}=await api.get('/events/get-event-themes')
        themes.value=data;
    }
    const toggleFavorite = (id) => {
        const theme = themes.value.find(t => t.id === id);
        if (theme) {
            theme.isFavorite = !theme.isFavorite;
        }
    };


    const loaded = ref(false);

    onMounted(() => {
    fetchEventThemes()
    setTimeout(() => {
        loaded.value = true;
    }, 100);
    });
</script>

<style scoped>
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}
.theme-hover:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(66, 184, 131, 0.3);
}
.pulse-animation {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.neon-border {
    position: relative;
}
.neon-border::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid transparent;
    border-radius: inherit;
    background: linear-gradient(45deg, #42b883, #35495e) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    pointer-events: none;
}
.neon-border {
  position: relative;
  overflow: hidden;
  transition: transform 0.4s ease, box-shadow 0.3s ease;
}

.neon-border:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
}
</style>