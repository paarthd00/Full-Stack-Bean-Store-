import { Context } from "hono";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

dotenv.config({
  path: "../../../.env",
});

const s3 = new S3Client({});

export const s3Route = {
  getSignedUrl: async (c: Context) => {
    const putCommand = new PutObjectCommand({
      ACL: "public-read",
      Key: crypto.randomUUID(),
      Bucket: process.env.ASSETS_BUCKET_NAME!,
    });

    try {
      const imageSignedUrl = await getSignedUrl(s3, putCommand, {
        expiresIn: 3600,
      });

      return c.json({ imageSignedUrl });
    } catch (err) {
      //@ts-ignore
      return c.json({ error: err.message });
    }
  },
};
