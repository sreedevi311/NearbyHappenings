import { defineStore } from 'pinia'
import { api } from '@/services/api' // Adjust path as needed

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
  }),

  actions: {
    async login(email, password) {
      try {
        const res = await api.post('/auth/login', { email, password })
        this.accessToken = res.data.accessToken
        this.refreshToken = res.data.refreshToken
        this.user = { email } // you can fetch profile later
      } catch (err) {
        console.error('Login failed:', err)
        throw err
      }
    },
    async signup(email, password) {
    try {
        const res = await api.post('/auth/signup', { email, password })
        this.accessToken = res.data.accessToken
        this.refreshToken = res.data.refreshToken
        this.user = { email } // You can later replace this with actual user data
    } catch (err) {
        console.error('Signup failed:', err)
        throw err
    }
    }
    ,

    async logout() {
      try {
        await api.post('/auth/logout', { email: this.user?.email })
      } catch (err) {
        console.warn('Logout error:', err)
      } finally {
        this.user = null
        this.accessToken = null
        this.refreshToken = null
      }
    },

    async refreshTokens() {
      try {
        const res = await api.post('/auth/refresh', {
          token: this.refreshToken,
        })
        this.accessToken = res.data.accessToken
        this.refreshToken = res.data.refreshToken
      } catch (err) {
        console.error('Token refresh failed:', err)
        this.logout()
      }
    },
        async updatePreferences(city, interests) {
      try {
        const res = await api.put('/auth/update-preferences', {
          city,
          interests
        }, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          }
        })

        if (res.data.success) {
          this.user = res.data.user // update user data in store
        } else {
          console.error('Update failed:', res.data.error)
        }
      } catch (err) {
        console.error('Failed to update preferences:', err)
      }
    },
  },
})
