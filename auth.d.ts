import 'next-auth'

declare module 'next-auth' {
  interface User {
    userId: number
    name?: string
    email: string
    role: 'admin' | 'user'
  }
}
