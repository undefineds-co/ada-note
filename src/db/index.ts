import { Kysely, PostgresDialect } from 'kysely'
import { Pool, types as pgTypes } from 'pg'
import { Database } from '~/types'

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
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
