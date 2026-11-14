/**
 * Executive Dashboard Overview API Endpoint
 * Aggregates live pipeline KPIs, lead statistics, eligibility checks,
 * and recent loan cases across LoanSaarthi's database.
 */
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import EligibilityLead from '@/models/EligibilityLead';
import Appointment from '@/models/Appointment';
import { getAuthUser } from '@/lib/crmAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Verify authenticated user using centralized CRM Auth (cookies + bearer headers)
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          message: 'Authentication required. Please sign in to access the Executive Dashboard.',
        },
        { status: 401 }
      );
    }

    const userRole = authUser.role?.toLowerCase() || '';

    // Admin role is strictly restricted to viewing Customer Leads (/lead)
    if (userRole === 'admin') {
      return NextResponse.json(
        {
          success: false,
          redirectTo: '/lead',
          message: 'Access Restricted: The Admin role is configured strictly for the OTP Customer Leads Vault (/lead).',
        },
        { status: 403 }
      );
    }

    // Role-based visibility check:
    // Super Admin and Data Entry see the company pipeline totals;
    // CRM Editors (calling agents) only see their assigned active cases.
    const isFullAccess = ['superadmin', 'manager', 'crm', 'crm_entry'].includes(userRole);

    // Build lead query based on role
    const leadQuery: Record<string, any> = {};
    if (!isFullAccess) {
      if (authUser.name) {
        const safeName = authUser.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
        leadQuery.assignedTo = { $regex: new RegExp(`^${safeName}$`, 'i') };
      } else {
        leadQuery.assignedTo = '__none__';
      }
    }

    // Concurrent DB queries for high performance
    const [
      totalLeads,
      statusCounts,
      disbursedStats,
      totalEligibilityChecks,
      totalAppointments,
      recentLeads,
      recentEligibility,
    ] = await Promise.all([
      // 1. Total leads count
      Lead.countDocuments(leadQuery),

      // 2. Aggregate pipeline statuses
      Lead.aggregate([
        { $match: leadQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // 3. Disbursed amount aggregation
      Lead.aggregate([
        {
          $match: {
            ...leadQuery,
            status: { $in: ['Disbursed', 'Approved'] },
          },
        },
        {
          $group: {
            _id: null,
            totalDisbursed: {
              $sum: { $ifNull: ['$approvedAmount', '$loanAmount'] },
            },
          },
        },
      ]),

      // 4. Pre-qualification count from dedicated eligibility_leads collection
      EligibilityLead.countDocuments().catch(() => 0),

      // 5. Total scheduled appointments
      Appointment.countDocuments().catch(() => 0),

      // 6. Recent 10 CRM leads
      Lead.find(leadQuery)
        .select('name phone loanType loanAmount status assignedTo createdAt')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),

      // 7. Recent 5 eligibility inquiries
      EligibilityLead.find()
        .select('fullName phone loanType monthlyIncome maxLoanEligible createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .catch(() => []),
    ]);

    // Format pipeline status counts map
    const countsMap: Record<string, number> = {};
    for (const item of statusCounts) {
      if (item._id) countsMap[item._id] = item.count;
    }

    const fresh = countsMap['Fresh'] || 0;
    const login = countsMap['Login'] || 0;
    const underwriting = countsMap['Underwriting'] || 0;
    const approved = countsMap['Approved'] || 0;
    const disbursed = countsMap['Disbursed'] || 0;
    const inPipeline = login + underwriting;
    const totalDisbursedVolume = disbursedStats[0]?.totalDisbursed || 0;

    return NextResponse.json({
      success: true,
      user: authUser
        ? {
            id: authUser.id,
            email: authUser.email,
            role: authUser.role,
            name: authUser.name,
          }
        : null,
      stats: {
        totalLeads,
        fresh,
        inPipeline,
        approved,
        disbursed,
        disbursedVolume: totalDisbursedVolume,
        eligibilityChecks: totalEligibilityChecks,
        appointments: totalAppointments,
      },
      recentLeads: recentLeads.map((item) => ({
        id: item._id,
        name: item.name,
        phone: item.phone,
        loanType: item.loanType,
        loanAmount: item.loanAmount,
        status: item.status,
        assignedTo: item.assignedTo || 'Unassigned',
        createdAt: item.createdAt,
      })),
      recentEligibility: recentEligibility.map((item: any) => ({
        id: item._id,
        fullName: item.fullName,
        phone: item.phone,
        loanType: item.loanType,
        monthlyIncome: item.monthlyIncome,
        maxLoanEligible: item.maxLoanEligible,
        createdAt: item.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('❌ DASHBOARD OVERVIEW ERROR:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch dashboard overview' },
      { status: 500 }
    );
  }
}
