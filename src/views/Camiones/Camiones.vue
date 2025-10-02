<script setup>
import { ref } from "vue";

const rutas = ref(18);
const camiones = ref(42);
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Camiones</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Rutas -->
      <div class="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
        <div>
          <p class="text-gray-500">Rutas activas</p>
          <h2 class="text-4xl font-bold text-indigo-600">{{ rutas }}</h2>
        </div>
        <span class="bg-indigo-100 text-indigo-600 p-4 rounded-full">
          🛣️
        </span>
      </div>

      <!-- Camiones -->
      <div class="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
        <div>
          <p class="text-gray-500">Camiones disponibles</p>
          <h2 class="text-4xl font-bold text-green-600">{{ camiones }}</h2>
        </div>
        <span class="bg-green-100 text-green-600 p-4 rounded-full">
          🚚
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
