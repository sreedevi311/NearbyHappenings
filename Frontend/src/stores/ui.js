import { defineStore } from 'pinia'
import { ref } from 'vue'
import Login from '@/components/Login.vue'
import Signup from '@/components/SignUp.vue'
import Profile from '@/components/Profile.vue'

export const useUiStore = defineStore('ui', () => {
  const showPanel = ref(false)
  const activeComponent = ref(null)
  const showLocationModal = ref(false)
  const showInterestModal = ref(false)

  function openPanel(type) {
    if (type === 'login') activeComponent.value = Login
    if (type === 'signup') activeComponent.value = Signup
    if (type === 'profile') activeComponent.value = Profile
    showPanel.value = true
  }

  function closePanel() {
    showPanel.value = false
  }

  function switchPanel(type) {
    openPanel(type)
  }

  return {
    showPanel,
    activeComponent,
    showLocationModal,
    showInterestModal,
    openPanel,
    closePanel,
    switchPanel
  }
})
