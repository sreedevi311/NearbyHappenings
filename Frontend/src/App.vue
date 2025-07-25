<template>
  <div class="min-h-screen bg-gray-900">
    <Header></Header>
    <router-view/>
    <Footer></Footer>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue'
</script>

<style>

</style>