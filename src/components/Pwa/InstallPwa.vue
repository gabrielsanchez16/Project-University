<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal">
      <h2>📲 Instalar RutaLimpia</h2>

      <p v-if="isIOS">
        Para instalar la app en iPhone o iPad:
        <br /><br />
        1. Toca el botón <strong>Compartir</strong> (icono de flecha hacia arriba).  
        <br />
        2. Selecciona <strong>“Agregar a pantalla de inicio”</strong>.
      </p>

      <p v-else>
        Puedes instalar RutaLimpia en tu dispositivo para acceder más rápido
        y usarla como una app.
      </p>

      <div class="actions">
        <button v-if="deferredPrompt && !isIOS" @click="installPWA">
          Instalar
        </button>

        <button @click="closeModal">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      deferredPrompt: null,
      isIOS: false
    };
  },

  mounted() {
    // Detectar iOS
    const ua = window.navigator.userAgent.toLowerCase();
    this.isIOS =
      /iphone|ipad|ipod/.test(ua) && !window.MSStream;

    // Detectar si ya está instalada
    const isInStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isInStandalone) return; // No mostrar modal si ya está instalada

    // Android: capturar el evento beforeinstallprompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.show = true;
    });

    // iOS: no hay evento, así que mostramos modal siempre
    if (this.isIOS) {
      this.show = true;
    }
  },

  methods: {
    installPWA() {
      if (!this.deferredPrompt) return;

      this.deferredPrompt.prompt();

      this.deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          console.log("PWA instalada");
        }
        this.deferredPrompt = null;
        this.show = false;
      });
    },
    closeModal() {
      this.show = false;
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 85%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

button {
  padding: 10px 18px;
  border: none;
  background: #2E7D32;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
}
button:last-child {
  background: #777;
}
</style>
