import 'dotenv/config';
import 'reflect-metadata';
import { bootstrap } from './bootstrap/bootstrap.js';

bootstrap().catch(error => {
  console.error('No se pudo iniciar la API:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
