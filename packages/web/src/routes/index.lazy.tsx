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
import { Button } from '@/components/ui/button';
export default function Index() {
  const [message, setMessage] = useState("Hi 👋");
  const Navigate = useNavigate();

  async function onClick() {
    await fetch(import.meta.env.VITE_APP_API_URL)
      .then((response) => response.text())
      .then(setMessage);
  }

  const deleteCoffeeMutation = useMutation({
    mutationFn: deleteCoffee,
    onSettled: () => queryClient.invalidateQueries({ "queryKey": ["coffeeData"] })
  });

  const handleDelete = async (id: number) => {
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
      <div className="px-3 py-6">
        {/* <button onClick={onClick}>
          Message is "<i>{message}</i>"
        </button> */}
        <div className='flex gap-4 flex-wrap'>
          {
            coffeeData?.map((coffee: Coffee) => (
              <div key={coffee.id}>
                <img src={coffee.image} alt={coffee.name} className='rounded-full object-cover object-center w-[20rem] h-[20rem]' />
                <div className='flex flex-col gap-4 items-start'>
                  <h3 className='text-xl'>{coffee.name}</h3>
                  <p>
                    <span>
                      <strong>ORIGIN: </strong>
                    </span>
                    {coffee.origin}</p>
                  <p>
                    <span>
                      <strong>ROAST:</strong>
                    </span>
                    {coffee.roast}</p>
                  <p>
                    <span>
                      <strong>Flavor Notes:</strong>
                    </span> {coffee.flavor}</p>
                  <Button className='bg-[#0c0c0c] hover:bg-[gray]' >
                    Add to Bag
                  </Button>

                  {/* <button
                    onClick={() => {
                      if (!coffee.id) return
                      handleDelete(coffee?.id)
                    }}
                    className=''>Delete</button> */}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
