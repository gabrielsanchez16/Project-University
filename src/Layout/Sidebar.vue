<script setup>
import { ref, computed } from "vue";
import { RouterView, RouterLink, useRoute, useRouter } from "vue-router";
import {
  ChartBarIcon,
  MapIcon,
  TruckIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/vue/24/outline";

const sidebarOpen = ref(false);
const route = useRoute();
const router = useRouter();

const menu = [
  { name: "Dashboard", icon: ChartBarIcon, path: "/Dashboard" },
  { name: "Rutas", icon: MapIcon, path: "/Rutas" },
  { name: "Camiones", icon: TruckIcon, path: "/Camiones" },
];

// 🧠 Obtenemos usuario del localStorage
const user = computed(() => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
});

const logout = () => {
  localStorage.clear(); // Limpia datos de sesión
  router.push("/login"); // Redirige al login
};
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar desktop -->
    <aside
      class="hidden lg:flex lg:w-64 h-[100vh] fixed backdrop-blur-xl bg-gray-900/90 text-white p-6 flex-col justify-between shadow-2xl border-r border-white/10"
    >
      <div>
        <h2 class="text-2xl font-extrabold mb-8 flex items-center gap-2 text-green-400">
          🌿 Ruta<span class="text-indigo-400">Limpia</span>
        </h2>

        <!-- 🧍 Perfil de usuario -->
        <div
          v-if="user"
          class="flex items-center gap-4 bg-white/10 rounded-2xl p-4 mb-6 border border-white/10"
        >
          <img
            v-if="user.foto"
            :src="user.foto"
            alt="Foto de perfil"
            class="w-12 h-12 rounded-full object-cover border-2 border-green-400"
          />
          <UserCircleIcon
            v-else
            class="w-12 h-12 text-gray-300 border-2 border-green-400 rounded-full"
          />
          <div class="text-sm">
            <p class="font-semibold text-white">{{ user.nombre }} {{ user.apellido }}</p>
            <p class="text-gray-400 text-xs">{{ user.correo }}</p>
          </div>
        </div>

        <nav class="flex flex-col gap-3">
          <RouterLink
            v-for="item in menu"
            :key="item.name"
            :to="item.path"
            class="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300"
            :class="route.path === item.path ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/10 text-gray-300'"
          >
            <component :is="item.icon" class="w-6 h-6" />
            <span class="font-medium">{{ item.name }}</span>
          </RouterLink>
        </nav>
      </div>

      <!-- Botón cerrar sesión -->
      <button
        @click="logout"
        class="flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
      >
        <ArrowLeftOnRectangleIcon class="w-6 h-6" />
        <span class="font-medium">Cerrar sesión</span>
      </button>
    </aside>

    <div class="hidden lg:flex lg:w-64"></div>

    <!-- Sidebar mobile overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-40 lg:hidden">
      <div class="absolute inset-0 bg-black/50" @click="sidebarOpen = false"></div>
      <aside
        class="relative w-64 h-full bg-gray-900/80 backdrop-blur-xl text-white p-6 flex flex-col justify-between z-50 shadow-xl"
      >
        <button
          class="absolute top-4 right-4 text-white text-2xl"
          @click="sidebarOpen = false"
        >
          ✕
        </button>
        <div>
          <h2 class="text-2xl font-extrabold mb-8 flex items-center gap-2 text-green-400">
            🌿 Ruta<span class="text-indigo-400">Limpia</span>
          </h2>

          <!-- 👤 Perfil en móvil -->
          <div
            v-if="user"
            class="flex items-center gap-4 bg-white/10 rounded-2xl p-4 mb-6 border border-white/10"
          >
            <img
              v-if="user.foto"
              :src="user.foto"
              alt="Foto de perfil"
              class="w-12 h-12 rounded-full object-cover border-2 border-green-400"
            />
            <UserCircleIcon
              v-else
              class="w-12 h-12 text-gray-300 border-2 border-green-400 rounded-full"
            />
            <div class="text-sm">
              <p class="font-semibold text-white">{{ user.nombre }} {{ user.apellido }}</p>
              <p class="text-gray-400 text-xs">{{ user.correo }}</p>
            </div>
          </div>

          <nav class="flex flex-col gap-3">
            <RouterLink
              v-for="item in menu"
              :key="item.name"
              :to="item.path"
              class="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300"
              :class="route.path === item.path ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/10 text-gray-300'"
              @click="sidebarOpen = false"
            >
              <component :is="item.icon" class="w-6 h-6" />
              <span class="font-medium">{{ item.name }}</span>
            </RouterLink>
          </nav>
        </div>

        <!-- Botón cerrar sesión mobile -->
        <button
          @click="logout"
          class="flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
        >
          <ArrowLeftOnRectangleIcon class="w-6 h-6" />
          <span class="font-medium">Cerrar sesión</span>
        </button>
      </aside>
    </div>

    <!-- Contenido -->
    <main class="flex-1 w-full p-4">
      <!-- Botón hamburguesa -->
      <button
        class="lg:hidden mb-4 px-4 py-2 bg-gray-900 text-white rounded-xl shadow hover:bg-gray-700 transition"
        @click="sidebarOpen = true"
      >
        ☰ Menú
      </button>
      <RouterView />
    </main>
  </div>
</template>
