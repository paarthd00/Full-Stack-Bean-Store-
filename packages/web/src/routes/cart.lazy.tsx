import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { stripeCheckout } from '@/network/stripe'
import { loadStripe } from '@stripe/stripe-js';
import { getCartItemsForUser } from '@/network/cart'
import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { Coffee } from '@/network/coffee';
import { updateCart } from '@/network/cart';
import { removeFromCart } from '@/network/cart';

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

  const removeCartItem = async (cartItemId: number) => {
    await removeFromCart({cartItemId});
  }

  const updateCartItemQuantity = async (cartItemId: number, quantity: number) => {
    await updateCart({ cartItemId, quantity });
  }

  useEffect(() => {
    (async () => {
      const userId = user?.id;
      if (!userId) {
        return null;
      }
      const cartItems = await getCartItemsForUser(userId);
      setCart(cartItems);
    })()
  }, [])

  useEffect(() => {
    const total = cart.reduce((acc: number, item) => {
      return acc + (item?.coffees?.price * item?.cartItems?.quantity)
    }, 0)
    setTotal(total)
  }, [cart])

  return (
    <div className='container flex justify-between'>
      <div className='py-4 w-[60%]'>
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
                  <div className='flex gap-2'>
                    <button>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </button>

                    <button 
                      onClick={() => {
                        setCart(cart.splice(cart.indexOf(item), 1));
                        removeCartItem(item?.cartItems?.id);
                      }}
                      className='text-[red]'  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      <div className='py-4 w-[35%]'>
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
