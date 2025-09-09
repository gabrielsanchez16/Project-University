<script setup>

// Aquí podrías traer los datos desde un store (Pinia) o props
import { useRoute } from "vue-router"

const route = useRoute()


//Aqui recibo el parametro que paso por prop ya que definimos en la ruta props true
defineProps({
    name:{type:String,required:true}
})

//recibiendo los querys

const username = route.query.username
const bio = route.query.bio
const avatar = route.query.avatar
const posts = route.query.posts
const followers = route.query.followers
const following = route.query.following



</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-purple-900 to-indigo-900 text-white p-6">
    
    <!-- Tarjeta futurista -->
    <div
      class="relative bg-gray-800/40 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md text-center overflow-hidden">

      <!-- Glow decorativo -->
      <div class="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/40 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/40 rounded-full blur-3xl"></div>

      <!-- Avatar -->
      <div class="relative w-28 h-28 mx-auto mb-4">
        <img :src="avatar" alt="Avatar"
          class="w-28 h-28 rounded-full border-4 border-purple-400 shadow-lg object-cover" />
      </div>

      <!-- Nombre y username -->
      <h1 class="text-2xl font-extrabold tracking-wide">{{ name }}</h1>
      <p class="text-purple-300 text-sm mb-3">{{ username }}</p>

      <!-- Bio -->
      <p class="text-gray-300 mb-6">{{ bio }}</p>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="flex flex-col">
          <span class="text-xl font-bold">{{ posts }}</span>
          <span class="text-sm text-gray-400">Posts</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-bold">{{ followers }}</span>
          <span class="text-sm text-gray-400">Followers</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-bold">{{ following }}</span>
          <span class="text-sm text-gray-400">Following</span>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-center gap-4">
        <button
          class="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-lg hover:scale-105 transition transform duration-300">
          Seguir
        </button>
        <button
          class="px-5 py-2 rounded-xl border border-purple-400 text-purple-300 font-semibold hover:bg-purple-400/20 transition">
          Mensaje
        </button>
        <router-link to="/" class="px-5 py-2 rounded-xl border border-purple-400 text-purple-300 font-semibold hover:bg-purple-400/20 transition">
            Atras
        </router-link>
      </div>
    </div>
  </div>
</template>


