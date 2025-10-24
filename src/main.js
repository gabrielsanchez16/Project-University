import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from "pinia"
import router from './router'
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App)
app.use(createPinia()) // habilitar pinia
app.use(router) // habilitar router
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  transition: "Vue-Toastification__fade",
});
app.mount("#app");