import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest) {
  const token =
    request.cookies.get('token')?.value ||
    request.headers.get('Authorization')?.split(' ')[1];

  const pathname = request.nextUrl.pathname.toLowerCase();

  // ============================================
  // PROTECTED ROUTES
  // ============================================

  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/borrower-form',
  ];

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET
      );

      await jwtVerify(token, secret);

      return NextResponse.next();
    } catch (error) {
      console.error('Proxy JWT Error:', error);

      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ============================================
  // ADMIN ONLY - LEADS
  // ============================================

  const isLeadPath = pathname.startsWith('/lead');

  if (isLeadPath) {
    // No token = not logged in
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET
      );

      // Verify JWT and get payload
      const { payload } = await jwtVerify(token, secret);

      // Check role
      if (payload.role !== 'admin') {
        return NextResponse.redirect(
          new URL('/dashboard', request.url)
        );
      }

      // Admin is allowed
      return NextResponse.next();
    } catch (error) {
      console.error('Admin JWT Error:', error);

      return NextResponse.redirect(
        new URL('/login', request.url)
      );
    }
  }

  // ============================================
  // AUTH ROUTES - LOGIN / REGISTER
  // ============================================

  const authPaths = ['/login', '/register'];

  const isAuthPath = authPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isAuthPath && token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET
      );

      await jwtVerify(token, secret);

      return NextResponse.redirect(
        new URL('/dashboard', request.url)
      );
    } catch (error) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/login',
    '/register',
    '/borrower-form/:path*',
    '/lead/:path*',
  ],
};