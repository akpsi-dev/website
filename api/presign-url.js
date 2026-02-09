import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Constants
const DEFAULT_EXPIRY = 60 * 60; // 1 day

// Define s3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
});


export async function GET(request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key"); // s3 object key


  // Generate presigned URL
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: DEFAULT_EXPIRY });
    return new Response(JSON.stringify({ presignedUrl }), {
        headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to generate presigned URL", details: err.message }), {
        headers: { "Content-Type": "application/json" },
    });
  }
}