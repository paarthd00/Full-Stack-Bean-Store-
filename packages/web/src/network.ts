type Coffee = {
  name: string;
  origin: string;
  price: number;
}

export const addCoffee = async (coffee: Coffee) => {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/add-coffee`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(coffee)
  });

  if (!response.ok) {
    throw new Error('Failed to add coffee');
  }
}
