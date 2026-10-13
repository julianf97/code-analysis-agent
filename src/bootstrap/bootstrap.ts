import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { loadEnvironment } from '../config/env.js';
import { configureApp } from './app.config.js';

// Inicializa NestJS, aplica la configuración general y levanta el servidor.
export async function bootstrap(): Promise<void> {
  const { PORT } = loadEnvironment();
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  await app.listen(PORT);
  console.info(`API NestJS lista en http://localhost:${PORT} (Swagger: /docs)`);
}
