
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const rid = url.searchParams.get('ref')
  if (rid) {
    const res = NextResponse.next()
    res.cookies.set('aff_ref', rid, { path: '/', maxAge: 60*60*24*30 })
    res.cookies.set('aff_disc', '0.05', { path: '/', maxAge: 60*60*24*30 })
    url.searchParams.delete('ref')
    res.headers.set('x-middleware-rewrite', url.toString())
    return res
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)'],
}
