import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DataTypes, QueryTypes } from 'sequelize';
import { closeSequelize, getSequelize } from './sequelize.js';

type AppliedMigration = { version: string };

export async function runMigrations(): Promise<void> {
  const sequelize = getSequelize();
  const queryInterface = sequelize.getQueryInterface();

  await sequelize.authenticate();
  // El control de versiones es administrado por Sequelize, sin sync({ alter: true }).
  const tables = await queryInterface.showAllTables();
  if (!tables.includes('schema_migrations')) {
    await queryInterface.createTable('schema_migrations', {
      version: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
      applied_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  }

  const names = (await readdir(join(process.cwd(), 'migrations')))
    .filter(name => name.endsWith('.sql')).sort();
  for (const version of names) {
    await sequelize.transaction(async transaction => {
      // Evita la ejecución simultánea de la misma migración por distintas réplicas.
      await sequelize.query('SELECT pg_advisory_xact_lock(88004411)', { transaction });
      const applied = await sequelize.query<AppliedMigration>(
        'SELECT version FROM schema_migrations WHERE version = :version',
        { replacements: { version }, type: QueryTypes.SELECT, transaction },
      );
      if (applied.length) return;
      // El SQL DDL inicial se conserva para mantener compatibilidad con el esquema ya publicado.
      await sequelize.query(await readFile(join(process.cwd(), 'migrations', version), 'utf8'), { transaction });
      await queryInterface.bulkInsert('schema_migrations', [{
        version, applied_at: new Date(),
      }], { transaction });
      console.info('Migración aplicada:', version);
    });
  }
}

if (process.argv[1] && /(?:^|[/\\])migrate\.(ts|js)$/.test(process.argv[1])) {
  runMigrations()
    .catch(error => { console.error('Error de migraciones:', error); process.exitCode = 1; })
    .finally(() => closeSequelize());
}
