import { auth } from '~/auth'
import { db } from '../db'

export const mustAuth = async () => {
  const session = await auth()
  if (!session || !session.user) {
    throw new Error('User not authenticated.')
  }
  return session.user
}

export const checkOwner = async (table: 'thread' | 'topic', id: number) => {
  const session = await mustAuth()
  const object = await db.selectFrom(table).selectAll().where('id', '=', id).executeTakeFirst()
  if (object?.user_id !== session.userId) {
    throw new Error('Unauthorized')
  }
  return object
}
