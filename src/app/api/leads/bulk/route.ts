import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { rows } = body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No rows provided in the upload.' },
        { status: 400 }
      );
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const validLeadsToInsert: any[] = [];
    const seenPansInBatch = new Set<string>();
    const batchDuplicates: { rowNumber: number; pan: string; reason: string }[] = [];
    const invalidRows: { rowNumber: number; reason: string }[] = [];

    // Step 1: Pre-process and validate each row from client
    rows.forEach((row: any, index: number) => {
      const rowNum = index + 1;

      // Smart column matching for Excel headers
      const pan = (
        row.panNumber ||
        row.pan ||
        row.PAN ||
        row['PAN Number'] ||
        row['Pan Number'] ||
        row['PAN CARD'] ||
        row['Pan Card'] ||
        ''
      )
        .toString()
        .trim()
        .toUpperCase();

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

      const email = (row.email || row.Email || '').toString().trim().toLowerCase();
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

      if (!pan || !panRegex.test(pan)) {
        invalidRows.push({
          rowNumber: rowNum,
          reason: `Invalid PAN format "${pan}". Must be 10 characters (e.g. ABCDE1234F)`,
        });
        return;
      }

      // Check duplicate within the uploaded sheet itself
      if (seenPansInBatch.has(pan)) {
        batchDuplicates.push({
          rowNumber: rowNum,
          pan,
          reason: 'Duplicate PAN repeated within this same Excel sheet',
        });
        return;
      }

      seenPansInBatch.add(pan);

      validLeadsToInsert.push({
        name,
        phone,
        panNumber: pan,
        email,
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

    // Step 2: Query DB to find which PANs already exist in MongoDB
    const incomingPans = validLeadsToInsert.map((l) => l.panNumber);
    const existingInDb = await Lead.find({
      panNumber: { $in: incomingPans },
    }).select('panNumber name');

    const existingPanSet = new Set(existingInDb.map((l) => l.panNumber));
    const dbDuplicates: { pan: string; existingName: string }[] = [];

    // Filter out DB duplicates
    const finalLeadsToInsert = validLeadsToInsert.filter((lead) => {
      if (existingPanSet.has(lead.panNumber)) {
        const found = existingInDb.find((d) => d.panNumber === lead.panNumber);
        dbDuplicates.push({
          pan: lead.panNumber,
          existingName: found ? found.name : 'Existing Client',
        });
        return false;
      }
      return true;
    });

    // Step 3: Insert unique leads into MongoDB
    let insertedCount = 0;
    if (finalLeadsToInsert.length > 0) {
      const result = await Lead.insertMany(finalLeadsToInsert, { ordered: false });
      insertedCount = result.length;
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

