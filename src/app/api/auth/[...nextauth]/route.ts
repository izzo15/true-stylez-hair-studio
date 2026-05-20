import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

export const revalidate = false

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }