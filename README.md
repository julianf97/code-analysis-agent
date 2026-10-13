# Code Analysis Agent — Backend NestJS

Base de API REST construida con **NestJS 11**, **TypeORM 1.x** y PostgreSQL. Usa el repositorio [notifications](https://github.com/julianf97/notifications) como referencia para organizar módulos, controladores y DTOs.

> **Estado:** esta rama implementa la arquitectura de NestJS y los endpoints de salud y repositorios. Todavía no existe el worker de análisis, la investigación de GitHub con el agente ni la generación de informes. La conversión requiere comprobar el build y el arranque local.

## Arquitectura

```text
src/
├── main.ts
├── app.module.ts
├── auth/
│   └── api-key.guard.ts
├── database/
│   └── database.module.ts
├── db/
│   ├── database.options.ts
│   ├── index.ts                  # DataSource exclusivo para migraciones CLI
│   └── migrations/
├── models/                      # 12 entidades TypeORM
└── modules/
    ├── health/
    │   ├── health.module.ts
    │   ├── health.controller.ts
    │   └── health.service.ts
    └── repositories/
        ├── dto/
        │   ├── create-repository.dto.ts
        │   └── repository-response.dto.ts
        ├── presenters/
        │   └── repositories.presenter.ts
        ├── repositories.module.ts
        ├── repositories.controller.ts
        ├── repositories.service.ts
        └── repositories.repository.ts
```

**Flujo:** Module registra dependencias → Controller recibe/valida → Service aplica las reglas → Repository encapsula TypeORM → PostgreSQL. Los DTOs usan `class-validator` y `class-transformer`, y los endpoints quedan documentados con `@nestjs/swagger`. No se importa `@nestjs/typeorm` en los services ni en los controllers.

La aplicación utiliza `TypeOrmModule.forRootAsync` y `TypeOrmModule.forFeature`, con `synchronize: false` para proteger la base de datos. Las migraciones antiguas se conservan. El archivo `src/db/index.ts` se utiliza **solo por scripts/migrate-db.js**; Nest gestiona su propio `DataSource`.

## Entorno local (sin Docker)

En `.env`, usá tu PostgreSQL local:

```dotenv
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=code_analysis
DB_USER=postgres
DB_PASSWORD=postgres
DB_SCHEMA=public
DB_TEST_SCHEMA=code_analysis_test
DB_USE_TEST_SCHEMA=false
ADMIN_API_KEY=una_clave_segura_de_al_menos_32_caracteres
GITHUB_TOKEN=tu_token_github_solo_lectura
OPENAI_API_KEY=tu_api_key_openai
```

Las demás variables de presupuesto y modelos permanecen en `.env.example`. No subas credenciales a GitHub.

```powershell
npm install
npm run check
npm test
npm run build
npm run db:migrate:status
npm run dev
```

Al cambiar dependencias, **ejecutá `npm install`** para actualizar tu `package-lock.json` local y luego versioná el lock actualizado. El lock anterior de la rama puede quedar desactualizado hasta esa instalación.

### Swagger

Una vez arrancada la API, entrá a:

- [Swagger UI](http://localhost:3000/docs) — documentación y pruebas de endpoints.
- [Health](http://localhost:3000/health) — proceso HTTP.
- [Dependencias](http://localhost:3000/health/dependencies) — conexión a PostgreSQL.

Endpoints disponibles:

| Método | Ruta | Autenticación |
|---|---|---|
| GET | /health | Pública |
| GET | /health/dependencies | Pública |
| GET | /api/repositories | Header `x-api-key` |
| GET | /api/repositories/:id | Header `x-api-key` |
| POST | /api/repositories | Header `x-api-key` |

Ejemplo para el registro en Swagger:

```json
{"owner": "julianf97", "name": "code-analysis-agent"}
```

En Swagger presioná **Authorize** y completá el valor de `ADMIN_API_KEY`.

**Compatibilidad:** los endpoints siguen devolviendo objetos con la propiedad `data` como hacía Express. La integración con GitHub todavía está pendiente: registrar un repositorio no verifica acceso remoto.

## Migraciones y datos

Las 12 tablas de la aplicación y `typeorm_migrations` se mantienen. No se realiza `synchronize`, no se borran registros ni se cambia el schema `public`. Podés inspeccionar todas las tablas desde DBeaver.

```powershell
npm run db:migrate:status
npm run db:migrate
```

La migración inicial no tiene rollback destructivo y sólo soporta `DB_SCHEMA=public`.

## Validación

```powershell
npm run check
npm test
npm run build
```

Estos comandos deben ejecutarse en tu máquina con las dependencias instaladas. La migración de NestJS se publicó en la rama, pero todavía no se verificó una ejecución completa de la aplicación contra tu PostgreSQL local.

El procesamiento asincrónico de análisis, los jobs, LangGraph, los presupuestos y los informes son etapas futuras.
