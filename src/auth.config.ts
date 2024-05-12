import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/auth/signin',
  },
  session: { strategy: 'jwt' },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log('auth', auth)
      const isLoggedIn = !!auth?.user
      const { pathname, searchParams } = nextUrl
      const callbackUrl = searchParams.get('callbackUrl') ?? '/journal'
      if (pathname === '/auth/signin') {
        if (isLoggedIn) {
          return Response.redirect(new URL(callbackUrl, nextUrl))
        }
        return true
      }
      return isLoggedIn
    },

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
