import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { getAuthUser, canEnterLeads } from '@/lib/crmAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    if (!canEnterLeads(authUser.role)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access Denied: Only Data Entry Operators (crm_entry) can upload leads. CRM Editors are not permitted to upload data.',
        },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { rows } = body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No rows provided in the upload.' },
        { status: 400 }
      );
    }

    // Helper for flexible case-insensitive column matching
    const getRowVal = (row: Record<string, any>, candidateKeys: string[]): any => {
      const cleanCandidates = candidateKeys.map((c) => c.toLowerCase().replace(/[^a-z0-9]/g, ''));
      for (const key of Object.keys(row)) {
        const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanCandidates.includes(cleanKey)) {
          return row[key];
        }
      }
      return undefined;
    };

    const validLeadsToInsert: any[] = [];
    const seenPhonesInBatch = new Set<string>();
    const batchDuplicates: { rowNumber: number; phone: string; reason: string }[] = [];
    const invalidRows: { rowNumber: number; reason: string }[] = [];

    // Step 1: Pre-process and validate each row from client
    rows.forEach((row: any, index: number) => {
      const rowNum = index + 1;

      // Smart column matching for Excel headers
      const rawName = getRowVal(row, [
        'name',
        'customer name',
        'client name',
        'applicant name',
        'full name',
        'borrower name',
        'lead name',
        'customer',
        'client',
        'borrower',
      ]);
      const name = (rawName ?? '').toString().trim();

      const rawPhone = getRowVal(row, [
        'phone',
        'mobile',
        'contact',
        'mobile number',
        'phone number',
        'contact number',
        'mobile no',
        'phone no',
        'contact no',
        'number',
      ]);
      let phone = (rawPhone ?? '').toString().trim().replace(/\D/g, '');

      // Normalize phone number (handling +91 or leading 0)
      if (phone.length === 12 && phone.startsWith('91')) {
        phone = phone.slice(2);
      } else if (phone.length === 11 && phone.startsWith('0')) {
        phone = phone.slice(1);
      } else if (phone.length > 10) {
        phone = phone.slice(-10);
      }

      const rawAmount = getRowVal(row, [
        'loanamount',
        'loan amount',
        'amount',
        'applied amount',
        'applied amount (rs)',
        'loan amount (rs)',
        'amount (rs)',
        'required loan',
        'required amount',
        'sanction amount',
      ]);
      const parsedAmount = rawAmount !== undefined && rawAmount !== null && rawAmount !== ''
        ? Number(String(rawAmount).replace(/,/g, '').trim())
        : 0;
      const loanAmount = isNaN(parsedAmount) ? 0 : parsedAmount;

      const rawLoanType = getRowVal(row, [
        'loantype',
        'loan type',
        'type',
        'product',
        'loan product',
        'loan',
      ]);
      const loanType = (rawLoanType ?? 'Personal Loan').toString().trim() || 'Personal Loan';

      const rawCity = getRowVal(row, ['city', 'location', 'branch', 'town', 'state']);
      const city = (rawCity ?? '').toString().trim();

      const rawBank = getRowVal(row, [
        'bankname',
        'bank name',
        'bank',
        'preferred bank',
        'lender',
        'bank / lender',
      ]);
      const bankName = (rawBank ?? '').toString().trim();

      const rawNotes = getRowVal(row, ['notes', 'remarks', 'remark', 'comment', 'comments', 'requirement']);
      const notes = (rawNotes ?? '').toString().trim();

      const rawPan = getRowVal(row, ['pan', 'pannumber', 'pan number', 'pan card']);
      const panNumber = (rawPan ?? '').toString().trim().toUpperCase();

      const rawEmail = getRowVal(row, ['email', 'email address', 'mail']);
      const email = (rawEmail ?? '').toString().trim().toLowerCase();

      const rawStatus = getRowVal(row, ['status', 'lead status', 'stage', 'lead stage']);
      let status: string = 'Fresh';
      if (rawStatus) {
        const cleanStatus = String(rawStatus).trim().toLowerCase();
        const validStatuses = [
          'Fresh',
          'Not Eligible',
          'Ringing',
          'Call Back',
          'Voice Mail',
          'Login',
          'Underwriting',
          'Approved',
          'Rejected',
          'Disbursed',
        ];
        const match = validStatuses.find(
          (s) =>
            s.toLowerCase() === cleanStatus ||
            s.toLowerCase().replace(/\s+/g, '') === cleanStatus.replace(/\s+/g, '')
        );
        if (match) status = match;
      }

      // Skip completely empty rows silently
      if (!name && !phone && !rawAmount) {
        return;
      }

      if (!name) {
        invalidRows.push({ rowNumber: rowNum, reason: 'Customer Name is missing' });
        return;
      }

      if (!phone || phone.length < 10) {
        invalidRows.push({ rowNumber: rowNum, reason: `Invalid Phone (${phone || 'missing'})` });
        return;
      }

      // Check duplicate within the uploaded sheet itself
      if (seenPhonesInBatch.has(phone)) {
        batchDuplicates.push({
          rowNumber: rowNum,
          phone,
          reason: 'Duplicate mobile number repeated within this same Excel sheet',
        });
        return;
      }

      seenPhonesInBatch.add(phone);

      const leadItem: Record<string, any> = {
        name,
        phone,
        loanType: loanType || 'Personal Loan',
        loanAmount,
        city,
        bankName,
        status,
        source: 'Excel Upload',
        notes,
      };

      if (panNumber) leadItem.panNumber = panNumber;
      if (email) leadItem.email = email;

      validLeadsToInsert.push(leadItem);
    });

    if (validLeadsToInsert.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No valid rows found in the Excel sheet.',
          invalidRows,
          batchDuplicates,
        },
        { status: 400 }
      );
    }

    // Step 2: Query DB to find which phone numbers already exist in MongoDB
    const incomingPhones = validLeadsToInsert.map((l) => l.phone);
    const existingInDb = await Lead.find({
      phone: { $in: incomingPhones },
    }).select('phone name');

    const existingPhoneSet = new Set(existingInDb.map((l) => l.phone));
    const dbDuplicates: { phone: string; existingName: string }[] = [];

    // Filter out DB duplicates
    const finalLeadsToInsert = validLeadsToInsert.filter((lead) => {
      if (existingPhoneSet.has(lead.phone)) {
        const found = existingInDb.find((d) => d.phone === lead.phone);
        dbDuplicates.push({
          phone: lead.phone,
          existingName: found ? found.name : 'Existing Client',
        });
        return false;
      }
      return true;
    });

    // Step 3: Insert unique leads into MongoDB
    let insertedCount = 0;
    if (finalLeadsToInsert.length > 0) {
      try {
        const result = await Lead.insertMany(finalLeadsToInsert, { ordered: false });
        insertedCount = result.length;
      } catch (insertErr: any) {
        // Modern MongoDB driver bulk error handling
        if (
          insertErr?.name === 'MongoBulkWriteError' ||
          insertErr?.code === 11000 ||
          insertErr?.writeErrors
        ) {
          insertedCount =
            insertErr.insertedCount ??
            insertErr.result?.nInserted ??
            insertErr.insertedDocs?.length ??
            0;
        } else {
          throw insertErr;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${insertedCount} leads into CRM.`,
      insertedCount,
      skippedCount: dbDuplicates.length + batchDuplicates.length + invalidRows.length,
      dbDuplicates,
      batchDuplicates,
      invalidRows,
      totalRowsProcessed: rows.length,
    });
  } catch (error: any) {
    console.error('Error in bulk lead upload:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error processing Excel sheet' },
      { status: 500 }
    );
  }
}