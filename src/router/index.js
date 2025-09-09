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
  { path: "/", component: () => import("../views/home/Home.vue") },
  { 
    path: "/user/:name", //definimos el path y los params ha recibir
    name: "User", //nombre a la ruta como un atajo
    component:  () => import("../views/user/user.vue"), //definimos el componente
    props: true // como definimos props true los parametros los pasa automaticamente como props
  } 
]

// Creación del router
const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem("auth") //esto busca en el localstorage la auth
  if (to.path !== "/" && !isAuth) next("/")
  else next()
})


export default router
