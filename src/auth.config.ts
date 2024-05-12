import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  trustHost: true,
  providers: [],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.userId = Number(token.uid)
      }
      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.userId
      }
      return token
    },
  },
} satisfies NextAuthConfig
