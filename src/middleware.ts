import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  if (path.startsWith('/admin') && path !== '/admin') {
    const token = request.cookies.get('next-auth.session-token')
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}