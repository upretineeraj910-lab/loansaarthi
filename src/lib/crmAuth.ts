import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export interface AuthUser {
  id: string;
  email: string;
  role: 'borrower' | 'lender' | 'admin' | 'crm_entry' | 'crm_editor';
}

/**
 * Extracts and verifies the logged-in user from a NextRequest or standard Request.
 * Supports cookies ('token') as well as 'Authorization: Bearer ...' headers.
 */
export async function getAuthUser(req: NextRequest | Request): Promise<AuthUser | null> {
  try {
    let token: string | undefined;

    // 1. NextRequest cookie reader
    if ('cookies' in req && typeof (req as any).cookies?.get === 'function') {
      token = (req as any).cookies.get('token')?.value;
    }

    // 2. Cookie header fallback
    if (!token) {
      const cookieHeader = req.headers.get('cookie');
      if (cookieHeader) {
        const parts = cookieHeader.split(';');
        for (const part of parts) {
          const trimmed = part.trim();
          if (trimmed.startsWith('token=')) {
            token = trimmed.substring('token='.length);
            break;
          }
        }
      }
    }

    // 3. Authorization header fallback
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');
    const { payload } = await jwtVerify(token, secret);

    return {
      id: (payload.id as string) || (payload.sub as string),
      email: payload.email as string,
      role: (payload.role as AuthUser['role']) || 'borrower',
    };
  } catch (err) {
    return null;
  }
}

/** Can this role submit / upload leads in /crm/entry? */
export function canEnterLeads(role?: string): boolean {
  return role === 'crm_entry' || role === 'admin';
}

/** Can this role update lead status or delete leads in /crm? */
export function canEditLeads(role?: string): boolean {
  return role === 'crm_editor' || role === 'admin';
}

/** Can this role view the leads in /crm? */
export function canViewLeads(role?: string): boolean {
  return role === 'crm_editor' || role === 'crm_entry' || role === 'admin';
}

