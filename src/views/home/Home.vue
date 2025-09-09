<script setup>
import HelloWorld from '../../components/HelloWorld.vue'
import { ref } from 'vue'

const count = ref(0)
function recibirMensaje(data) {
  console.log("El hijo sumo mediante evento:", data)
  count.value++
}

</script>

<template>
  <HelloWorld msg="Vite + Vue" @enviar="recibirMensaje" v-model:count="count"/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
