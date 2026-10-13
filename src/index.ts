import 'dotenv/config';
import { createApp } from './server/app.js';
import { loadEnvironment } from './config/env.js';
import { runMigrations } from './db/migrate.js';
import { closePool } from './db/pool.js';

async function main(): Promise<void> {
  const config = loadEnvironment();
  await runMigrations();
  const server = createApp().listen(config.PORT, () => {
    console.info('Code Analysis API escuchando en puerto ' + config.PORT);
  });
  const shutdown = () => server.close(() => {
    closePool().catch(console.error);
  });
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch(error => {
  console.error('No se pudo iniciar la API:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
