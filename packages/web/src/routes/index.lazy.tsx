import { createLazyFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
export const Route = createLazyFileRoute('/')({
  component: Index,
})
import { useState, useEffect } from 'react'
import { getCoffees } from '@/network';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/main';
import { Coffee, deleteCoffee } from '@/network';
import { useNavigate } from "@tanstack/react-router";
export default function Index() {
  const [message, setMessage] = useState("Hi 👋");
  const Navigate = useNavigate();
  useEffect(() => {
    (async () => {
      await fetch(import.meta.env.VITE_APP_API_URL + "/chat", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Hi' }),
      }).then(async (response) => {
        const data = await response.json()
        console.log(data)
      })
    })()
  }, []);

  async function onClick() {
    await fetch(import.meta.env.VITE_APP_API_URL)
    .then((response) => response.text())
    .then(setMessage);
  }

  const deleteCoffeeMutation = useMutation({
    mutationFn: deleteCoffee,
    onSettled: () => queryClient.invalidateQueries({ "queryKey": ["coffeeData"] })
  });

  const handleDelete = async (id:number) => {
    try {
      deleteCoffeeMutation.mutateAsync(id);
    } catch (error) {
      alert("Error creating post");
    } finally {
      Navigate({ to: "/" });
    }
  };

  const { isPending: coffeeDataPending, error: coffeeDataError, data: coffeeData } = useQuery({
    queryKey: ['coffeeData'],
    queryFn: () => getCoffees(),
  })

  if (coffeeDataPending) return 'Loading...'
  if (coffeeDataError) return 'An error has occurred: ' + coffeeDataError.message

  return (
    <div className="App">
      <div className="px-3">
        <button onClick={onClick}>
          Message is "<i>{message}</i>"
        </button>
        {
          coffeeData?.map((coffee: Coffee) => (
            <div key={coffee.id}>
              <h1>{coffee.name}</h1>
              <div className='flex gap-2 items-center'>
                <p>{coffee.origin}</p>
                <p> {coffee.roast}</p>
                <p> {coffee.flavor}</p>
                <button
                  onClick={()=>{
                    if(!coffee.id) return
                    handleDelete(coffee?.id)
                  }}
                  className=''>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
