<script setup>
import { ref } from "vue"
import { RouterView, RouterLink } from "vue-router"

const sidebarOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar desktop -->
    <aside class="hidden md:flex w-64 bg-gray-800 text-white p-4 flex-col">
      <h2 class="text-xl font-bold mb-6">Mi App</h2>
      <nav class="flex flex-col gap-4">
        <RouterLink to="/Dashboard" class="hover:text-indigo-400">Dashboard</RouterLink>
        <RouterLink to="/Rutas" class="hover:text-indigo-400">Rutas</RouterLink>
        <RouterLink to="/Camiones" class="hover:text-indigo-400">Camiones</RouterLink>
      </nav>
    </aside>

    <!-- Sidebar mobile (overlay) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 flex md:hidden"
    >
      <div class="fixed inset-0 bg-black/50" @click="sidebarOpen = false"></div>
      <aside class="relative w-64 bg-gray-800 text-white p-4 flex flex-col z-50">
        <button
          class="absolute top-4 right-4 text-white text-2xl"
          @click="sidebarOpen = false"
        >
          ✕
        </button>
        <h2 class="text-xl font-bold mb-6">Mi App</h2>
        <nav class="flex flex-col gap-4">
          <RouterLink
            to="/Dashboard"
            class="hover:text-indigo-400"
            @click="sidebarOpen = false"
            >Dashboard</RouterLink
          >
          <RouterLink
            to="/Rutas"
            class="hover:text-indigo-400"
            @click="sidebarOpen = false"
            >Rutas</RouterLink
          >
          <RouterLink
            to="/Camiones"
            class="hover:text-indigo-400"
            @click="sidebarOpen = false"
            >Camiones</RouterLink
          >
        </nav>
      </aside>
    </div>

    <!-- Contenido -->
    <main class="flex-1 bg-gray-100 p-2">
      <!-- Botón hamburguesa en móvil -->
      <button
        class="md:hidden mb-4 px-3 py-2 bg-gray-800 text-white rounded"
        @click="sidebarOpen = true"
      >
        ☰ Menú
      </button>

      <RouterView />
    </main>
  </div>
</template>
