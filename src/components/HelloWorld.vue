<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-purple-900 to-indigo-900 text-white p-6">
    <!-- Tarjeta futurista -->
    <div class="relative bg-gray-800/40 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-lg text-center overflow-hidden">
      
      <!-- Glow decorativo -->
      <div class="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/40 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/40 rounded-full blur-3xl"></div>

      <h1 class="text-4xl font-extrabold tracking-wide mb-6">
        {{ msg }}
      </h1>

      <p class="text-gray-300 mb-8">
        Un pequeño proyecto con <span class="font-semibold text-purple-300">Vue 3 + Vite</span> 🚀
      </p>

      <button
        @click="count++"
        class="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-lg hover:scale-110 hover:shadow-purple-500/50 transition transform duration-300"
      >
        Contador: {{ count }}
      </button>

      <p class="mt-8 text-sm text-gray-400">
        ✨ Proyecto universitario con estilo ✨
      </p>
    </div>
  </div>
</template>

<style scoped>
body {
  margin: 0;
  font-family: 'Poppins', system-ui, sans-serif;
  background-color: #0f0f0f;
}
</style>
