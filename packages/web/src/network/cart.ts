export async function addToCart({
  coffeeId,
  userId,
}: {
  coffeeId: number | undefined;
  userId: string | undefined | null;
}) {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/add-coffee-to-cart`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coffeeId,
        userId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add coffee to cart");
  }
}
