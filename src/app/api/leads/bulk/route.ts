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

    const validLeadsToInsert: any[] = [];
    const seenPhonesInBatch = new Set<string>();
    const batchDuplicates: { rowNumber: number; phone: string; reason: string }[] = [];
    const invalidRows: { rowNumber: number; reason: string }[] = [];

    // Step 1: Pre-process and validate each row from client
    rows.forEach((row: any, index: number) => {
      const rowNum = index + 1;

      // Smart column matching for Excel headers
      const phone = (
        row.phone ||
        row.Phone ||
        row.mobile ||
        row.Mobile ||
        row['Mobile Number'] ||
        row['Phone Number'] ||
        ''
      )
        .toString()
        .trim()
        .replace(/\D/g, '');

      const name = (
        row.name ||
        row.Name ||
        row['Customer Name'] ||
        row['Client Name'] ||
        row['Applicant Name'] ||
        ''
      )
        .toString()
        .trim();

      const loanAmount = Number(
        row.loanAmount ||
          row.amount ||
          row.Amount ||
          row['Loan Amount'] ||
          row['Required Loan'] ||
          0
      );

      const loanType = (
        row.loanType ||
        row['Loan Type'] ||
        row.type ||
        'Personal Loan'
      )
        .toString()
        .trim();

      const city = (row.city || row.City || row.location || '').toString().trim();
      const bankName = (
        row.bankName ||
        row.bank ||
        row.Bank ||
        row['Bank Name'] ||
        row['Bank'] ||
        row['Preferred Bank'] ||
        ''
      )
        .toString()
        .trim();
      const notes = (row.notes || row.Notes || row.remarks || '').toString().trim();

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

      validLeadsToInsert.push({
        name,
        phone,
        loanType: loanType || 'Personal Loan',
        loanAmount: isNaN(loanAmount) ? 0 : loanAmount,
        city,
        bankName,
        status: 'Login',
        source: 'Excel Upload',
        notes,
      });
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
        // Race condition: some phones may have been inserted by someone else meanwhile
        if (insertErr?.code === 11000 || insertErr?.writeErrors) {
          insertedCount = insertErr.insertedDocs?.length || 0;
        } else {
          throw insertErr;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${insertedCount} leads into Login stage.`,
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