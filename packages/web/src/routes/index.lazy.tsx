import { createLazyFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
export const Route = createLazyFileRoute('/')({
  component: Index,
})
import { getCoffees } from '@/network/coffee';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/main';
import { Coffee, deleteCoffee } from '@/network/coffee';
import { useNavigate } from "@tanstack/react-router";
import { Button } from '@/components/ui/button';
export default function Index() {
  const Navigate = useNavigate();
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
                    </span> {coffee.flavor}
                  </p>
                  <p>
                    <span>
                      <strong>Price:</strong>
                    </span> ${coffee.price}
                  </p>

                  <div className='flex gap-2'>
                    <Button
                      onClick={() => {
                        const cart = localStorage.getItem('cart');
                        const cartObj = cart ? JSON.parse(cart) : [];
                        cartObj.push(coffee);
                        const uniqueCart = cartObj.filter((v: Coffee, i: number, a: Coffee[]) => a.findIndex(t => (t.id === v.id)) === i);
                        localStorage.setItem('cart', JSON.stringify(uniqueCart));
                      }}
                      className='bg-[#0c0c0c] hover:bg-[gray] rounded'>
                      Add to Bag
                    </Button>

                    <Button

                      className='bg-[red] hover:bg-[orange] rounded'
                      onClick={() => {
                        if (!coffee.id) return
                        handleDelete(coffee?.id)
                      }}
                    >Delete</Button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
