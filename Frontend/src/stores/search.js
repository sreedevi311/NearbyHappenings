import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { api } from '../services/api'
import { useRouter } from 'vue-router'

export const useSearchStore = defineStore('search', {
  state: () => ({
    inputFocused: false,
    searchQuery: '',
    allTags: [],
    searchResults: [],
    filteredResults: [],
    searchHistory: [],
  }),

  getters: {
    filteredTags(state) {
      if (!state.searchQuery.trim()) return state.allTags.slice(0, 10)
      return state.allTags.filter(tag =>
        tag.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    }
  },

  actions: {
    async fetchSearchResults(query) {
      if (!query.trim()) {
        this.filteredResults = []
        return
      }
      try {
        const res = await api.get(`/events/search?q=${query}`)
        console.log('Search Results:', res.data)
        this.filteredResults = res.data
      } catch (error) {
        console.error('Search error:', error)
      }
    },

    async handleSearchClick(router) {
      try {
        const response = await api.get(`/events/search?q=${this.searchQuery}`)
        this.searchResults = response.data
        const firstEvent = this.searchResults[0]
        if (firstEvent && firstEvent._id && firstEvent.theme) {
          router.push(`/events/${firstEvent.theme}/${firstEvent._id}`)
        } else {
          console.warn('No valid event found to navigate.')
        }
      } catch (error) {
        console.error('Search failed:', error)
      }
    },

    selectType(type) {
      this.inputFocused = true
      this.searchQuery = type
      this.fetchSearchResults(type)
    },

    selectResult(result,router) {
      this.searchQuery = result.eventName
      this.inputFocused = false
      if (!result.theme || !result._id) return
      router.push({ name: 'event-details', params: { theme: result.theme, id: result._id } })
    },

    goToEvent(event,router) {
      if (event && event._id && event.theme) {
        router.push({ name: 'event-details', params: { theme: event.theme, id: event._id } })
      } else {
        console.warn('Missing event, theme or ID:', event)
      }
    },

    handleBlur() {
      setTimeout(() => {
        this.inputFocused = false
      }, 200)
    },

    setAllTags(tags) {
      this.allTags = tags.filter(tag => tag.trim() !== '')
    }
  }
})
