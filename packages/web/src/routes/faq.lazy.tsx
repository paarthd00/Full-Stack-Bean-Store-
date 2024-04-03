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
import { useNavigate } from "@tanstack/react-router";
import { getInfoFormSchema } from '@/lib/validation';
import { useState } from 'react';
import { getInfo } from '@/network';

export default function FAQ() {
  const Navigate = useNavigate();
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
      await getInfo(prompt ); 
      console.log(prompt);
    } catch (error) {
      alert("Error creating post");
    } finally {
      console.log("done");
    }
  };

  return <>
    <Form {...getInfoForm}>
      <form
        onSubmit={getInfoForm.handleSubmit(handleSubmit)}
      >
        <FormField
          control={getInfoForm.control}
          name="prompt"
          render={({ field }) => (
            <FormItem className="w-[100%]">
              <FormControl>
                <Input className="rounded" placeholder="Coffee Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="btn" type="submit">Add New Coffee</Button>
      </form>
    </Form>
    <>{response}</>
  </>
}
