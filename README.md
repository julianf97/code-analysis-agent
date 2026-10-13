# Code Analysis Agent — backend en desarrollo

API REST de análisis de repositorios. Esta rama contiene **solo la base de infraestructura y el registro de repositorios**; no implementa aún auditorías reales, workers, LangGraph ni informes.

## Persistencia: estilo api-agente

La persistencia replica la convención de [api-agente](https://github.com/julianf97/api-agente/tree/main):

- `src/db/index.ts` exporta una única instancia `sequelize`, con `new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {...})` y driver `pg`.
- Cada modelo en `src/models/<entidad>.ts` utiliza `sequelize.define` y `DataTypes` explícitos.
- `src/models/associations.ts` declara `hasMany`, `hasOne` y `belongsTo`.
- `src/models/index.ts` importa modelos, registra asociaciones y exporta modelos.
- `src/db/repositories/` contiene funciones sencillas como `findRepositoryById`, `findRepositories` y `createRepository`.
- `scripts/migrate-db.js` utiliza Umzug y `SequelizeStorage` con migraciones versionadas `up/down`.
- Se conserva `migrations/001_initial.sql` por compatibilidad con la primera versión publicada. La migración inicial no ofrece reversión destructiva.

Las propiedades camelCase de TypeScript utilizan `field` cuando la columna histórica tiene snake_case. No se ejecuta `sequelize.sync()`.

**Limitación:** por compatibilidad con el SQL histórico, la primera migración solo admite `DB_SCHEMA=public`. No utilizar otros schemas hasta contar con una migración explícita. Este código no fue probado con PostgreSQL.

## Desarrollo local (PowerShell)

```powershell
Copy-Item .env.example .env
# Editá .env con credenciales
npm install
npm run check
docker compose up -d db
npm run db:migrate
npm run dev
```

### Docker

```powershell
docker compose up -d --build
docker compose logs -f api
docker compose down
```

### Migraciones

```powershell
npm run db:migrate
npm run db:migrate:status
```

`db:migrate:undo` está disponible, pero la migración inicial bloquea borrados automáticos por seguridad.

### Endpoints

- `GET /health`
- `GET /health/dependencies`
- `POST /api/repositories`
- `GET /api/repositories`
- `GET /api/repositories/:id`

Los endpoints de `/api` requieren el header `x-api-key` con la variable `ADMIN_API_KEY`. Registrar repositorios solo los guarda en la BD, sin comprobar todavía GitHub.

### Estado de verificación

No se ejecutó `npm install`, `npm run build`, migraciones ni Docker en esta entrega. Es una rama de trabajo, no un backend terminado.
