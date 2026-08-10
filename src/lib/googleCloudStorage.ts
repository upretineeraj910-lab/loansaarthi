import { Storage } from '@google-cloud/storage';

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const clientEmail = process.env.GOOGLE_CLOUD_CLIENT_EMAIL;

// Private key me se extra double quotes aur escaped newlines (\n) clean karne ke liye
const privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY
  ?.replace(/^"(.*)"$/, '$1')
  ?.replace(/\\n/g, '\n');

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;

if (!projectId || !clientEmail || !privateKey || !bucketName) {
  throw new Error(
    'Google Cloud Storage environment variables are missing'
  );
}

const storage = new Storage({
  projectId,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
});

const bucket = storage.bucket(bucketName);

export async function uploadToGoogleCloud(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  folder: string
) {
  const safeFileName = fileName.replace(
    /[^a-zA-Z0-9._-]/g,
    '_'
  );

  const filePath = `${folder}/${Date.now()}-${safeFileName}`;

  console.log('📤 Upload starting:', fileName);
  console.log('📦 Bucket:', bucketName);
  console.log('📁 Path:', filePath);
  console.log('📦 Buffer size:', buffer.length);

  try {
    const cloudFile = bucket.file(filePath);

    console.log('Before save()');

    // FIX: validation: false add kiya gaya hai stream error rokne ke liye
    await cloudFile.save(buffer, {
      resumable: false,
      validation: false, 
      metadata: {
        contentType: mimeType || 'application/octet-stream',
      },
    });

    console.log('✅ Google Cloud upload successful:', filePath);
    console.log('After save()');

    return {
      fileName,
      storagePath: filePath,
      mimeType: mimeType || 'application/octet-stream',
      size: buffer.length,
      uploadedAt: new Date(),
    };
  } catch (error) {
    console.error(
      '❌ GOOGLE CLOUD UPLOAD ERROR:',
      error
    );

    throw error;
  }
}
