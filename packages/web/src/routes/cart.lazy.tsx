import { Coffee } from '@/network/coffee'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { stripeCheckout } from '@/network/stripe'
import { loadStripe } from '@stripe/stripe-js';

const RenderCart = () => {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0);

  const handleCheckout = async () => {
    try {
      const response = await stripeCheckout(total);
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

  useEffect(() => {
    const cart = localStorage.getItem('cart')
    if (cart) {
      setCart(JSON.parse(cart))
    }
  }, [])

  useEffect(() => {
    const total = cart.reduce((acc: number, item: Coffee) => {
      return acc + item.price
    }, 0)
    setTotal(total)
  }, [cart])

  return (
    <div className='container flex justify-between'>
      <div className='py-4'>
        {
          cart?.map((item: Coffee) => {
            return (
              <div className='flex gap-4' key={item.id}>
                <img src={item.image} alt={item.name} className='rounded-full object-cover object-center w-[4rem] h-[4rem]' />
                <div className='flex flex-col gap-4 items-start'>
                  <h3 className='text-xl'>{item.name}</h3>
                  <p>${item.price}</p>
                </div>
              </div>
            )
          })
        }
      </div>
      <div className='py-4'>
        <h3 className='text-xl py-4'>Total: ${total}</h3>
        <Button
          onClick={handleCheckout}
          className='bg-[#000] rounded hover:bg-[#0c0c0c] px-3 py-1'
        >Checkout</Button>
      </div>
    </div>
  )
}

export const Route = createLazyFileRoute('/cart')({
  component: () => <RenderCart />
})
