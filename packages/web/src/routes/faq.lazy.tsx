import { createLazyFileRoute } from '@tanstack/react-router'
import { Card } from '@/components/ui/card';
import { Coffee } from '@/network/coffee';
import { useEffect } from 'react';

type FAQResponse = {
  heading: string;
  response: string;
  imageResponse: string;
  aiImage: string;
  coffeeData: Coffee;
}

export const Route = createLazyFileRoute('/faq')({
  component: FAQ,
})

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { getInfoFormSchema } from '@/lib/validation';
import { useState } from 'react';
import { getInfo } from '@/network/coffee';
import SuspenseCards from '@/components/suspense-cards';

export default function FAQ() {
  const [responses, setResponses] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getInfoForm = useForm<z.infer<typeof getInfoFormSchema>>({
    resolver: zodResolver(getInfoFormSchema),
    defaultValues: {
      prompt: ""
    },
  });

  const handleGetInfo = async (prompt: string) => {
    try {
      setIsLoading(true);
      try {
        const resp = await getInfo(prompt)
        if (resp) {
          setIsLoading(false);
          setResponses(resp.allResp);
          localStorage.setItem('Faq', JSON.stringify(resp.allResp)); 
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
    catch (error) {
      console.log(error);
    }
    finally {
      console.log("done");
    }
  }

  const handleSubmit = async (values: z.infer<typeof getInfoFormSchema>) => {
    const { prompt } = values;
    handleGetInfo(prompt);
  };

  useEffect(() => {
    const faq = localStorage.getItem('Faq');
    if (faq) {
      setResponses(JSON.parse(faq));
    }
  }, [])


  return (
    <div className="container py-4">
      <Form {...getInfoForm}>
        <form
          className='py-4 flex gap-2'
          onSubmit={getInfoForm.handleSubmit(handleSubmit)}
        >
          <FormField
            control={getInfoForm.control}
            name="prompt"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                <FormControl>
                  <Input className="rounded" placeholder="Question about coffee" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="btn bg-[#0c0c0c] px-3 py-1 rounded " type="submit">Ask</Button>
        </form>
      </Form>
      <div className='flex gap-2 py-3'>
        {
          ["Medium Roast", "Dark Roast"].map((el, i) => {
            return <Button
              onClick={() => {
                handleGetInfo(el);
              }}
              key={i} className='bg-[#000] rounded hover:bg-[#0c0c0c]'>
              {el}
            </Button>
          })
        }
      </div>

      {
        responses.length > 0 && isLoading === false &&
        <div className='flex gap-3 flex-wrap'>
          {responses?.map((el: FAQResponse, i: number) => {
            console.log(el);
            return <Card key={i} className='p-3 gap-3 lg:w-[47%]'>
              <div>
                <div className='flex justify-between'>
                  <img className="mb-3 w-[45%] rounded" src={el?.imageResponse} alt="" />
                  <img className="mb-3 w-[45%] rounded" src={el.aiImage} alt="" />
                </div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>{el.heading}</AccordionTrigger>
                    <AccordionContent>
                      <p className='py-3'>{el.response}</p>
                      <Button
                        onClick={() => {
                          const cart = localStorage.getItem('cart');
                          const cartObj = cart ? JSON.parse(cart) : [];
                          cartObj.push(el.coffeeData);
                          const uniqueCart = cartObj.filter((v: Coffee, i: number, a: Coffee[]) => a.findIndex(t => (t.id === v.id)) === i);
                          localStorage.setItem('cart', JSON.stringify(uniqueCart));
                        }}
                        className='bg-[#0c0c0c] hover:bg-[gray] rounded'>
                        Add to Bag
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
          })}
        </div>
      }
      {
        isLoading && <SuspenseCards />
      }
    </div>
  )
}
