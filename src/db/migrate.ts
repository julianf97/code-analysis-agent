import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getPool } from './pool.js';

export async function runMigrations(): Promise<void> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(88004411)');
    await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
    const directory = join(process.cwd(), 'migrations');
    const migrations = (await readdir(directory)).filter(name => name.endsWith('.sql')).sort();
    for (const version of migrations) {
      const exists = await client.query('SELECT 1 FROM schema_migrations WHERE version=$1', [version]);
      if (exists.rowCount) continue;
      await client.query(await readFile(join(directory, version), 'utf8'));
      await client.query('INSERT INTO schema_migrations(version) VALUES ($1)', [version]);
      console.info('Migración aplicada:', version);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

if (process.argv[1]?.endsWith('/migrate.ts')) {
  runMigrations().then(() => getPool().end()).catch(error => {
    console.error('Error de migraciones:', error);
    process.exitCode = 1;
  });
}
