import { BadRequestException, ValidationPipe } from '@nestjs/common';

// Valida y transforma los DTOs de todos los endpoints.
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
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
  });
}
