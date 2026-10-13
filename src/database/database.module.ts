import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loadEnvironment } from '../config/env.js';
import { createDatabaseOptions } from '../db/database.options.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...createDatabaseOptions(loadEnvironment()),
        autoLoadEntities: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
