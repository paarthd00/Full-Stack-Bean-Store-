import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/add-coffee')({
  component: AddCoffee,
})

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

export default function AddCoffee() {
  const Navigate = useNavigate();

  const addCofeeForm = useForm<z.infer<typeof addCofeeFormSchema >>({
    resolver: zodResolver(addCofeeFormSchema),
    defaultValues: {
      name: "",
      origin: "",
      price: 0,
    },
  });
  /**
  const addPostMutation = useMutation({
    mutationFn: createPost,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["postData"] }),
  });
*/
  const handleSubmit = async (values: z.infer<typeof addCofeeFormSchema>) => {
    const {name, origin, price} = values;
    try {
      console.log({name, origin, price});
      console.log("handle submit");
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
                <FormItem className="w-[100%] ">
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
                      className="rounded" placeholder="price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="btn bg-[#f0f0f0]" type="submit">Add New Coffee</Button>
        </form>
      </Form>
    </div>
  );
}
