<script setup>
import { ref, onMounted } from "vue";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "vue-toastification";
import { useCounterStore } from "../../stores/counter";

const globalStore = useCounterStore();

const toast = useToast();

const mapContainer = ref(null);
let map;

const puntos = ref([]); // coordenadas actuales
const markers = ref([]); // objetos Marker de Mapbox
const geometry = ref({});
const distancia = ref(null);
const duracion = ref(null);
const loading = ref(false);

// Estado modal y nombre ruta
const modalOpen = ref(false);
const nombreRuta = ref("");

// Lista de rutas registradas
const rutasRegistradas = ref([]);

// Token de Mapbox
mapboxgl.accessToken =
    "pk.eyJ1IjoiZ2FzYW5jaGV6IiwiYSI6ImNtZzFtbjhzZzBwZ3AycnEyczF4dnpsOTkifQ.iMlhHXslPc5LTQeOKpL-rg";

onMounted(() => {
    map = new mapboxgl.Map({
        container: mapContainer.value,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-77.067, 3.88],
        zoom: 13,
    });

    // Click en el mapa => agregar punto
    map.on("click", (e) => {
        const coords = [e.lngLat.lng, e.lngLat.lat];
        puntos.value.push(coords);

        const marker = new mapboxgl.Marker({ color: "red" })
            .setLngLat(coords)
            .addTo(map);

        markers.value.push(marker);
    });

    obtenerRutas()
});

// 📌 Genera la  ruta
async function generarRuta() {
    if (puntos.value.length < 2) {
        toast.error("Por favor selecciona al menos 2 puntos en el mapa.");
        return;
    }

    loading.value = true;

    try {
        const coordsString = puntos.value.map((p) => p.join(",")).join(";");
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&overview=full&steps=false&access_token=${mapboxgl.accessToken}`;

        const res = await fetch(url);
        const data = await res.json();

        const route = data.routes[0].geometry;
        geometry.value = route;
        distancia.value = (data.routes[0].distance / 1000).toFixed(2);
        duracion.value = (data.routes[0].duration / 60).toFixed(1);
        duracion.value = (duracion.value * 6).toFixed(1);

        dibujarRuta(route);

        // Ajustar zoom
        const bounds = new mapboxgl.LngLatBounds();
        route.coordinates.forEach((coord) => bounds.extend(coord));
        map.fitBounds(bounds, { padding: 50 });
    } catch (err) {
        console.error("Error al generar ruta:", err);
        toast.error("Ocurrió un error al generar la ruta. Intenta nuevamente.");
    } finally {
        loading.value = false;
    }
}

// 📌 Dibuja la ruta en el mapa
function dibujarRuta(route) {
    if (map.getSource("route")) {
        map.getSource("route").setData({
            type: "Feature",
            geometry: route,
        });
    } else {
        map.addSource("route", {
            type: "geojson",
            data: {
                type: "Feature",
                geometry: route,
            },
        });

        map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": "#3b82f6",
                "line-width": 5,
            },
        });
    }
}

// 📌 Resetear todo
function resetearRuta() {
    puntos.value = [];
    distancia.value = null;
    duracion.value = null;
    nombreRuta.value = "";
    geometry.value = {};

    // Borrar markers
    markers.value.forEach((m) => m.remove());
    markers.value = [];

    // Borrar la ruta
    if (map.getLayer("route")) map.removeLayer("route");
    if (map.getSource("route")) map.removeSource("route");
}

// 📌 Registrar ruta
async function registrarRuta() {
    if (!nombreRuta.value.trim()) {
        toast.error("Por favor ingresa un nombre para la ruta.");
        return;
    }

    try {
        // Construir string de coordenadas para el request de Mapbox
        const coordsString = puntos.value.map((p) => p.join(",")).join(";");
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&overview=full&steps=false&access_token=${mapboxgl.accessToken}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.routes || !data.routes.length) {
            toast.error("No se pudo obtener la ruta desde Mapbox.");
            return;
        }

        const route = data.routes[0].geometry;

        // Sacar inicio y fin
        const inicio = puntos.value[0];
        const fin = puntos.value[puntos.value.length - 1];

        // // 📤 Construir payload con coordenadas
        const payload = {
            nombre_ruta: nombreRuta.value,
            perfil_id: globalStore.id,
            shape: geometry.value
        };


        // // 📡 Enviar a la API
        const response = await fetch("https://apirecoleccion.gonzaloandreslucio.com/api/rutas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error al registrar ruta:", errorData);
            toast.error("Error al registrar la ruta en el servidor.");
            return;
        }

        // Guardar localmente también
        obtenerRutas();

        toast.success(`Ruta registrada: ${nombreRuta.value} ✅`);
        modalOpen.value = false;
        nombreRuta.value = "";
        resetearRuta();
    } catch (error) {
        console.error("Error general:", error);
        toast.error("Ocurrió un error al registrar la ruta.");
    }
}

async function obtenerRutas() {
    try {
        const res = await fetch(
            `https://apirecoleccion.gonzaloandreslucio.com/api/rutas?perfil_id=${globalStore.id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            }
        );

        const data = await res.json();


        // Validar que existan rutas
        if (!data || !data.data.length) {
            toast.info("No hay rutas registradas.");
            return;
        }

        // Convertir shape de string a objeto
        rutasRegistradas.value = data?.data?.map((ruta) => ({
            id: ruta.id,
            nombre: ruta.nombre_ruta,
            route: JSON.parse(ruta.shape),    // ← AQUÍ está la clave
            inicio: JSON.parse(ruta.shape).coordinates[0][0],
            fin: JSON.parse(ruta.shape).coordinates[0].slice(-1)[0],
        }));

    
    } catch (error) {
        console.error("Error al obtener rutas:", error);
        toast.error("Ocurrió un error al obtener las rutas.");
    }
}



// 📌 Visualizar ruta registrada
function visualizarRuta(ruta) {
    dibujarRuta(ruta.route);

    const bounds = new mapboxgl.LngLatBounds();
    ruta.route.coordinates.forEach((coord) => bounds.extend(coord));
    map.fitBounds(bounds, { padding: 50 });
}

// 📌 Utilidad para formatear coords
function formatCoords(coords) {
    return `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`;
}
</script>

<template>
    <Toast />
    <div class="min-h-screen bg-gray-100 p-4 md:p-6">
        <h2 v-if="rutasRegistradas.length"
            class="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center md:text-left">
            🗺️ Lista de Rutas
        </h2>

        <div v-if="rutasRegistradas.length" class="mb-6 bg-white p-5 rounded-xl shadow-lg">
            <h2 class="text-xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
                📋 Rutas Registradas ({{ rutasRegistradas.length }})
            </h2>

            <!-- CONTENEDOR CON SCROLL -->
            <div class="max-h-80 overflow-y-auto pr-2 custom-scroll">
                <ul class="space-y-4">
                    <li v-for="(ruta, i) in rutasRegistradas" :key="i"
                        class="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all p-4 rounded-lg">

                        <div class="flex-1">
                            <p class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                🛣️ {{ ruta.nombre }}
                            </p>
                            <small class="text-gray-500 block mt-1">
                                📍 <strong>Inicio:</strong> {{ formatCoords(ruta.inicio) }} |
                                🎯 <strong>Fin:</strong> {{ formatCoords(ruta.fin) }}
                            </small>
                        </div>

                        <button @click="visualizarRuta(ruta)"
                            class="mt-3 md:mt-0 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 hover:shadow-md transition-all">
                            👁️ Visualizar
                        </button>
                    </li>
                </ul>
            </div>
        </div>


        <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center md:text-left">
            🗺️ Creador de Rutas
        </h2>

        <!-- Texto de instrucciones -->
        <p class="text-gray-700 mb-3 text-sm md:text-base text-center md:text-left">
            📌 Selecciona los puntos del mapa por donde quieres que pase la ruta.
            Se estimará la <b>distancia</b> y el <b>tiempo estimado</b>.
        </p>

        <!-- Controles -->
        <div class="flex flex-col sm:flex-row gap-3 mb-4">
            <button @click="generarRuta"
                class="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
                🚚 Generar Ruta
            </button>
            <button @click="resetearRuta"
                class="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition">
                ♻️ Resetear
            </button>
        </div>

        <!-- Datos + Botón Registrar -->
        <div v-if="distancia && duracion"
            class="mb-4 bg-white p-4 rounded-lg shadow text-center md:text-left space-y-2">
            <p class="text-gray-700">
                📏 Distancia: <b>{{ distancia }} km</b>
            </p>
            <p class="text-gray-700">
                ⏱️ Duración: <b>{{ duracion }} min</b>
            </p>

            <button @click="modalOpen = true"
                class="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
                ➕ Registrar Ruta
            </button>
        </div>

        <!-- Contenedor del mapa -->
        <div class="relative w-full h-[350px] md:h-[500px] rounded-xl shadow-md overflow-hidden">
            <div ref="mapContainer" class="w-full h-full"></div>

            <!-- Overlay de carga -->
            <div v-if="loading" class="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-10">
                <div
                    class="w-14 h-14 md:w-16 md:h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin">
                </div>
                <p class="mt-4 text-indigo-700 font-semibold animate-pulse text-sm md:text-base">
                    Calculando ruta...
                </p>
            </div>
        </div>

        <!-- Modal Registrar Ruta -->
        <div v-if="modalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6 relative">
                <h2 class="text-lg font-bold mb-4">Registrar Ruta</h2>

                <label class="block mb-2 text-sm font-medium text-gray-700">Nombre de la ruta</label>
                <input v-model="nombreRuta" type="text" placeholder="Ej: Ruta Sur Barrio X"
                    class="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring focus:ring-indigo-300" />

                <div class="flex justify-end gap-3">
                    <button @click="modalOpen = false"
                        class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
                        Cancelar
                    </button>
                    <button @click="registrarRuta"
                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Registrar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Scroll moderno */
.custom-scroll::-webkit-scrollbar {
    width: 8px;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background-color: rgba(99, 102, 241, 0.6);
    /* Indigo semi-transparente */
    border-radius: 4px;
}

.custom-scroll::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}
</style>
