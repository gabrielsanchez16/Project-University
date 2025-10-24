<script setup>
import { ref } from "vue";

const rutas = ref(18);
const camiones = ref(42);

// Lista de camiones registrados
const listaCamiones = ref([
  { id: 1, placa: "ABC-123", conductor: "Juan Pérez", capacidad: "10 ton" },
  { id: 2, placa: "XYZ-789", conductor: "María López", capacidad: "8 ton" },
]);

// Datos del nuevo camión
const nuevoCamion = ref({
  placa: "",
  conductor: "",
  capacidad: "",
});

// Registrar camión
const registrarCamion = () => {
  if (nuevoCamion.value.placa && nuevoCamion.value.conductor && nuevoCamion.value.capacidad) {
    listaCamiones.value.push({
      id: listaCamiones.value.length + 1,
      ...nuevoCamion.value,
    });

    // Reset form
    nuevoCamion.value = { placa: "", conductor: "", capacidad: "" };

    // Contador de camiones disponibles
    camiones.value++;
    
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">🚛 Gestión de Camiones</h1>

    <!-- Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <!-- Rutas -->
      <div class="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
        <div>
          <p class="text-gray-500">Rutas activas</p>
          <h2 class="text-4xl font-bold text-indigo-600">{{ rutas }}</h2>
        </div>
        <span class="bg-indigo-100 text-indigo-600 p-4 rounded-full">🛣️</span>
      </div>

      <!-- Camiones -->
      <div class="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
        <div>
          <p class="text-gray-500">Camiones disponibles</p>
          <h2 class="text-4xl font-bold text-green-600">{{ camiones }}</h2>
        </div>
        <span class="bg-green-100 text-green-600 p-4 rounded-full">🚚</span>
      </div>
    </div>

    <!-- Registro de Camiones -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Lista de camiones -->
      <div class="bg-white rounded-2xl shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">📋 Camiones Registrados</h2>
        <div v-if="listaCamiones.length" class="space-y-4">
          <div
            v-for="camion in listaCamiones"
            :key="camion.id"
            class="p-4 bg-gray-50 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="font-semibold text-gray-800">🚛 {{ camion.placa }}</p>
              <p class="text-gray-500 text-sm">Conductor: {{ camion.conductor }}</p>
              <p class="text-gray-500 text-sm">Capacidad: {{ camion.capacidad }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500 italic">No hay camiones registrados</p>
      </div>

      <!-- Formulario -->
      <div class="bg-white rounded-2xl shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">➕ Registrar Camión</h2>
        <form @submit.prevent="registrarCamion" class="space-y-4">
          <input
            v-model="nuevoCamion.placa"
            type="text"
            placeholder="Placa"
            class="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            v-model="nuevoCamion.conductor"
            type="text"
            placeholder="Conductor"
            class="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            v-model="nuevoCamion.capacidad"
            type="text"
            placeholder="Capacidad (ej: 10 ton)"
            class="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            Registrar 🚚
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
