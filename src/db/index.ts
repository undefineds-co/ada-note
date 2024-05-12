import { Kysely, PostgresDialect } from 'kysely'
import { Pool, types as pgTypes } from 'pg'
import { Database } from '~/types'

const dialect = new PostgresDialect({
  pool: new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 9432,
    database: process.env.DB_NAME ?? 'claynote',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD,
  }),
})

const int8TypeId = 20
// Map int8 to number.
pgTypes.setTypeParser(int8TypeId, val => {
  return parseInt(val, 10)
})

export const db = new Kysely<Database>({
  dialect,
  plugins: [],
})
