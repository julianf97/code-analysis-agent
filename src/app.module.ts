import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { loadEnvironment } from './config/env.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { RepositoriesModule } from './modules/repositories/repositories.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: loadEnvironment,
    }),
    DatabaseModule,
    HealthModule,
    RepositoriesModule,
  ],
})
export class AppModule {}
