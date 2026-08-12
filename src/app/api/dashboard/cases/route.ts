// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';

// import connectToDatabase from '@/lib/mongodb';
// import FormSubmission from '@/models/FormSubmission';
// import { getSignedUrl } from '@/lib/googleCloudStorage';


// export const runtime = 'nodejs';

// export async function GET(request: Request) {
//   try {
//     await connectToDatabase();

//     // Get JWT token from cookie
//     const cookieHeader = request.headers.get('cookie');

//     const token = cookieHeader
//       ?.split(';')
//       .find((cookie) => cookie.trim().startsWith('token='))
//       ?.split('=')[1];

//     if (!token) {
//       return NextResponse.json(
//         { error: 'Unauthorized. Please login again.' },
//         { status: 401 }
//       );
//     }

//     // Verify JWT
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     ) as {
//       id: string;
//       email: string;
//       role: string;
//     };

//     // Fetch ONLY this user's cases
//     const cases = await FormSubmission.find({
//       referrerId: decoded.id,
//     })
//       .sort({ createdAt: -1 })
//       .lean();

//     // Generate temporary signed URLs for private Google Cloud files
//     const formattedCases = await Promise.all(
//       cases.map(async (item: any) => {
//         const documents = item.documents || {};

//         // PAN
//         if (documents.pan?.storagePath) {
//           documents.pan = {
//             ...documents.pan,
//             url: await getSignedUrl(documents.pan.storagePath),
//           };
//         }

//         // Aadhaar
//         if (documents.aadhaar?.storagePath) {
//           documents.aadhaar = {
//             ...documents.aadhaar,
//             url: await getSignedUrl(documents.aadhaar.storagePath),
//           };
//         }

//         // Bank Statement
//         if (documents.bankStatement?.storagePath) {
//           documents.bankStatement = {
//             ...documents.bankStatement,
//             url: await getSignedUrl(
//               documents.bankStatement.storagePath
//             ),
//           };
//         }

//         // ITR
//         if (documents.itr?.storagePath) {
//           documents.itr = {
//             ...documents.itr,
//             url: await getSignedUrl(documents.itr.storagePath),
//           };
//         }

//         // Form 16
//         if (documents.form16?.storagePath) {
//           documents.form16 = {
//             ...documents.form16,
//             url: await getSignedUrl(documents.form16.storagePath),
//           };
//         }

//         // Business Proof
//         if (documents.businessProof?.storagePath) {
//           documents.businessProof = {
//             ...documents.businessProof,
//             url: await getSignedUrl(
//               documents.businessProof.storagePath
//             ),
//           };
//         }

//         // Salary Slips
//         if (
//           Array.isArray(documents.salarySlips) &&
//           documents.salarySlips.length > 0
//         ) {
//           documents.salarySlips = await Promise.all(
//             documents.salarySlips.map(async (file: any) => ({
//               ...file,
//               url: await getSignedUrl(file.storagePath),
//             }))
//           );
//         }

//         return {
//           ...item,
//           documents,
//         };
//       })
//     );

//     return NextResponse.json({
//       success: true,
//       count: formattedCases.length,
//       data: formattedCases,
//     });
//   } catch (error) {
//     console.error('❌ DASHBOARD CASES ERROR:', error);

//     return NextResponse.json(
//       { error: 'Failed to fetch dashboard cases' },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import connectToDatabase from '@/lib/mongodb';
import FormSubmission from '@/models/FormSubmission';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Get JWT token from cookie
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
    ) as {
      id: string;
      email: string;
      role: string;
    };

    // Fetch ONLY this logged-in user's cases
    const cases = await FormSubmission.find({
      referrerId: decoded.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: cases.length,
      data: cases,
    });
  } catch (error) {
    console.error('❌ DASHBOARD CASES ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to fetch dashboard cases' },
      { status: 500 }
    );
  }
}