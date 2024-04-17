import { createLazyFileRoute } from '@tanstack/react-router'
import { addCoffee } from '@/network';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/main';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { addCoffeeFormSchema } from '../lib/validation';

export const Route = createLazyFileRoute('/add-coffee')({
  component: AddCoffee,
})

export default function AddCoffee() {
  const Navigate = useNavigate();

  const addCoffeeForm = useForm<z.infer<typeof addCoffeeFormSchema>>({
    resolver: zodResolver(addCoffeeFormSchema),
    defaultValues: {
      name: "",
      origin: "",
      roast: "medium",
      flavor: "citrus",
    },
  });

  const addCoffeeMutation = useMutation({
    mutationFn: addCoffee,
    onSettled: () => queryClient.invalidateQueries({ "queryKey": ["coffeeData"] })
  });

  const handleSubmit = async (values: z.infer<typeof addCoffeeFormSchema>) => {
    const { name, origin, flavor, roast } = values;
    try {
      addCoffeeMutation.mutate({ name, origin, flavor, roast });
    } catch (error) {
      alert("Error creating post");
    } finally {
      Navigate({ to: "/" });
    }
  };

  return (
    <div className='container flex'>
      <Form {...addCoffeeForm}>
        <form
          className="flex flex-col w-full gap-2 py-6 px-4"
          onSubmit={addCoffeeForm.handleSubmit(handleSubmit)}
        >
          <FormField
            control={addCoffeeForm.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                <FormControl>
                  <Input className="rounded" placeholder="Coffee Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addCoffeeForm.control}
            name="origin"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                <FormControl>
                  <Input className="rounded" placeholder="origin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addCoffeeForm.control}
            name="flavor"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                <FormControl>
                  <Input className="rounded" placeholder="flavor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addCoffeeForm.control}
            name="roast"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                <FormControl>
                  <Input className="rounded" placeholder="roast" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="btn" type="submit">Add New Coffee</Button>
        </form>
      </Form>
    </div>
  );
}
