import { Coffee } from '@/network/coffee'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createLazyFileRoute('/cart')({
  component: () => {
    const [cart, setCart] = useState([])

    useEffect(() => {
      const cart = localStorage.getItem('cart')
      if (cart) {
        setCart(JSON.parse(cart))
      }
    }, [])

    return (
      <div className='container'>
        <div className='py-4'>
          {
            cart.map((item: Coffee) => {
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
      </div>
    )
  }
})