import 'dotenv/config';
import 'reflect-metadata';
import { createApp } from './server/app.js';
import { loadEnvironment } from './config/env.js';
import { initializeDatabase, closeDatabase } from './db/index.js';

async function main(): Promise<void> {
  const config = loadEnvironment();
  await initializeDatabase();

  const server = createApp().listen(config.PORT, () => {
    console.info('Code Analysis API escuchando en puerto ' + config.PORT);
  });

  const shutdown = () => {
    server.close(() => {
      closeDatabase().catch(console.error);
    });
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

main().catch(error => {
  console.error('No se pudo iniciar la API:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
