<script setup>
import { ref } from 'vue'
// Si no tienes LoginForm / RegisterForm aún, puedes comentarlos o poner divs simples
 import LoginForm from '../../components/Auth/LoginForm.vue'
 import RegisterForm from '../../components/Auth/RegisterForm.vue'

const isLogin = ref(true)

function toggleForm() {
  isLogin.value = !isLogin.value
}
</script>

<template>
  <div class="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
    <!-- Fondo decorativo -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
    </div>

    <!-- Container principal -->
    <div class="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-18 items-center">
      <!-- Panel izquierdo - Información -->
      <div class=" space-y-6 text-center lg:text-left">
        <div class="space-y-4">
          <h1 class="text-4xl xl:text-5xl font-bold text-foreground">
            <span class="text-[#2B82F6]">Ruta</span>
            <span class="text-[#34D399]">Limpia</span>
          </h1>
          <p class="text-xl text-gray-400">
            Sistema de gestión de vehículos y rutas para el servicio de aseo urbano
          </p>
          <p class="text-lg text-gray-400">Buenaventura, Colombia</p>
        </div>

        <!-- Características -->
        <div class="space-y-4">
          <div class="flex flex-col gap-4 items-center lg:items-start">
            <div class="flex items-center space-x-3 text-left">
              <div class="w-10 h-10 bg-[#2b83f63a] rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-[#2B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-foreground">Gestión de Vehículos</h3>
                <p class="text-sm text-gray-400">Control completo de la flota de aseo</p>
              </div>
            </div>

            <div class="flex items-center space-x-3 text-left">
              <div class="w-10 h-10 bg-[#34d3993d] rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-foreground">Planificación de Rutas</h3>
                <p class="text-sm text-gray-400">Optimización de recorridos urbanos</p>
              </div>
            </div>

            <div class="flex items-center space-x-3 text-left">
              <div class="w-10 h-10 bg-[#2b83f63a] rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-[#2B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-foreground">Mapas Interactivos</h3>
                <p class="text-sm text-gray-400">Visualización en tiempo real</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel derecho - Formulario -->
      <div class="flex w-full items-center justify-center">
        <!-- Sustituye por tus componentes reales -->
        <div v-if="isLogin" class="space-y-4 w-full">
          <LoginForm v-model:isLogin="isLogin"/>
        </div>
        <div v-else class="space-y-4 w-full">
          <RegisterForm v-model:isLogin="isLogin"/>
        </div>
      </div>

      <!-- Información móvil -->
      <!-- <div class="lg:hidden absolute bottom-4 left-4 right-4 text-center">
        <p class="text-sm text-gray-400">
          <span class="font-semibold text-[#2B82F6]">RutaLimpia</span> -
          Gestión de aseo urbano para Buenaventura
        </p>
      </div> -->
    </div>
  </div>
</template>
