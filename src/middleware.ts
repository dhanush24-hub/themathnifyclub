import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SESSION_COOKIE = 'mathnify_admin_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'mathnify-secret-change-in-production';

function isAdminAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [secret] = decoded.split(':');
    return secret === SESSION_SECRET;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect all /admin routes (except login)
  if (path.startsWith('/admin') && !path.startsWith('/admin-login')) {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }

  // If already logged in and visiting admin-login, redirect to dashboard
  if (path === '/admin-login' && isAdminAuthenticated(request)) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin-login'],
};
