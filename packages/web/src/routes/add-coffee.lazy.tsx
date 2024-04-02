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
import { addCofeeFormSchema } from '../lib/validation';

export const Route = createLazyFileRoute('/add-coffee')({
  component: AddCoffee,
})

export default function AddCoffee() {
  const Navigate = useNavigate();

  const addCofeeForm = useForm<z.infer<typeof addCofeeFormSchema>>({
    resolver: zodResolver(addCofeeFormSchema),
    defaultValues: {
      name: "",
      origin: "",
      price: 0,
    },
  });

  const addCoffeeMutation = useMutation({
    mutationFn: addCoffee,
    onSettled: () => queryClient.invalidateQueries({ "queryKey": ["coffeeData"] })
  });

  const handleSubmit = async (values: z.infer<typeof addCofeeFormSchema>) => {
    const { name, origin, price } = values;
    try {
      addCoffeeMutation.mutate({name, origin, price });
    } catch (error) {
      alert("Error creating post");
    } finally {
      Navigate({ to: "/" });
    }
  };

  return (
    <div className='container flex'>
      <Form {...addCofeeForm}>
        <form
          onSubmit={addCofeeForm.handleSubmit(handleSubmit)}
        >
          <FormField
            control={addCofeeForm.control}
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
            control={addCofeeForm.control}
            name="origin"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                <FormControl>
                  <Textarea className="rounded h-[20rem]" placeholder="origin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addCofeeForm.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-[100%] ">
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    className="rounded"
                    placeholder="price" 
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value !== '' ? Number(value) : undefined);
                    }}
                  />
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
