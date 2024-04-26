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
  return result;
};

export const checkIfAdmin = async () => {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/is-admin`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userId"),
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
};
