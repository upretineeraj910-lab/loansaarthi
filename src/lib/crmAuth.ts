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

/**
 * LoanSaarthi Role-Based Access Control (RBAC) System
 *
 * Explicit Role Specifications:
 * 1. Super Admin ('superadmin'):
 *    - Full master access across all modules: Dashboard, CRM Pipeline, Leads Vault,
 *      Fast Lead Entry, Consultations / Appointments, bulk assignment, lead editing, and deletion.
 *
 * 2. Admin ('admin'):
 *    - Restricted EXCLUSIVELY to viewing Customer Leads (/lead) generated via OTP verification.
 *    - Cannot access CRM Pipeline (/crm), cannot enter leads (/crm/entry), and cannot delete records.
 *
 * 3. CRM Entry Operator ('crm_entry'):
 *    - Allowed to enter and upload single / bulk leads on /crm/entry.
 *    - Allowed to VIEW the CRM pipeline (/crm) in READ-ONLY mode.
 *    - CANNOT edit lead status, assign leads, or delete leads.
 *
 * 4. CRM Editor / Calling Agent ('crm_editor'):
 *    - Assigned calling leads queue on /crm.
 *    - Allowed to update status, callback times, and call notes for leads assigned to them.
 *    - CANNOT enter leads on /crm/entry.
 */

export function isSuperAdmin(role?: string): boolean {
  return role?.toLowerCase() === 'superadmin';
}

export function isAdmin(role?: string): boolean {
  return role?.toLowerCase() === 'admin';
}

export function isCrmEntry(role?: string): boolean {
  return role?.toLowerCase() === 'crm_entry';
}

export function isCrmEditor(role?: string): boolean {
  return role?.toLowerCase() === 'crm_editor';
}

/**
 * Can this role submit single leads or bulk upload Excel sheets in /crm/entry?
 * STRICT: Only 'crm_entry' and 'superadmin'. Admin and CRM Editor are blocked.
 */
export function canEnterLeads(role?: string): boolean {
  const r = role?.toLowerCase();
  return r === 'crm_entry' || r === 'superadmin';
}

/**
 * Can this role update lead status, notes, or details in /crm?
 * STRICT: Only 'superadmin' and 'crm_editor' (for assigned leads).
 * CRM Entry is strictly VIEW-ONLY and cannot modify records. Admin is restricted to /lead.
 */
export function canEditLeads(role?: string): boolean {
  const r = role?.toLowerCase();
  return r === 'crm_editor' || r === 'superadmin';
}

/**
 * Can this role delete leads from the database?
 * STRICT: Only 'superadmin' can permanently delete records.
 */
export function canDeleteLeads(role?: string): boolean {
  return role?.toLowerCase() === 'superadmin';
}

/**
 * Can this role assign or reassign leads to telecalling agents?
 * STRICT: Only 'superadmin' can assign leads.
 */
export function canAssignLeads(role?: string): boolean {
  return role?.toLowerCase() === 'superadmin';
}

/**
 * Can this role access and view the visual CRM Pipeline (/crm)?
 * Super Admin: Full view & edit.
 * CRM Editor: Views leads assigned to their name.
 * CRM Entry: View-only access (kuch edit na kr paye).
 * Admin: BLOCKED (Admin can ONLY view OTP Customer Leads on /lead).
 */
export function canViewPipeline(role?: string): boolean {
  const r = role?.toLowerCase();
  return r === 'crm_editor' || r === 'crm_entry' || r === 'superadmin' || r === 'crm';
}

/**
 * Backward compatibility alias for canViewPipeline.
 */
export function canViewLeads(role?: string): boolean {
  return canViewPipeline(role);
}

/**
 * Can this role access the Customer Leads Vault (/lead - OTP verified leads)?
 * Admin, Superadmin, CRM Entry, and CRM Editor all have visibility into OTP customer submissions.
 */
export function canViewLeadVault(role?: string): boolean {
  const r = role?.toLowerCase();
  return r === 'admin' || r === 'superadmin' || r === 'crm_entry' || r === 'crm_editor' || r === 'crm';
}

