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

## TypeScript y tests

El archivo `tsconfig.json` compila únicamente `src/` para mantener el entrypoint `dist/index.js`. Los tests tienen su propio `tests/tsconfig.json`, que hereda `types: ["node"]`, los decoradores TypeORM y las demás opciones.

```powershell
npm install
npm run check
npm run check:tests
npm test
npm run build
```

`npm run check` revisa **el backend y los tests** sin generar archivos; `npm run check:tests` comprueba únicamente los tests. `npm test` los ejecuta.

Si VS Code sigue mostrando errores en `node:test` o `node:assert/strict` después de instalar dependencias, ejecutá **TypeScript: Restart TS Server** desde la paleta de comandos (Ctrl+Shift+P) y comprobá que el editor está abierto en la carpeta raíz del proyecto.

## Compatibilidad de migraciones

El SQL histórico `migrations/001_initial.sql` se conserva. La migración TypeORM inicial:

1. Comprueba que las 12 tablas originales ya existan; si están todas, las adopta sin recrearlas.
2. Si la base está vacía, crea las tablas originales ejecutando el DDL.
3. Si encuentra solamente algunas de las tablas, se detiene para evitar sobrescritura o pérdida de datos.
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

Las correcciones se publican directamente en GitHub. El proyecto debe compilarse y probarse localmente con `npm run check` y `npm test` porque no hay dependencias descargadas en este entorno. El archivo `package-lock.json` deberá generarse con `npm install` y versionarse antes del despliegue.
