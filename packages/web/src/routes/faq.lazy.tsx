import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/faq')({
  component: FAQ,
})

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { getInfo } from '@/network';

export default function FAQ() {
  const [response, setResponse] = useState<string>("");
  const getInfoForm = useForm<z.infer<typeof getInfoFormSchema>>({
    resolver: zodResolver(getInfoFormSchema),
    defaultValues: {
      prompt: ""
    },
  });

  const handleSubmit = async (values: z.infer<typeof getInfoFormSchema>) => {
    const { prompt} = values;
    try {
      const resp = await getInfo(prompt); 
      setResponse(resp.data.content);
    } catch (error) {
      alert("Error creating post");
    } finally {
      console.log("done");
    }
  };

  return (
    <div className="container">
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
      <>{response}</>
    </div>
  )
}
