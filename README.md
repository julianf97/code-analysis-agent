# Code Analysis Agent — Backend (en desarrollo)

Base de una API REST para investigar repositorios GitHub usando Node.js, TypeScript, Express, Sequelize, PostgreSQL y LangChain. **La auditoría autónoma, LangGraph, workers, comparación de ramas y generación de informes todavía no están implementados.**

## Arquitectura

Se conserva la plantilla inicial de `agents/`, `tools/`, `prompts/`, `config/` y `validators/`. Se agregaron capas diferenciadas:

- `src/server/`: routes → controllers → services.
- `src/db/repositories/`: consultas CRUD encapsuladas con Sequelize.
- `src/db/models/`: modelos y relaciones del esquema en Sequelize.
- `src/db/sequelize.ts`: conexión y pool del ORM mediante el driver `pg`.
- `src/db/migrate.ts`: ejecución versionada de migraciones con Sequelize.
- `migrations/001_initial.sql`: DDL inicial, conservado para compatibilidad con la versión anterior.

**No usamos `sync({ force: true })` ni `sync({ alter: true })`.** Las restricciones e índices se mantienen en la migración SQL inicial; el acceso cotidiano a datos usa modelos y repositorios Sequelize.

## Configuración

Requiere Node.js >=22, PostgreSQL 15 y credenciales válidas. Copiá `.env.example` a `.env` y establecé al menos `ADMIN_API_KEY`, `GITHUB_TOKEN` y `OPENAI_API_KEY`. No subas el archivo `.env`.

### Ejecutar en local (PowerShell)

```powershell
Copy-Item .env.example .env
# Editá .env; si usás la DB del compose, DATABASE_URL apunta a localhost:5433
npm install
npm run check
npm run migrate
npm run dev
```

### Docker

```powershell
Copy-Item .env.example .env
# Editá .env
docker compose up -d --build
docker compose logs -f api
docker compose down
```

El contenedor de API ejecuta migraciones antes de iniciar el servidor. PostgreSQL conserva los datos en un volumen. El servicio worker se incorporará cuando exista el procesamiento de jobs.

### Endpoints disponibles (base inicial)

- `GET /health` — estado del proceso.
- `GET /health/dependencies` — comprueba conexión Sequelize/PostgreSQL.
- `POST /api/repositories` — registra el nombre y dueño de un repo GitHub en PostgreSQL.
- `GET /api/repositories` — lista repos registrados.
- `GET /api/repositories/:id` — obtiene un repo registrado.

Los endpoints bajo `/api` requieren el header `x-api-key` con el valor de `ADMIN_API_KEY`. Por ahora registrar un repositorio **no verifica el acceso a GitHub**; la integración con el provider está pendiente.

Ejemplo:

```powershell
$headers = @{ 'x-api-key' = 'el_valor_de_ADMIN_API_KEY' }
$body = @{ owner = 'julianf97'; name = 'code-analysis-agent' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/api/repositories' -Headers $headers -ContentType 'application/json' -Body $body
```

## Estado real

Es una entrega incremental. No hay suite de tests todavía; no se comprobó el build contra dependencias descargadas ni el arranque Docker. El lockfile heredado se eliminó para evitar inconsistencias tras cambiar dependencias: ejecutá `npm install` para generar uno nuevo y versionarlo antes de desplegar en producción.
