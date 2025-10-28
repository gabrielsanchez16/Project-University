import { defineStore } from "pinia"

export const useCounterStore = defineStore("counter", { // nombre del hook
  state: () => ({
    count: 0 ,// estado inicial podemos definir mas estados
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    id: localStorage.getItem('id') ? localStorage.getItem('id').replace(/"/g, '') : null
  }),
  getters: {
    double: (state) => state.count * 2 // cada que se edite count, se recalcula double
  },
  actions: {
    increment() { //La accion que modifica al estado podemos llamarla desde cualquier componente y podemos declarar mas acciones
      this.count++
    }
  }
})
