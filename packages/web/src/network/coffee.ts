export type Coffee = {
  id?: number;
  name: string;
  origin: string;
  price: number;
  flavor: string;
  roast: string;
  image: string;
};

export const getInfo = async (prompt: string) => {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/faq`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const result = await response.json();

  return result;
};

export const getCoffees = async (): Promise<Coffee[]> => {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/coffees`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userId"),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch coffees");
  }

  return response.json();
};

export const addCoffee = async (coffee: Coffee) => {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/add-coffee`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(coffee),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add coffee");
  }
};

export const deleteCoffee = async (id: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/delete-coffee`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete coffee");
  }
};
