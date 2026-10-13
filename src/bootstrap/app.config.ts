import { RequestMethod, type INestApplication } from '@nestjs/common';
import { createValidationPipe } from './validation.config.js';
import { configureSwagger } from './swagger.config.js';

// Centraliza la configuración compartida por todos los módulos de la API.
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: 'health/dependencies', method: RequestMethod.GET },
    ],
  });

  app.useGlobalPipes(createValidationPipe());

  configureSwagger(app);
  app.enableShutdownHooks();
}
