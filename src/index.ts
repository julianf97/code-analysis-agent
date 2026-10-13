import 'dotenv/config';
import { createApp } from './server/app.js';
import { loadEnvironment } from './config/env.js';
import { initializeDatabase, sequelize } from './db/index.js';

async function main(): Promise<void> {
  const config = loadEnvironment();
  await initializeDatabase();

  const server = createApp().listen(config.PORT, () => {
    console.info('Code Analysis API escuchando en puerto ' + config.PORT);
  });

  async function shutdown() {
    server.close();
    await sequelize.close();
  }
  process.once('SIGINT', () => { shutdown().catch(console.error); });
  process.once('SIGTERM', () => { shutdown().catch(console.error); });
}

main().catch(error => {
  console.error('No se pudo iniciar la API:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
