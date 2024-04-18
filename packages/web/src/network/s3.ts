export const getSignedUrl = async ({
  name,
  origin,
  flavor,
  roast,
  hash,
  imageSize,
  imageType,
}: {
  name: string;
  origin: string;
  flavor: string;
  roast: string;
  hash: string;
  imageSize: number;
  imageType: string;
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/get-signed-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageSize,
        imageType,
        name,
        hash,
        origin,
        flavor,
        roast,
      }),
    }
  );

  const result = await response.json();

  return result;
};
