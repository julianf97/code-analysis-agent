import 'dotenv/config';
import { Umzug, SequelizeStorage } from 'umzug';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const command = process.argv[2] ?? 'up';
const { sequelize } = await import('../dist/db/index.js');
const { loadEnvironment } = await import('../dist/config/env.js');
const { QueryTypes } = await import('sequelize');
const config = loadEnvironment();
const schema = config.DB_USE_TEST_SCHEMA === 'true' ? config.DB_TEST_SCHEMA : config.DB_SCHEMA;
if (config.DB_USE_TEST_SCHEMA === 'true' && config.DB_TEST_SCHEMA === config.DB_SCHEMA) {
  throw new Error('DB_TEST_SCHEMA debe ser diferente de DB_SCHEMA.');
}
const quoted = sequelize.getQueryInterface().queryGenerator.quoteIdentifier(schema);

const migrator = new Umzug({
  migrations: {
    glob: ['*.js', { cwd: fileURLToPath(new URL('../migrations/', import.meta.url)) }],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeMeta', schema }),
  logger: console,
});

try {
  await sequelize.authenticate();
  await sequelize.query(`CREATE SCHEMA IF NOT EXISTS ${quoted}`);

  // La versión previa ya ejecutaba 001_initial.sql; respetamos esos datos.
  const existing = await sequelize.query(
    'SELECT table_name FROM information_schema.tables WHERE table_schema = :schema',
    { replacements: { schema }, type: QueryTypes.SELECT },
  );
  const tableNames = new Set(existing.map(row => row.table_name));
  if (tableNames.has('schema_migrations') && tableNames.has('repositories')) {
    const versions = await sequelize.query(
      `SELECT version FROM ${quoted}.schema_migrations`,
      { type: QueryTypes.SELECT },
    );
    if (versions.some(row => row.version === '001_initial.sql')) {
      const migrations = await migrator.executed();
      if (!migrations.some(m => m.name === '202610130001-initial.js')) {
        const storage = migrator.storage;
        await storage.logMigration({ name: '202610130001-initial.js' });
      }
    }
  }

  if (command === 'up') await migrator.up();
  else if (command === 'down') await migrator.down();
  else if (command === 'status') console.log({
    executed: await migrator.executed(),
    pending: await migrator.pending(),
  });
  else throw new Error('Comando inválido: usá up, down o status.');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
