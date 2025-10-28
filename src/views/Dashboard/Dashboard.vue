<script setup>
import { ref, onMounted, nextTick } from "vue";
import Chart from "chart.js/auto";
import { useCounterStore } from "../../stores/counter";


const rutas = ref(0);
const camiones = ref(0);
const globalStore = useCounterStore();


const obtenerCamiones = async () => {
  try {

    const response = await fetch(
      `http://apirecoleccion.gonzaloandreslucio.com/api/vehiculos?perfil_id=${globalStore.id}`
    );
    const data = await response.json();
    camiones.value = data.data.length;
  } catch (error) {
    console.error("Error al obtener camiones:", error);
  }
};

const obtenerRutas = async () => {
  try {
    const res = await fetch(
      `http://apirecoleccion.gonzaloandreslucio.com/api/rutas?perfil_id=${globalStore.id}`
    );
    const data = await res.json();
    rutas.value = data.data.length;
  } catch (error) {
    console.error("Error al obtener rutas:", error);
  }
};

let comparativeChart = null;
let growthChart = null;

const renderCharts = async () => {
  await nextTick(); // Asegura que el DOM cargó los canvas

  const barCtx = document.getElementById("comparativeChart").getContext("2d");
  const lineCtx = document.getElementById("growthChart").getContext("2d");

  // Destruir gráficos anteriores si existen
  if (comparativeChart) comparativeChart.destroy();
  if (growthChart) growthChart.destroy();

  comparativeChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["Rutas Activas", "Camiones Disponibles"],
      datasets: [
        {
          label: "Cantidad Actual",
          data: [rutas.value, camiones.value],
          backgroundColor: ["rgba(99, 102, 241, 0.5)", "rgba(34, 197, 94, 0.5)"],
          borderColor: ["rgb(99, 102, 241)", "rgb(34, 197, 94)"],
          borderWidth: 2,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });

  growthChart = new Chart(lineCtx, {
    type: "line",
    data: {
      labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
      datasets: [
        {
          label: "Rutas",
          data: [3, 6, 8, rutas.value],
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.3)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Camiones",
          data: [2, 4, 6, camiones.value],
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.3)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });
};

onMounted(async () => {
  await obtenerCamiones();
  await obtenerRutas();
  await renderCharts();
});
</script>



<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-100 p-6 lg:p-10">
    <!-- Header tipo README -->
    <div class="bg-white/80 backdrop-blur shadow-lg rounded-3xl p-8 mb-10 border border-green-100">
      <h1 class="text-4xl md:text-5xl font-extrabold text-green-700 flex items-center gap-3">
        🌿 RutaLimpia
      </h1>

      <!-- 👋 Bienvenida personalizada -->
      <p v-if="globalStore?.user?.nombre" class="mt-3 text-xl font-semibold text-green-600">
        ¡Bienvenido, {{ globalStore.user.nombre }} {{ globalStore.user.apellido }}! 🌱
      </p>

      <p class="mt-4 text-gray-600 text-lg leading-relaxed">
        <strong>RutaLimpia</strong> es un sistema diseñado para gestionar camiones de aseo urbano y
        las rutas de recolección de residuos en la ciudad. Su objetivo es mantener la ciudad limpia,
        optimizar los recorridos y cuidar el medio ambiente mediante una mejor organización y
        trazabilidad de los vehículos.
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <span class="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">♻ Gestión Ambiental</span>
        <span class="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium">🛣 Control de Rutas</span>
        <span class="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-medium">🚛 Vehículos</span>
      </div>
    </div>

    <!-- Cards del Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Card de Rutas -->
      <div
        class="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 flex items-center justify-between">
        <div>
          <p class="text-gray-500 font-medium">Rutas activas</p>
          <h2 class="text-5xl font-extrabold text-indigo-600 group-hover:scale-110 transition-transform">
            {{ rutas }}
          </h2>
        </div>
        <span
          class="bg-indigo-100 text-indigo-600 p-5 rounded-full text-4xl group-hover:bg-indigo-200 transition-all">🛣️</span>
      </div>

      <!-- Card de Camiones -->
      <div
        class="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 flex items-center justify-between">
        <div>
          <p class="text-gray-500 font-medium">Camiones disponibles</p>
          <h2 class="text-5xl font-extrabold text-green-600 group-hover:scale-110 transition-transform">
            {{ camiones }}
          </h2>
        </div>
        <span
          class="bg-green-100 text-green-600 p-5 rounded-full text-4xl group-hover:bg-green-200 transition-all">🚚</span>
      </div>

      <!-- Card Motivacional -->
      <div
        class="group bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-green-300 flex flex-col items-start justify-center">
        <p class="text-lg font-medium opacity-90 mb-2">Impacto Ambiental</p>
        <h2 class="text-4xl font-extrabold group-hover:scale-105 transition-transform">
          🌎 + Limpieza = + Vida
        </h2>
        <p class="mt-3 text-sm opacity-80">
          Cada ruta registrada ayuda a mantener nuestra ciudad más limpia y sostenible.
        </p>
      </div>
    </div>
  </div>

  <!-- Sección de gráficos -->
  <div class="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 mt-10">
    <h2 class="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
      📊 Estadísticas del Sistema
    </h2>
    <div class="h-64">
      <canvas id="comparativeChart"></canvas>
    </div>
    <div class="h-64 mt-10">
      <canvas id="growthChart"></canvas>
    </div>
  </div>
</template>


<style scoped></style>
