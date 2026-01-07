# Proyecto MERN (mínimo)

Trabajo en clase de sistemas visuales

[![CI](https://github.com/cuh512410339-design/Proyecto-MERN/actions/workflows/ci.yml/badge.svg)](https://github.com/cuh512410339-design/Proyecto-MERN/actions/workflows/ci.yml)

Estructura mínima con `server` (Express + TypeScript) y `client` (React + Vite + TypeScript).

## Quick start (Docker dev)

1. Copia `.env.example` a `.env` y ajusta variables si deseas
2. Levanta entorno de desarrollo:

   docker compose -f docker-compose.dev.yml up --build

3. Visita:
   - Client: http://localhost:5173
   - Server API: http://localhost:4000/api/health

## Scripts útiles

- Levantar en dev con Docker: `docker compose -f docker-compose.dev.yml up --build`
- Levantar en prod: `docker compose up --build`
- Seed DB (server): `npm --prefix server run seed` (usa variables `SEED_ADMIN_*` en `.env`)
- Tests (server): `npm --prefix server run test` (o `npm run test` desde la raíz)

## Tests

- Ejecutar tests localmente (server):
  - `npm --prefix server run test` o desde la raíz: `npm run test`
- Ejecutar tests en CI (GitHub Actions):
  - El pipeline corre tests automáticamente en push/PR y puede ejecutarse manualmente desde la pestaña **Actions** → seleccionar **CI** → **Run workflow** (o usar `workflow_dispatch`).
  - CLI (opcional): `gh workflow run ci.yml -f node-version=20.x`
- Ejecutar tests en watch (server):
  - `npm --prefix server run test:watch` o desde la raíz: `npm run test:watch`
- Ejecutar tests dentro de Docker:
  - `npm run test:docker` o `docker compose run --rm server npm test`
- Helper (PowerShell):
  - `.
run-tests.ps1 -Mode local` (o `-Mode docker` / `-Mode all`)

## Producción

docker compose up --build

