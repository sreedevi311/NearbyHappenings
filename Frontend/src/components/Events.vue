<template class="bg-black">
    <div class="container mx-auto px-4 py-12 bg-black">
        <!-- Header with animated glow-->
        <header class="text-center mb-16 relative">
            <h1 class="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
                Event Themes Explorer
            </h1>
            <p class="text-lg text-gray-300 max-w-2xl mx-auto">
                Discover your next adventure across diverse interest areas.
            </p>
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-teal-500/10 blur-3xl -z-10"></div>
        </header>

        <!-- Theme cards grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div 
                v-for="theme in filteredThemes" 
                :key="theme.id"
                @mouseenter="hoveredTheme = theme.id"
                @mouseleave="hoveredTheme = null"
                class="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden neon-border"
            >
                <div class="relative h-48">
                    <img 
                        :src="theme.image" 
                        :alt="theme.description"
                        class="w-full h-full object-cover"
                    >
                    
                    <div 
                        class="absolute top-2 right-2 bg-teal-500/90 text-xs font-bold px-2 py-1 rounded-full text-white transition-all duration-500"
                        :class="{'-translate-x-0': loaded, 'translate-x-full': !loaded}"
                    >
                        {{ theme.tag }}
                    </div>
                    
                    <div 
                        v-if="hoveredTheme === theme.id"
                        class="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300"
                    >
                    <button 
                    @click="$router.push({ path: `/events/${theme.title.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}` })"
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
                            <h3 class="text-white text-lg font-bold">
                                {{ theme.title }}
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
                        @click="toggleFavorite(theme.id)"
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

        <!-- EMPTY STATE -->
        <div 
            v-if="filteredThemes.length === 0"
            class="text-center py-20"
        >
            <div class="max-w-md mx-auto">
                <div class="w-24 h-24 mx-auto mb-6 text-teal-400 pulse-animation">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 class="text-2xl font-bold mb-2">No themes found</h3>
                <p class="text-gray-400">Try adjusting your search or filter criteria</p>
                <button 
                    @click="resetFilters"
                    class="mt-6 px-6 py-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-medium transition-all"
                >
                    Reset filters
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed,onMounted } from 'vue';

export default {
    setup() {
        const themes = ref([
            {
                id: 1,
                title: "Yoga & Wellness",
                description: "Rejuvenate with holistic wellness programs, yoga sessions, and mindfulness workshops.",
                tag: "Health",
                eventsCount: 24,
                isFavorite: false,
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80"
            },
            {
                id: 2,
                title: "Art & Culture",
                description: "Explore creative expression through art exhibitions, cultural fairs, and craft workshops.",
                tag: "Creative",
                eventsCount: 18,
                isFavorite: false,
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80"
            },
            {
                id: 3,
                title: "Music & Dance",
                description: "Celebrate rhythmic harmony with concerts, dance performances, and musical collaborations.",
                tag: "Entertainment",
                eventsCount: 32,
                isFavorite: false,
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80"
            },
            {
                id: 4,
                title: "Martial Arts & Fitness",
                description: "Build discipline and strength through martial arts classes and fitness challenges.",
                tag: "Fitness",
                eventsCount: 15,
                isFavorite: false,
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80"
            },
            {
                id: 5,
                title: "Gardening & Organic Living",
                description: "Connect with nature through organic gardening workshops and sustainable living sessions.",
                tag: "Eco",
                eventsCount: 12,
                isFavorite: false,
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80"
            },
            {
                id: 6,
                title: "First Aid & Health Awareness",
                description: "Learn life-saving skills and promote health awareness through interactive programs.",
                tag: "Health",
                eventsCount: 9,
                isFavorite: false,
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80"
            },
            {
                id: 7,
                title: "Theatre & Literature",
                description: "Immerse in storytelling through plays, book discussions, and literary festivals.",
                tag: "Creative",
                eventsCount: 14,
                isFavorite: false,
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80"
            },
            {
                id: 8,
                title: "Adventure & Rallies",
                description: "Fuel your adventurous spirit with outdoor challenges and team rallies.",
                tag: "Sports",
                eventsCount: 22,
                isFavorite: false,
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80"
            },
            {
                id: 9,
                title: "Career & Skill Development",
                description: "Enhance your professional growth with career workshops and skill-building sessions.",
                tag: "Education",
                eventsCount: 27,
                isFavorite: false,
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80"
            },
            {
                id: 10,
                title: "Community Service & Awareness",
                description: "Make a difference through volunteer projects and community awareness initiatives.",
                tag: "Social",
                eventsCount: 19,
                isFavorite: false,
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80"
            }
        ]);

        const allTags = ref(["All", "Health", "Creative", "Entertainment", "Fitness", "Eco", "Sports", "Education", "Social"]);
        const activeTags = ref(["All"]);
        const hoveredTheme = ref(null);

        const filteredThemes = computed(() => {
            let filtered = [...themes.value];
            
            // Filter by tags (skip if "All" is selected)
            if (!activeTags.value.includes("All")) {
                filtered = filtered.filter(theme => 
                    activeTags.value.includes(theme.tag)
                );
            }
            
            return filtered;
        });

        const toggleFavorite = (id) => {
            const theme = themes.value.find(t => t.id === id);
            if (theme) {
                theme.isFavorite = !theme.isFavorite;
            }
        };

        const toggleTagFilter = (tag) => {
            if (tag === "All") {
                activeTags.value = ["All"];
            } else {
                const index = activeTags.value.indexOf(tag);
                if (index === -1) {
                    // Remove "All" if any other tag is selected
                    activeTags.value = activeTags.value.filter(t => t !== "All");
                    activeTags.value.push(tag);
                } else {
                    activeTags.value.splice(index, 1);
                    // If no tags selected, default to "All"
                    if (activeTags.value.length === 0) {
                        activeTags.value = ["All"];
                    }
                }
            }
        };

        const resetFilters = () => {
            activeTags.value = ["All"];
        };

        const loaded = ref(false);

        onMounted(() => {
        // Trigger animations after component mounts
        setTimeout(() => {
            loaded.value = true;
        }, 100);
        });
        return {
            themes,
            allTags,
            activeTags,
            hoveredTheme,
            filteredThemes,
            toggleFavorite,
            toggleTagFilter,
            resetFilters,
            loaded,
        };
    }
};
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