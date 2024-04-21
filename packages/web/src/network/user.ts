export const loginOrRegister = async (user: any) => {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/login-or-register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    }
  );

  const result = await response.json();

  console.log(result);
  return result;
};
