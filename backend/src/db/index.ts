import type { DB } from './db.d';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'pwd',
    port: Number(process.env.DB_PORT) || 5432,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
