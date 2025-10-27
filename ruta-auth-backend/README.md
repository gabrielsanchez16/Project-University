# ruta-auth-backend

Backend de autenticación para RutaLimpia (Express + Prisma + MariaDB)

## Pasos rápidos

1. Copia `.env.example` a `.env` y ajusta `DATABASE_URL` (por ejemplo `mysql://root:1720@127.0.0.1:3306/rutalimpia_db`)
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Genera Prisma y ejecuta migración:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
   Si Prisma te pide una shadow DB, crea una base `rutalimpia_shadow` y añade `SHADOW_DATABASE_URL` en `.env`.
4. Levanta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
5. En tu proyecto Vue, crea `.env` con `VITE_API_URL=http://localhost:3000` y reinicia Vite.

## Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me  (requiere header `Authorization: Bearer <token>`)
