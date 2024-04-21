export const stripeCheckout = async (total: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/goto-checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ total }),
    }
  );

  const result = await response.json();

  console.log(result);
  return result;
};
