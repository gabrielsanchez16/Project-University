<script setup>
import { ref, onMounted } from "vue";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "vue-toastification";

const toast = useToast();

const mapContainer = ref(null);
let map;

const puntos = ref([]); // coordenadas actuales
const markers = ref([]); // objetos Marker de Mapbox
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
});

// 📌 Generar ruta
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

// 📌 Dibujar ruta en el mapa
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

    const coordsString = puntos.value.map((p) => p.join(",")).join(";");
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&overview=full&steps=false&access_token=${mapboxgl.accessToken}`;

    const res = await fetch(url);
    const data = await res.json();
    const route = data.routes[0].geometry;

    // Sacar inicio y fin
    const inicio = puntos.value[0];
    const fin = puntos.value[puntos.value.length - 1];

    rutasRegistradas.value.push({
        nombre: nombreRuta.value,
        distancia: distancia.value,
        duracion: duracion.value,
        route: route,
        inicio: inicio,
        fin: fin,
    });

    toast.success(`Ruta registrada: ${nombreRuta.value} ✅`);
    modalOpen.value = false;
    nombreRuta.value = "";
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
    <Toast/>
    <div class="min-h-screen bg-gray-100 p-4 md:p-6">
        <h2 v-if="rutasRegistradas.length"
            class="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center md:text-left">
            🗺️ Lista de Rutas
        </h2>

        <!-- Lista de rutas registradas -->
        <div v-if="rutasRegistradas.length" class="mb-6 bg-white p-4 rounded-lg shadow">
            <h2 class="text-lg font-bold mb-3">📋 Rutas Registradas</h2>
            <ul class="space-y-3">
                <li v-for="(ruta, i) in rutasRegistradas" :key="i"
                    class="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 p-3 rounded-lg">
                    <div>
                        <p class="font-semibold">{{ ruta.nombre }}</p>
                        <small class="text-gray-500 block">
                            Distancia: {{ ruta.distancia }} km | Tiempo: {{ ruta.duracion }} min
                        </small>
                        <small class="text-gray-400 block">
                            Inicio: {{ formatCoords(ruta.inicio) }} | Fin: {{ formatCoords(ruta.fin) }}
                        </small>
                    </div>
                    <button @click="visualizarRuta(ruta)"
                        class="mt-2 md:mt-0 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        👁️ Visualizar
                    </button>
                </li>
            </ul>
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
