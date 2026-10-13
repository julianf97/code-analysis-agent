import 'dotenv/config';
import 'reflect-metadata';
import { BadRequestException, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { loadEnvironment } from './config/env.js';

async function bootstrap(): Promise<void> {
  const config = loadEnvironment();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: 'health/dependencies', method: RequestMethod.GET },
    ],
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: false },
    exceptionFactory: errors => new BadRequestException({
      error: {
        code: 'VALIDATION_ERROR',
        details: errors.map(error => ({
          property: error.property,
          messages: Object.values(error.constraints ?? {}),
        })),
      },
    }),
  }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Code Analysis Agent API')
    .setDescription('API para registrar repositorios y gestionar análisis de código.')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'admin-api-key')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  app.enableShutdownHooks();
  await app.listen(config.PORT);
  console.info(`API NestJS lista en http://localhost:${config.PORT} (Swagger: /docs)`);
}

bootstrap().catch(error => {
  console.error('No se pudo iniciar la API:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
