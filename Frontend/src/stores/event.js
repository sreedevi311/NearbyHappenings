// stores/event.js
import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useEventStore = defineStore('event', {
  state: () => ({
    groupedEvents: {},
    upcomingEvents: [],
    selectedEvent:null,
  }),
  actions: {
    async fetchGroupedEvents(userId) {
      
      const { data } = await api.get(`/events/user-interested-events/${userId}`)
      this.groupedEvents = data.reduce((acc, event) => {
        const themeKey = event.theme?.name || event.theme
        if (!acc[themeKey]) acc[themeKey] = []
        acc[themeKey].push(event)
        return acc
      }, {})
    },
    async fetchUpcomingEvents(userId) {
      const { data } = await api.get(`/events/user-city-upcoming-day-events/${userId}`)
      this.upcomingEvents = data
      console.log(this.upcomingEvents)
    },
    async fetchEventById(id) {
      try {
        const { data } = await api.get(`/events/${id}`) // make sure this endpoint exists
        this.selectedEvent = data
      } catch (err) {
        console.error('❌ Failed to fetch event by ID:', err)
      }
    },
  },
})
