import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { stripeCheckout } from '@/network/stripe'
import { loadStripe } from '@stripe/stripe-js';
import { getCartItemsForUser } from '@/network/cart'
import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { Coffee } from '@/network/coffee';
import { updateCart } from '@/network/cart';
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from '@tanstack/react-query';

const RenderCart = () => {
  const [cart, setCart] = useState<
    {
      cartItems: {
        id: number;
        userId: number;
        coffeeId: number;
        quantity: number;
      },
      coffees: Coffee
    }[]>([])

  const [total, setTotal] = useState(0);

  const { user } = useKindeAuth();

  const handleCheckout = async () => {
    try {
      const response = await stripeCheckout(total + 10);
      console.log({ response });
      const sessionId = response.id;
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        return;
      }
      await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

    } catch (err) {
      console.error(err);
    }
  };

  const updateCartItemQuantity = async (cartItemId: number, quantity: number) => {
    await updateCart({ cartItemId, quantity });
  }

  const { isPending, error, data: cartData } = useQuery({
    queryKey: ['cartData'],
    queryFn: () => getCartItemsForUser(user?.id || ''),
  })

  useEffect(() => {
    setCart(cartData)
    const total = cartData?.reduce((acc: number, item) => {
      return acc + (item?.coffees?.price * item?.cartItems?.quantity)
    }, 0)
    setTotal(total)
  }, [cartData])
  {

    isPending && <div className="flex items-center space-x-4 bg-[orange]">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  }
  {
    error && <div>An error has occurred: {error.message}</div>
  }

  return (
    <div className='container flex justify-between flex-wrap'>
      <div className='py-4 lg:w-[60%] w-[100%]'>
        {
          cart?.map((item) => {
            const itemTotal = item?.coffees?.price * item?.cartItems?.quantity;
            return (
              <div className='flex gap-4 w-[100%] py-4' key={item?.coffees?.id}>
                <img src={item?.coffees?.image} alt={item?.coffees?.name} className='rounded-full object-cover object-center w-[4rem] h-[4rem]' />
                <div className='flex flex-col gap-4 items-start w-[100%]'>
                  <h3 className='text-xl'>{item?.coffees?.name}</h3>
                  <div className='flex justify-between w-[100%]'>
                    <div className='flex gap-2 text-xl items-center'>
                      <button
                        onClick={() => {
                          const quantity = item?.cartItems?.quantity;
                          if (quantity === 1) {
                            setCart(cart.splice(cart.indexOf(item), 1));
                          }
                          setCart(cart.map((cartItem) => {
                            if (cartItem?.cartItems?.id === item?.cartItems?.id) {
                              return {
                                ...cartItem,
                                cartItems: {
                                  ...cartItem?.cartItems,
                                  quantity: quantity - 1
                                }
                              }
                            }
                            return cartItem;
                          }))
                          updateCartItemQuantity(item?.cartItems?.id, item?.cartItems?.quantity - 1)
                        }}
                      >
                        -
                      </button>
                      <span className=''>{item?.cartItems?.quantity}</span>
                      <button
                        onClick={() => {
                          const quantity = item?.cartItems?.quantity;
                          setCart(cart.map((cartItem) => {
                            if (cartItem?.cartItems?.id === item?.cartItems?.id) {
                              return {
                                ...cartItem,
                                cartItems: {
                                  ...cartItem?.cartItems,
                                  quantity: quantity + 1
                                }
                              }
                            }
                            return cartItem;
                          }))

                          updateCartItemQuantity(item?.cartItems?.id, item?.cartItems?.quantity + 1)
                        }}
                      >
                        +
                      </button>
                    </div>
                    <p>${itemTotal}</p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      <div className='py-4 lg:w-[35%] w-[100%]'>
        <h2 className='text-2xl py-4'>
          Summary
        </h2>
        <div className='flex justify-between '>
          <span>
            Subtotal
          </span>
          <span>
            ${total}
          </span>
        </div>
        <div className='flex justify-between py-2'>
          <span>
            Shipping
          </span>
          <span>
            $10
          </span>
        </div>
        <hr />
        <div className='flex justify-between py-2'>
          <span>
            Total
          </span>
          <span>
            ${total + 10}
          </span>
        </div>
        <Button
          onClick={handleCheckout}
          className='bg-[#000] rounded-xl hover:bg-[#0c0c0c] px-3 mt-6 w-[100%]'
        >Checkout</Button>
      </div>
    </div>
  )
}

export const Route = createLazyFileRoute('/cart')({
  component: () => <RenderCart />
})
