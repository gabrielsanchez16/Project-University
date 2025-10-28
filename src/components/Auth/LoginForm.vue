<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Estado del formulario
const formData = reactive({
  correo: '',
  contraseña: ''
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref('');
const formErrors = reactive({});

const emit = defineEmits([ "update:isLogin" ]);

/** Validar campos */
function validateForm() {
  const errors = {};
  if (!formData.correo) {
    errors.correo = 'El correo es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
    errors.correo = 'El correo no es válido';
  }
  if (!formData.contraseña) {
    errors.contraseña = 'La contraseña es obligatoria';
  }
  Object.assign(formErrors, errors);
  return Object.keys(errors).length === 0;
}

/** Enviar formulario */
async function handleSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  error.value = '';
  loading.value = true;

  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: formData.correo, contraseña: formData.contraseña })
    });
    const data = await res.json();
    if (!res.ok) {
      error.value = data.error || 'Correo o contraseña incorrectos';
      loading.value = false;
      return;
    }

    // Guardar token y usuario
    localStorage.setItem('auth', data.token);
    localStorage.setItem('id', JSON.stringify(data.user.perfil_id));
    localStorage.setItem('user', JSON.stringify(data.user));

    // Emitir hacia padre para cambiar la vista y redirigir
    emit('update:isLogin', true);
    router.push('/Dashboard');
  } catch (err) {
    console.error(err);
    error.value = 'Error de conexión';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="h-fit flex items-center justify-center bg-gray-100 rounded-xl p-4">
    <div class="w-full bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl">
          🔑
        </div>
        <h1 class="text-2xl font-bold mb-1">Iniciar Sesión</h1>
        <p class="text-gray-500 mb-6">Ingresa a tu cuenta de <strong>RutaLimpia</strong></p>
      </div>

      <form @submit="handleSubmit" class="space-y-4">
        <!-- Correo -->
        <div>
          <label for="correo" class="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            id="correo"
            v-model="formData.correo"
            type="email"
            placeholder="ejemplo@correo.com"
            class="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 pl-3"
            :disabled="loading"
          />
          <p v-if="formErrors.correo" class="text-sm text-red-600 mt-1">{{ formErrors.correo }}</p>
        </div>

        <!-- Contraseña -->
        <div>
          <label for="contraseña" class="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <div class="relative">
            <input
              id="contraseña"
              v-model="formData.contraseña"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 pr-10"
              :disabled="loading"
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
          <p v-if="formErrors.contraseña" class="text-sm text-red-600 mt-1">
            {{ formErrors.contraseña }}
          </p>
        </div>

        <!-- Error global -->
        <div v-if="error" class="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
          {{ error }}
        </div>

        <!-- Botón -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 flex items-center justify-center"
        >
          <span v-if="loading" class="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <!-- Cambiar a registro -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          ¿No tienes una cuenta?
          <button  @click="emit('update:isLogin', false)" class="text-blue-600 hover:underline font-medium">Regístrate aquí</button>
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
