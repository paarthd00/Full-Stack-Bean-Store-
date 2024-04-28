import { createLazyFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
export const Route = createLazyFileRoute('/')({
  component: Index,
})
import { addToCart } from '@/network/cart';
import { getCoffees } from '@/network/coffee';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/main';
import { Coffee, deleteCoffee } from '@/network/coffee';
import { useNavigate } from "@tanstack/react-router";
import { Button } from '@/components/ui/button';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from 'react';
import { checkIfAdmin } from '@/network/user';
import { Skeleton } from '@/components/ui/skeleton';

export const addCoffeeToCart = async ({
  coffeeId, userId }: {
    coffeeId: number | undefined,
    userId: string | undefined | null,
  }) => {
  if (!userId) return alert('Please login to add to cart')
  await addToCart({ coffeeId, userId });
}

export default function Index() {
  const Navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const deleteCoffeeMutation = useMutation({
    mutationFn: deleteCoffee,
    onSettled: () => queryClient.invalidateQueries({ "queryKey": ["coffeeData"] })
  });
  const { user, isAuthenticated } = useKindeAuth();

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        localStorage.setItem('userId', user?.id || '');
        const { admin } = await checkIfAdmin();
        setIsAdmin(admin);
      })()
    }
  }, [isAuthenticated])

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

  if (coffeeDataPending) return <div className="flex flex-col space-y-3">
    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
  if (coffeeDataError) return 'An error has occurred: ' + coffeeDataError.message

  return (
    <div className="App container">
      <div className="px-3 py-6">
        <div className='flex flex-wrap'>
          {
            coffeeData?.map((coffee: Coffee) => (
              <div className='lg:w-1/4 w-[100%] px-2 py-2' key={coffee.id}>
                <img src={coffee.image} alt={coffee.name} className='rounded-xl object-cover object-center w-[100%] h-[20rem] py-2' />
                <div className='flex flex-col gap-4 items-start'>
                  <h3 className='text-xl'>{coffee.name}</h3>
                  <p className='text-slate-400'>
                    From {coffee.origin}, {coffee.roast} roast, {coffee.flavor} flavor
                  </p>
                  <p>
                    ${coffee.price}
                  </p>

                  <div className='flex gap-2'>
                    <Button
                      onClick={() => { addCoffeeToCart({ coffeeId: coffee.id, userId: user?.id }) }}
                      className='bg-[#0c0c0c] hover:bg-[gray] rounded'>
                      Add to Bag
                    </Button>
                    {
                      isAdmin &&
                      <Button
                        className='bg-[red] hover:bg-[orange] rounded'
                        onClick={() => {
                          if (!coffee.id) return
                          handleDelete(coffee?.id)
                        }}
                      >Delete</Button>
                    }
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div >
  );
}
