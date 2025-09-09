<script setup>

/*

📌 3. Ciclo de Vida y Hooks

Principales en Vue 3 (Composition API):

onMounted → al montar

onUpdated → al actualizar

onUnmounted → al destruir

onBeforeMount, onBeforeUpdate, etc.

*/

import { useCounterStore } from '../stores/counter'
import { onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
// Definimos las props que recibimos pero esto no es un tipado fuerte, porque el compilador no va ha parar la ejecucion se va a mostrar un mensaje en la consola
// Para un tipado fuerte se recomienda usar TypeScript


defineProps({
  msg: { type: String, required: true },
  count: { type: Number, required: true }
})

const countGlobal = useCounterStore()

const emit = defineEmits(["enviar", "update:count"])


const profile = () => {
  router.push({
    name: "User",
    params: { name: "Gabriel Sanchez" }, //Para datos simples y planos
    query: { // Para informacion mas estructura y organizada
      username: "@gabrielsz",
      bio: "Desarrollador fullstack 🚀 | Apasionado por Vue y la innovación",
      avatar: "https://i.pravatar.cc/150?img=13",
      posts: 128,
      followers: 980,
      following: 350
    }
  })
}



onMounted(() => {
  console.log("Componente montado")
})


</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-purple-900 to-indigo-900 text-white p-6">
    <!-- Tarjeta futurista -->
    <div
      class="relative bg-gray-800/40 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-lg text-center overflow-hidden">

      <!-- Glow decorativo -->
      <div class="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/40 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/40 rounded-full blur-3xl"></div>

      <h1 class="text-4xl font-extrabold tracking-wide mb-6">
        {{ msg }}
      </h1>

      <p class="text-gray-300 mb-8">
        Un pequeño proyecto con <span class="font-semibold text-purple-300">Vue 3 + Vite</span> 🚀
      </p>

      <button @click="emit('update:count', count + 1)" class="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 
         text-white font-bold shadow-lg hover:scale-110 hover:shadow-purple-500/50 
         transition transform duration-300 relative overflow-hidden group">
        <span
          class="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition"></span>
        <span class="relative">Contador: {{ count }}</span>
      </button>
      <div class="mt-8 bg-gray-900/40 border border-white/10 rounded-2xl p-4 shadow-inner">
        <p class="text-lg font-semibold text-purple-300">Contador Global: <span class="text-white">{{ countGlobal.count
            }}</span></p>
        <p class="text-sm text-gray-400">Doble: {{ countGlobal.double }}</p>
        <button @click="countGlobal.increment"
          class="mt-4 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition">
          Incrementar Global
        </button>
      </div>

      <button @click="$emit('enviar', 'Hola soy el hijo')" class="block mt-6 px-6 py-3 rounded-xl border border-purple-400 text-purple-300 
         font-semibold hover:bg-purple-400/20 transition">
        Comunicarme con el padre
      </button>

      <button @click="profile" class="block mt-6 px-6 py-3 rounded-xl border border-purple-400 text-purple-300 
         font-semibold hover:bg-purple-400/20 transition">
        Ir al perfil
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

h1 {
  letter-spacing: 0.05em;
  text-shadow: 0 0 15px rgba(168, 85, 247, 0.6);
}

button {
  transition: all 0.3s ease;
}
</style>
