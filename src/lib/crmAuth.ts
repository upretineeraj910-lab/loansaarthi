import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'borrower' | 'lender' | 'admin' | 'superadmin' | 'crm_entry' | 'crm_editor' | 'crm' | string;
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

    const userId = (payload.id as string) || (payload.sub as string);
    let name = (payload.name as string) || undefined;

    // If name is not in JWT payload, fetch from DB
    if (!name && userId) {
      try {
        const connectToDatabase = (await import('@/lib/mongodb')).default;
        const User = (await import('@/models/User')).default;
        await connectToDatabase();
        const userDoc = await User.findById(userId).select('name').lean();
        if (userDoc?.name) {
          name = userDoc.name;
        }
      } catch (err) {
        // Fallback silently
      }
    }

    return {
      id: userId,
      email: payload.email as string,
      name,
      role: (payload.role as AuthUser['role']) || 'borrower',
    };
  } catch (err) {
    return null;
  }
}

/** Can this role submit / upload leads in /crm/entry? */
export function canEnterLeads(role?: string): boolean {
  const r = role?.toLowerCase();
  return r === 'crm_entry' || r === 'superadmin' || r === 'admin' || r === 'crm';
}

/** Can this role update lead status or delete leads in /crm? */
export function canEditLeads(role?: string): boolean {
  const r = role?.toLowerCase();
  return r === 'crm_editor' || r === 'superadmin' || r === 'admin' || r === 'crm';
}

/** Can this role view the leads in /crm? */
export function canViewLeads(role?: string): boolean {
  const r = role?.toLowerCase();
  return r === 'crm_editor' || r === 'crm_entry' || r === 'superadmin' || r === 'admin' || r === 'crm';
}

