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
      <div className='py-4 w-[60%]'>
        {
          cart?.map((item: Coffee) => {
            return (
              <div className='flex gap-4 w-[100%] py-4' key={item.id}>
                <img src={item.image} alt={item.name} className='rounded-full object-cover object-center w-[4rem] h-[4rem]' />
                <div className='flex flex-col gap-4 items-start w-[100%]'>
                  <h3 className='text-xl'>{item.name}</h3>
                  <div className='flex justify-between w-[100%]'>
                    <div className='flex gap-2 text-xl items-center'>
                      <button>
                        -
                      </button>
                      <span className=''>1</span>
                      <button>
                        +
                      </button>
                    </div>
                    <p>${item.price}</p>
                  </div>
                  <div className='flex gap-2'>
                    <button>
                      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M16.794 3.75c1.324 0 2.568.516 3.504 1.451a4.96 4.96 0 010 7.008L12 20.508l-8.299-8.299a4.96 4.96 0 010-7.007A4.923 4.923 0 017.205 3.75c1.324 0 2.568.516 3.504 1.451l.76.76.531.531.53-.531.76-.76a4.926 4.926 0 013.504-1.451"></path></svg>
                    </button>
                    <button>
                      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" stroke-miterlimit="10" stroke-width="1.5" d="M14.25 7.5v12m-4.5-12v12M5.25 6v13.5c0 1.24 1.01 2.25 2.25 2.25h9c1.24 0 2.25-1.01 2.25-2.25V5.25h2.75m-2.75 0H21m-12-3h5.25c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H3"></path></svg>
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
