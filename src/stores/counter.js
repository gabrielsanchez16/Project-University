import { defineStore } from "pinia"

export const useCounterStore = defineStore("counter", { // nombre del hook
  state: () => ({
    count: 0 // estado inicial podemos definir mas estados
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
