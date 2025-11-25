<script setup>
import { ref, computed, onMounted } from "vue";
import { useCounterStore } from "../../stores/counter";

const globalStore = useCounterStore();

const perfilId = globalStore.id;
const apiUrl = "https://apirecoleccion.gonzaloandreslucio.com/api/vehiculos";

const rutas = ref(18);
const camiones = ref(0);
const listaCamiones = ref([]);

const nuevoCamion = ref({
  placa: "",
  modelo: "",
  marca: "",
  activo: false,
  perfil_id: perfilId,
});

// Estado para edición
const editando = ref(false);
const camionEditado = ref({ id: null, placa: "", modelo: "", marca: "", activo: false });

// ✅ Paginación
const paginaActual = ref(1);
const itemsPorPagina = 5;
const totalPaginas = computed(() =>
  Math.ceil(listaCamiones.value.length / itemsPorPagina)
);
const camionesPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina;
  return listaCamiones.value.slice(inicio, inicio + itemsPorPagina);
});

// ✅ Obtener camiones
const obtenerCamiones = async () => {
  try {
    const response = await fetch(`${apiUrl}?perfil_id=${perfilId}`);
    const data = await response.json();
    listaCamiones.value = data.data;
    camiones.value = data.data.length;
    paginaActual.value = 1;
  } catch (error) {
    console.error("Error al obtener camiones:", error);
  }
};

// ✅ Registrar camión
const registrarCamion = async () => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoCamion.value),
    });

    if (!response.ok) throw new Error("Error al registrar camión");

    nuevoCamion.value = { placa: "", modelo: "", marca: "", activo: false, perfil_id: perfilId };
    await obtenerCamiones();
  } catch (error) {
    console.error(error);
  }
};

// ✅ Eliminar camión
const eliminarCamion = async (id) => {
  if (!confirm("¿Seguro que deseas eliminar este camión?")) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    await obtenerCamiones();
  } catch (error) {
    console.error(error);
  }
};

// ✅ Activar modo edición
const activarEdicion = (camion) => {
  editando.value = true;
  camionEditado.value = { ...camion };
};

// ✅ Guardar edición
const guardarEdicion = async () => {
  try {
    const response = await fetch(`${apiUrl}/${camionEditado.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(camionEditado.value),
    });

    if (!response.ok) throw new Error("Error al actualizar");
    editando.value = false;
    await obtenerCamiones();
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  obtenerCamiones();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">🚛 Gestión de Camiones</h1>

    <!-- Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">


      <div class="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
        <div>
          <p class="text-gray-500">Camiones disponibles</p>
          <h2 class="text-4xl font-bold text-green-600">{{ camiones }}</h2>
        </div>
        <span class="bg-green-100 text-green-600 p-4 rounded-full">🚚</span>
      </div>
    </div>

    <!-- Lista de camiones -->
    <div class="bg-white rounded-2xl shadow-md p-6 mb-10">
      <h2 class="text-xl font-bold text-gray-800 mb-4">📋 Camiones Registrados</h2>
      <div v-if="camionesPaginados.length" class="space-y-4">
        <div v-for="camion in camionesPaginados" :key="camion.id"
          class="p-4 bg-gray-50 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div v-if="editando && camionEditado.id === camion.id" class="w-full space-y-2">
            <input v-model="camionEditado.placa" class="w-full p-2 border rounded-lg" />
            <input v-model="camionEditado.marca" type="text" placeholder="Marca" class="w-full p-3 border rounded-xl" />
        <input v-model="camionEditado.modelo" type="text" placeholder="Modelo" class="w-full p-3 border rounded-xl" />
        <div>
          <label for="activo" class="flex items-center text-gray-600">Activo</label>
          <input v-model="camionEditado.activo" type="checkbox" class="w-[20px] h-[20px] mt-2 ml-2 border rounded-xl" />
        </div>
            <button @click="guardarEdicion" class="bg-green-600 text-white px-4 py-2 rounded-lg">💾 Guardar</button>
          </div>
          <div v-else>
            <p class="font-semibold text-gray-800">🚛 {{ camion.placa }}</p>
            <p class="text-gray-500 text-sm">Marca: {{ camion.marca }}</p>
            <p class="text-gray-500 text-sm">Modelo: {{ camion.modelo }}</p>
            <p class="text-gray-500 text-sm">Estado: {{ camion.activo ? 'Activo' : 'Inactivo' }}</p>
          </div>
          <div class="flex gap-2 mt-2 sm:mt-0">
            <button @click="activarEdicion(camion)" class="bg-blue-500 text-white px-4 py-2 rounded-lg">✏️
              Editar</button>
            <button @click="eliminarCamion(camion.id)" class="bg-red-500 text-white px-4 py-2 rounded-lg">🗑
              Eliminar</button>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500 italic">No hay camiones registrados</p>

      <!-- Paginación -->
      <div v-if="totalPaginas > 1" class="flex justify-center gap-4 mt-6">
        <button @click="paginaActual--" :disabled="paginaActual === 1"
          class="px-3 py-1 rounded-lg bg-gray-200 disabled:opacity-50">
          ⬅️ Anterior
        </button>
        <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
        <button @click="paginaActual++" :disabled="paginaActual === totalPaginas"
          class="px-3 py-1 rounded-lg bg-gray-200 disabled:opacity-50">
          Siguiente ➡️
        </button>
      </div>
    </div>

    <!-- Formulario -->
    <div class="bg-white rounded-2xl shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4">➕ Registrar Camión</h2>
      <form @submit.prevent="registrarCamion" class="space-y-4">
        <input v-model="nuevoCamion.placa" type="text" placeholder="Placa" class="w-full p-3 border rounded-xl" />
        <input v-model="nuevoCamion.marca" type="text" placeholder="Marca" class="w-full p-3 border rounded-xl" />
        <input v-model="nuevoCamion.modelo" type="text" placeholder="Modelo" class="w-full p-3 border rounded-xl" />
        <div>
          <label for="activo" class="flex items-center text-gray-600">Activo</label>
          <input v-model="nuevoCamion.activo" type="checkbox" class="w-[20px] h-[20px] mt-2 ml-2 border rounded-xl" />
        </div>

        <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">
          Registrar 🚚
        </button>
      </form>
    </div>
  </div>
</template>
