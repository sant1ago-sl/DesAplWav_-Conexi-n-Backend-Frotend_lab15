import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_PATHS = ['/login', '/register'];
const ADMIN_PATHS = ['/admin'];

interface SessionPayload {
  id: number;
  role: 'CUSTOMER' | 'ADMIN';
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session')?.value;

  let payload: SessionPayload | null = null;
  if (token) {
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as SessionPayload;
    } catch {
      payload = null;
    }
  }

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (!payload && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (payload && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (ADMIN_PATHS.some((path) => pathname.startsWith(path)) && payload?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
