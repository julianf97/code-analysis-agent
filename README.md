# code-analysis-agent — plantilla básica LangChain

Proyecto base en **Node.js + TypeScript + LangChain + OpenAI**, basado en la arquitectura del repositorio [`agent-ts-langchain`](https://github.com/julianf97/agent-ts-langchain). Es una plantilla reutilizable, **no un agente de análisis de código terminado**.

## Arquitectura

```text
src/
  index.ts                     # Punto de entrada
  agents/agent.ts               # createAgent: modelo + tools + prompt
  config/agent.ts               # Tarea configurable
  config/model.ts               # Conexión al LLM
  config/cron.ts                # Configuración cron (opcional)
  prompts/agent.prompt.ts       # System prompt
  tools/index.ts                # Registro de tools
  tools/date.tool.ts            # Tool funcional de ejemplo
  jobs/agent.job.ts             # Invocación del agente y logs
  schedulers/agent.scheduler.ts # Ejecución programada (opcional)
  api/client.ts                 # Cliente HTTP reutilizable (sin uso por defecto)
  interfaces/                   # Contratos TypeScript
  validators/                   # Validadores
```

## Ejecutar en local (PowerShell)

Requiere **Node.js 22 o superior**, una API key de OpenAI con crédito y un modelo que admita tools.

```powershell
npm install
Copy-Item .env.example .env
# Editá .env con tu OPENAI_API_KEY
npm run dev
```

Por defecto ejecuta **una vez** la tarea definida en `AGENT_TASK`. También podés usar `npm run build` y `npm start`.

## Docker

```powershell
Copy-Item .env.example .env
# Editá .env
docker compose up --build
```

Para ejecución periódica, configurá `AGENT_CRON_ENABLED=true` y una expresión `AGENT_CRON` válida. En Docker, habilitar el cron permite mantener el proceso activo; con el cron desactivado, termina al ejecutar una vez. Detener: `docker compose down`.

## Cómo adaptarlo a tu caso

1. Escribí las instrucciones de tu agente en `src/prompts/agent.prompt.ts`.
2. Creá tools en `src/tools/` mediante `tool()` y esquemas Zod.
3. Registralas en `src/tools/index.ts`.
4. Si consumís una API, reutilizá `src/api/client.ts` y configurá `API_BASE_URL` y `API_TOKEN`.
5. Cambiá `AGENT_TASK` o el contenido de `src/jobs/agent.job.ts` para indicar qué debe hacer.
6. Elegí ejecución puntual o cron con `AGENT_CRON_ENABLED`.

**Flujo:** `index → job → createAppAgent → createModel + createAgentTools + prompt → agent.invoke → tool calls → respuesta`.

## Qué se conservó y qué se cambió

Se conservó el patrón original `agents / api / config / interfaces / jobs / prompts / schedulers / tools / validators`, con `createAgent`, `ChatOpenAI`, Zod, `node-cron`, `.env`, Docker y TS ESM. Se sustituyeron autenticación ERP, documentos, facturas y reglas de lotes por una tool autónoma de fecha y un cliente HTTP de ejemplo. Se eliminó la dependencia de la red Docker externa del ERP.

No subas `.env` ni claves al repositorio. Esta versión no incluye `package-lock.json`; generá el lock ejecutando `npm install` y commitealo para instalaciones reproducibles.
