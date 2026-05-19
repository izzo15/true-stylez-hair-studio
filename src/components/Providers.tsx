"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

type ProvidersProps = {
  children: ReactNode
  session?: any
}

export default function Providers({ children, session }: ProvidersProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}