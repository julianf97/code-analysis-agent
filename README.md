# Code Analysis Agent — Backend (desarrollo)

API REST en TypeScript para investigar repositorios. La rama contiene la base de Express, PostgreSQL y **TypeORM 1.x**, con los endpoints de registro de repositorios. **Todavía no implementa auditorías reales, workers, orquestación LangGraph ni informes.**

## Arquitectura

- `src/models/`: 12 clases TypeORM con `@Entity`, `@Column`, `@ManyToOne`, `@OneToMany` y `@OneToOne`.
- `src/db/index.ts`: `DataSource` PostgreSQL (driver `pg`), con las entidades y migraciones registradas.
- `src/db/repositories/`: consultas encapsuladas con `dataSource.getRepository(...)`.
- `src/db/migrations/`: migraciones TypeORM versionadas mediante `MigrationInterface`.
- `src/server/routes` → `controllers` → `services` → `db/repositories`.
- `src/agents`, `src/tools`, `src/prompts`: plantilla LangChain original conservada.

No se utiliza `synchronize: true`, `Sequelize`, `Umzug` ni consultas de aplicación mediante `pg.Pool`.

### Compatibilidad de migraciones

El SQL histórico `migrations/001_initial.sql` se conserva. La migración TypeORM inicial:

1. Comprueba que las 12 tablas originales ya existan; si están todas, **las adopta sin recrearlas**.
2. Si la base está vacía, crea las tablas originales ejecutando el DDL.
3. Si encuentra solamente algunas de las tablas, **se detiene** para evitar sobrescritura o pérdida de datos.
4. No permite un rollback destructivo.

Por ahora solo está soportado `DB_SCHEMA=public`. Para otros schemas se requiere una migración específica. Si tenés datos reales, hacé un backup antes de cambiar el ORM. La migración **no verifica todavía diferencias internas de columnas/índices de una base preexistente**.

## Instalación local (PowerShell)

```powershell
Copy-Item .env.example .env
# Editá los valores
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

La imagen ejecuta las migraciones con TypeORM antes de iniciar la API. Se mantiene PostgreSQL 15 y el volumen persistente.

### Endpoints actuales

- `GET /health`
- `GET /health/dependencies`
- `POST /api/repositories`
- `GET /api/repositories`
- `GET /api/repositories/:id`

Los endpoints `/api` requieren `x-api-key` con `ADMIN_API_KEY`; registrar un repositorio todavía no valida acceso real en GitHub.

### Estado de comprobación

La implementación se hizo directamente en GitHub. No fue posible descargar dependencias ni ejecutar `npm run check`, una base PostgreSQL o Docker en este entorno; por lo tanto el build y las migraciones reales siguen **sin verificar**. El archivo `package-lock.json` deberá generarse con `npm install` en un entorno con red y versionarse antes del despliegue.
