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

      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      if (role === 'crm_editor') {
        return NextResponse.redirect(new URL('/crm', request.url));
      }
      if (role === 'crm_entry') {
        return NextResponse.redirect(new URL('/crm/entry', request.url));
      }
      if (role === 'admin' || role === 'superadmin' || role === 'crm') {
        return NextResponse.redirect(new URL('/crm', request.url));
      }

      return NextResponse.redirect(
        new URL('/dashboard', request.url)
      );
    } catch (error) {
      return NextResponse.next();
    }
  }

  // ============================================
  // CRM DATA ENTRY ROUTE (/crm/entry)
  // ============================================

  if (pathname.startsWith('/crm/entry')) {
    if (!token) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      );
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET
      );

      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      // CRM Editors are strictly blocked from entry page -> redirect to /crm
      if (role === 'crm_editor') {
        return NextResponse.redirect(
          new URL('/crm', request.url)
        );
      }

      // Allowed intake roles: crm_entry, admin, superadmin, crm
      const allowedEntryRoles = ['crm_entry', 'admin', 'superadmin', 'crm'];
      if (!allowedEntryRoles.includes(role)) {
        return NextResponse.redirect(
          new URL('/dashboard', request.url)
        );
      }

      return NextResponse.next();
    } catch (error) {
      console.error('CRM Entry Proxy Error:', error);
      return NextResponse.redirect(
        new URL('/login', request.url)
      );
    }
  }

  // ============================================
  // CRM DASHBOARD ROUTE (/crm)
  // ============================================

  if (pathname.startsWith('/crm')) {
    if (!token) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      );
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET
      );

      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      // Allowed CRM dashboard roles: crm_editor, crm_entry (view only), admin, superadmin, crm
      const allowedCrmRoles = ['crm_editor', 'crm_entry', 'admin', 'superadmin', 'crm'];
      if (!allowedCrmRoles.includes(role)) {
        return NextResponse.redirect(
          new URL('/dashboard', request.url)
        );
      }

      return NextResponse.next();
    } catch (error) {
      console.error('CRM Proxy Error:', error);
      return NextResponse.redirect(
        new URL('/login', request.url)
      );
    }
  }

  // ============================================
  // LEAD ROUTE (/lead)
  // ============================================

  if (pathname.startsWith('/lead')) {
    if (!token) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      );
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET
      );

      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      const allowedLeadRoles = ['admin', 'superadmin', 'crm', 'crm_editor'];
      if (!allowedLeadRoles.includes(role)) {
        return NextResponse.redirect(
          new URL('/dashboard', request.url)
        );
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Lead Proxy Error:', error);
      return NextResponse.redirect(
        new URL('/login', request.url)
      );
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
    '/lead',
    '/crm/:path*',
    '/crm',
  ],
};