import { NextRequest, NextResponse } from 'next/server'

const REALM = 'APEx Policies'

function unauthorizedResponse() {
  return new NextResponse('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
    },
  })
}

export function middleware(request: NextRequest) {
  const username = process.env.BASIC_AUTH_USER
  const password = process.env.BASIC_AUTH_PASS

  if (!username || !password) {
    // Skip auth when credentials are not configured
    return NextResponse.next()
  }

  const authorization = request.headers.get('authorization')
  if (authorization) {
    const [scheme, encoded] = authorization.split(' ')
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded)
      const [providedUser, ...rest] = decoded.split(':')
      const providedPass = rest.join(':')
      if (providedUser === username && providedPass === password) {
        return NextResponse.next()
      }
    }
  }

  return unauthorizedResponse()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
