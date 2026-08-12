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

    // VERY IMPORTANT:
    // Find case by BOTH case ID and logged-in user's ID
    const caseData = await FormSubmission.findOne({
      _id: caseId,
      referrerId: decoded.id,
    }).lean();

    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found or access denied' },
        { status: 404 }
      );
    }

    const documents = caseData.documents || {};
    const result: Record<string, unknown> = {};

    // PAN
    if (documents.pan?.storagePath) {
      result.pan = {
        fileName: documents.pan.fileName,
        mimeType: documents.pan.mimeType,
        size: documents.pan.size,
        uploadedAt: documents.pan.uploadedAt,
        url: await getSignedUrl(
          documents.pan.storagePath
        ),
      };
    }

    // Aadhaar
    if (documents.aadhaar?.storagePath) {
      result.aadhaar = {
        fileName: documents.aadhaar.fileName,
        mimeType: documents.aadhaar.mimeType,
        size: documents.aadhaar.size,
        uploadedAt: documents.aadhaar.uploadedAt,
        url: await getSignedUrl(
          documents.aadhaar.storagePath
        ),
      };
    }

    // Bank Statement
    if (documents.bankStatement?.storagePath) {
      result.bankStatement = {
        fileName: documents.bankStatement.fileName,
        mimeType: documents.bankStatement.mimeType,
        size: documents.bankStatement.size,
        uploadedAt: documents.bankStatement.uploadedAt,
        url: await getSignedUrl(
          documents.bankStatement.storagePath
        ),
      };
    }

    // ITR
    if (documents.itr?.storagePath) {
      result.itr = {
        fileName: documents.itr.fileName,
        mimeType: documents.itr.mimeType,
        size: documents.itr.size,
        uploadedAt: documents.itr.uploadedAt,
        url: await getSignedUrl(
          documents.itr.storagePath
        ),
      };
    }

    // Form 16
    if (documents.form16?.storagePath) {
      result.form16 = {
        fileName: documents.form16.fileName,
        mimeType: documents.form16.mimeType,
        size: documents.form16.size,
        uploadedAt: documents.form16.uploadedAt,
        url: await getSignedUrl(
          documents.form16.storagePath
        ),
      };
    }

    // Business Proof
    if (documents.businessProof?.storagePath) {
      result.businessProof = {
        fileName: documents.businessProof.fileName,
        mimeType: documents.businessProof.mimeType,
        size: documents.businessProof.size,
        uploadedAt: documents.businessProof.uploadedAt,
        url: await getSignedUrl(
          documents.businessProof.storagePath
        ),
      };
    }

    // Salary Slips
    if (
      Array.isArray(documents.salarySlips) &&
      documents.salarySlips.length > 0
    ) {
      result.salarySlips = await Promise.all(
        documents.salarySlips.map(async (file) => ({
          fileName: file.fileName,
          mimeType: file.mimeType,
          size: file.size,
          uploadedAt: file.uploadedAt,
          url: await getSignedUrl(file.storagePath),
        }))
      );
    }

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