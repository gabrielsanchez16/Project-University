import { createRouter, createWebHistory } from "vue-router"

/*

📌 3. Explicación de cada parte
🔹 createRouter

Crea el enrutador de Vue.

🔹 createWebHistory

Le dice que use el History API del navegador (URLs limpias como /about/123).
Si usas createWebHashHistory, las rutas se verían como /#/about/123.

🔹 routes

Aquí definimos las rutas disponibles en la app

*/


// Definición de rutas

//Los imports dinamicos nos ayudan al lazy loading solo se cargaran cuando visiten las rutas y no desde el inicio esto mejorara la eficiencia y la carga de nuestra pagina

const routes = [
  { path: "/", component: () => import("../views/Auth/Auth.vue") },
  {
    path: "/",
    component: () => import("../Layout/Sidebar.vue"),
    children: [
      { path: "Dashboard", component: () => import("../views/Dashboard/Dashboard.vue") },
      { path: "Rutas", component: () => import("../views/Rutas/Rutas.vue") },
      { path: "Camiones", component: () => import("../views/Camiones/Camiones.vue") }
    ]
  }
  // { 
  //   path: "/user/:name", //definimos el path y los params ha recibir
  //   name: "User", //nombre a la ruta como un atajo
  //   component:  () => import("../views/user/user.vue"), //definimos el componente
  //   props: true // como definimos props true los parametros los pasa automaticamente como props
  // } 
]

// Creación del router
const router = createRouter({
  history: createWebHistory(),
  routes
})

function isTokenValid(token) {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const now = Date.now() / 1000;
    return decoded.exp && decoded.exp > now;
  } catch {
    return false;
  }
}



// 🔐 Middleware de autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("auth");

  // 🕒 Verificar si el token existe y es válido
  if (!token || !isTokenValid(token)) {
    localStorage.clear();
    if (to.path !== "/") return next("/");
    return next();
  }

  // 🚫 Si ya está autenticado e intenta ir al login
  if (token && to.path === "/") {
    return next("/Dashboard");
  }

  // ✅ En cualquier otro caso, permitir el acceso
  next();
});





export default router
