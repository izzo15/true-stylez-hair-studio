import CredentialsProvider from 'next-auth/providers/credentials'
import type { AuthOptions } from 'next-auth'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const creds = credentials as { email?: unknown; password?: unknown } | undefined
        if (
          typeof creds?.email === 'string' &&
          typeof creds?.password === 'string' &&
          creds.email === process.env.ADMIN_EMAIL &&
          creds.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: '1', name: 'Admin', email: creds.email }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/admin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
  },
}