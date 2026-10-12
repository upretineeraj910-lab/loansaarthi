import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import connectToDatabase from '@/lib/mongodb';
import FormSubmission from '@/models/FormSubmission';
import { getSignedUrl } from '@/lib/googleCloudStorage';

export const runtime = 'nodejs';

type TokenPayload = {
  id: string;
  email: string;
  role: string;
};

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    // Get case ID from URL
    const { id: caseId } = await context.params;

    if (!caseId) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }

    // Get JWT from cookie
    const cookieHeader = request.headers.get('cookie');

    const token = cookieHeader
      ?.split(';')
      .find((cookie) => cookie.trim().startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login again.' },
        { status: 401 }
      );
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    // Find case by BOTH case ID and logged-in user's ID (select only documents)
    const caseData = await FormSubmission.findOne({
      _id: caseId,
      referrerId: decoded.id,
    })
      .select('documents')
      .lean();

    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found or access denied' },
        { status: 404 }
      );
    }

    const documents = caseData.documents || {};
    const result: Record<string, unknown> = {};
    const urlTasks: Promise<void>[] = [];

    const singleDocKeys = [
      'pan',
      'aadhaar',
      'bankStatement',
      'itr',
      'form16',
      'businessProof',
    ] as const;

    for (const key of singleDocKeys) {
      const doc = documents[key];
      if (doc?.storagePath) {
        urlTasks.push(
          getSignedUrl(doc.storagePath).then((url) => {
            result[key] = {
              fileName: doc.fileName,
              mimeType: doc.mimeType,
              size: doc.size,
              uploadedAt: doc.uploadedAt,
              url,
            };
          })
        );
      }
    }

    // Salary Slips
    if (
      Array.isArray(documents.salarySlips) &&
      documents.salarySlips.length > 0
    ) {
      urlTasks.push(
        Promise.all(
          documents.salarySlips.map(async (file) => ({
            fileName: file.fileName,
            mimeType: file.mimeType,
            size: file.size,
            uploadedAt: file.uploadedAt,
            url: await getSignedUrl(file.storagePath),
          }))
        ).then((slips) => {
          result.salarySlips = slips;
        })
      );
    }

    await Promise.all(urlTasks);

    return NextResponse.json({
      success: true,
      caseId,
      documents: result,
    });
  } catch (error) {
    console.error(
      '❌ DOCUMENTS API ERROR:',
      error
    );

    return NextResponse.json(
      { error: 'Failed to generate document URLs' },
      { status: 500 }
    );
  }
}