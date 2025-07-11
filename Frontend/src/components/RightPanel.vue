<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50"
    @click.self="close"
  >
    <div
      class="w-full max-w-md bg-white h-full overflow-y-auto shadow-xl transform transition-transform duration-300"
    >
      <button @click="close" class="text-gray-500 text-2xl p-4">✕</button>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue';

const visible = ref(false);

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
}

defineExpose({ open, close });
</script>