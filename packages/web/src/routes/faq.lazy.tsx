import { createLazyFileRoute } from '@tanstack/react-router'
import { Card } from '@/components/ui/card';
import { Coffee } from '@/network/coffee';


type FAQResponse = {
  heading: string;
  response: string;
  imageResponse: string;
  aiImage: any;
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

export default function FAQ() {
  const [responses, setResponses] = useState<[]>([]);
  const getInfoForm = useForm<z.infer<typeof getInfoFormSchema>>({
    resolver: zodResolver(getInfoFormSchema),
    defaultValues: {
      prompt: ""
    },
  });

  const handleGetInfo = async (prompt: string) => {
    try {
      const resp = await getInfo(prompt);
      setResponses(resp.allResp);
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
        responses.length > 0 &&
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
                      {el.response}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
          })
          }
        </div>
      }
    </div>
  )
}
