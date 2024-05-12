import { Kysely, PostgresDialect } from 'kysely'
import { Pool, types as pgTypes } from 'pg'
import { Database } from '~/types'
import { WithUserPlugin } from './with-user-plugin'

const dialect = new PostgresDialect({
  pool: new Pool({
    host: '101.36.125.228',
    port: 9432,
    database: 'claynote',
    user: 'postgres',
    password: '!KxEKpczy6ohPf',
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
