## 🗺️ RutaLimpia

### Sistema de gestión de rutas y administración de vehículos para camiones de basura en la ciudad de Buenaventura.

 - RutaLimpia es una aplicación web diseñada para optimizar y administrar las rutas de recolección de residuos, así como los vehículos asignados a cada una. El sistema permite a los usuarios autorizados visualizar, crear y gestionar rutas mediante mapas interactivos, además de administrar la flota de camiones disponibles.

 - Este proyecto está construido con Vue.js en el frontend y Node.js + Express en el backend. Para la visualización geográfica se utiliza Mapbox, permitiendo trabajar con mapas dinámicos para la creación y edición de rutas.

---

## 🚀 Características principales

### 🗺️ Gestión de rutas

 - Creación y edición de rutas mediante Mapbox.

 - Visualización de rutas existentes en tiempo real.

 - Asignación de camiones o vehículos a rutas específicas.

### 🚛 Administración de vehículos

 - Listado de camiones con su información relevante.

 - Estado de cada vehículo (activo, en mantenimiento, asignado, etc.).

 - Asignación a rutas según disponibilidad.

### 🔐 Autenticación de usuarios

 - Registro y login de usuarios mediante API REST creada con Express.

 - Acceso restringido a rutas según credenciales.

 - Control de roles (si lo implementas): administrador, operador, supervisor, etc.

### 🌎 Integración con Mapbox

 - Mapas interactivos.

 - Selección de coordenadas para construir rutas.

 - Visualización amigable y moderna.


---

## 🛠️ Tecnologías utilizadas

### Frontend

 - Vue.js (composition API o options API)

 - Vue Router

 - Axios

 - Mapbox GL JS

 - TailwindCSS / CSS (si aplica)

 -Implementacion de PWA

### Backend

 - Node.js

 - Express.js

 - JWT para autenticación (si lo incluiste)

 - bcrypt para encriptación de contraseñas

 - Base de datos (MongoDB, MySQL o la que uses) — puedes añadirla aquí

 -Implementacion Mailtrap para notificaciones por correo para el mantenimiento de los vehiculos


---

## 📦 Instalación y configuración

### 🔧 Requisitos previos

 - Asegúrate de tener instalado:

 - Node.js v14+

 - NPM o Yarn

 - Acceso a un token de Mapbox

 - Base de datos configurada

## 🖥️ Instalación del backend
```bash
cd ruta-auth-backend
npm install
```

### ⚙️ Variables de entorno

### Crea un archivo .env con:

```bash
PORT=8000
DATABASE_URL="mysql://u7062123429_gabodev3:UniversityProyect2@srv1894.hstgr.io:3306/u706568429_university"
SHADOW_DATABASE_URL="mysql://u1111568429_gabodev4:UniversityProyect2@srv1894.hstgr.io:3306/u706568429_shadow_base"
```

### ▶️ Ejecutar backend
```bash
npm run dev
```

### 🌐 Instalación del frontend

```bash
npm install
```

### ▶️ Ejecutar frontend

```bash
npm run dev
```

---

## 🧩 Funcionalidades futuras (opcional)

 - Dashboard con estadísticas de recolección.

 - Integración con GPS en tiempo real.

---

## 📄 Licencia

 - Este proyecto puede funcionar con una licencia MIT o cualquier otra que prefieras.

## 👨‍💻 Autores

 - Gabriel Sanchez.

 - Jhan Carlos Zamora.

 - David Ruiz Caicedo.

 -Jhon Neiver Valencia.