<script setup>
import { ref } from 'vue'

const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')
const form = ref({
  nombre: '',
  apellido: '',
  correo: '',
  contraseña: '',
  perfil_id: '',
})

const emit = defineEmits([ "update:isLogin"])

function handleSubmit(e) {
  e.preventDefault()
  isLoading.value = true
  error.value = ''

  // Simulación de envío
  setTimeout(() => {
    isLoading.value = false
    console.log('Datos enviados:', form.value)
    alert('Cuenta creada con éxito 🎉')
  }, 1200)
}
</script>

<template>
  <div class="h-fit flex items-center justify-center rounded-xl bg-gray-100 p-4">
    <div class="w-full bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      <h1 class="text-2xl font-bold text-center mb-2">Crear Cuenta</h1>
      <p class="text-gray-500 text-center mb-6">Únete al sistema de gestión <strong>RutaLimpia</strong></p>

      <form @submit="handleSubmit" class="space-y-4">
        <!-- Nombre y apellido -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              id="nombre"
              v-model="form.nombre"
              type="text"
              placeholder="Juan"
              class="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
            />
          </div>
          <div>
            <label for="apellido" class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input
              id="apellido"
              v-model="form.apellido"
              type="text"
              placeholder="Pérez"
              class="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
            />
          </div>
        </div>

        <!-- Correo -->
        <div>
          <label for="correo" class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
          <input
            id="correo"
            v-model="form.correo"
            type="email"
            placeholder="ejemplo@correo.com"
            class="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
          />
        </div>

        <!-- Contraseña -->
        <div>
          <label for="contraseña" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <div class="relative">
            <input
              id="contraseña"
              v-model="form.contraseña"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 pr-10"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <span v-if="showPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>
        </div>

        <!-- Perfil ID -->
        <div>
          <label for="perfil_id" class="block text-sm font-medium text-gray-700 mb-1">ID de Perfil</label>
          <input
            id="perfil_id"
            v-model="form.perfil_id"
            type="text"
            placeholder="a1b2c3d4-e5f6..."
            class="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
          />
          <p class="text-xs text-gray-500 mt-1">Este ID será usado para identificar tus vehículos y rutas</p>
        </div>

        <!-- Error -->
        <div v-if="error" class="p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-md">
          {{ error }}
        </div>

        <!-- Botón -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 flex items-center justify-center"
        >
          <span v-if="isLoading" class="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
          {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          ¿Ya tienes una cuenta?
          <button @click="emit('update:isLogin', true)" class="text-blue-600 hover:underline font-medium">Inicia sesión aquí</button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}
</style>
