import pg from 'pg';
import { loadEnvironment } from '../config/env.js';

const { Pool } = pg;
let pool: pg.Pool | undefined;

export function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({ connectionString: loadEnvironment().DATABASE_URL, max: 10 });
    pool.on('error', error => console.error('Error de conexión PostgreSQL:', error.message));
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) await pool.end();
  pool = undefined;
}
