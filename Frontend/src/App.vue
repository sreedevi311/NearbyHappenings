<template>
  <div class="min-h-screen bg-gray-950">
    <Header v-if="hideHeaderNFooter"></Header>
    <router-view/>
    <Footer v-if="hideHeaderNFooter"></Footer>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue'

import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const hideHeaderNFooter = computed(() => !['/requests', '/add-event','/add-community',  '/communities'].includes(route.path))
</script>

<style>

</style>