const { Storage } = require('@google-cloud/storage');

async function testGCS() {
  console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT_ID);
  console.log('Client Email:', process.env.GOOGLE_CLOUD_CLIENT_EMAIL);
  console.log('Bucket Name:', process.env.GOOGLE_CLOUD_BUCKET_NAME);

  const privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY
    ? process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: {
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      private_key: privateKey,
    },
  });

  try {
    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);
    const [exists] = await bucket.exists();
    console.log(`✅ Bucket exists: ${exists}`);

    if (exists) {
      const file = bucket.file(`test-${Date.now()}.txt`);
      await file.save(Buffer.from('Hello Google Cloud Storage!'), { resumable: false });
      console.log('✅ Direct file upload test passed successfully!');
    }
  } catch (err) {
    console.error('❌ GCS Test Failed:');
    console.error(err);
  }
}

testGCS();