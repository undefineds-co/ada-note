import { auth } from '~/auth'

export const mustAuth = async () => {
  const session = await auth()
  if (!session || !session.user) {
    throw new Error('User not authenticated.')
  }
  return session.user
}
