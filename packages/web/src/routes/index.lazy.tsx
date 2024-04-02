import { createLazyFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
export const Route = createLazyFileRoute('/')({
  component: Index,
})
import { useState, useEffect } from 'react'
import { getCoffees } from '@/network';

import { Coffee } from '@/network';

export default function Index() {
  const [message, setMessage] = useState("Hi 👋");

  useEffect(() => {
    (async () => {
      await fetch(import.meta.env.VITE_APP_API_URL+ "/chat", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Hi' }),
      })
      .then(async (response) => {
        const data = await response.json()
        console.log(data)
      }
      ) 
    })()
  }, []);

  function onClick() {
    fetch(import.meta.env.VITE_APP_API_URL)
      .then((response) => response.text())
      .then(setMessage);
  }

  const { isPending, error, data:coffeeData } = useQuery({
    queryKey: ['coffeeData'],
    queryFn: () => getCoffees(),
  })

  if (isPending) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className="App">
      <div className="px-3">
        <button onClick={onClick}>
          Message is "<i>{message}</i>"
        </button>
        {
          coffeeData?.map((coffee:Coffee, i:number) => (
            <div key={i}>
              <h1>{coffee.name}</h1>
              <p>{coffee.origin}</p>
              <p>$ {coffee.price}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}
