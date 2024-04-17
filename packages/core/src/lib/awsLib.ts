import { uploadData } from "aws-amplify/storage";

export async function s3Upload(file: File) {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await uploadData({
    key: filename,
    data: file,
    options: {
      contentType: file.type,
    },
  });

  return stored;
}
