import { createLazyFileRoute } from '@tanstack/react-router'
import { addCoffee } from '@/network/coffee';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/main';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { useState } from 'react';

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
import { getSignedUrl } from '@/network/s3';

export const Route = createLazyFileRoute('/add-coffee')({
  component: AddCoffee,
})

export default function AddCoffee() {
  const Navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<File | undefined>(undefined);

  const handleFileChange = (file: File | undefined) => {
    setImage(file);
  }

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const addCoffeeForm = useForm<z.infer<typeof addCoffeeFormSchema>>({
    resolver: zodResolver(addCoffeeFormSchema),
    defaultValues: {
      name: "",
      origin: "",
      price: 1,
      roast: "medium",
      flavor: "citrus",
    },
  });

  const addCoffeeMutation = useMutation({
    mutationFn: addCoffee,
    onSettled: () => queryClient.invalidateQueries({ "queryKey": ["coffeeData"] })
  });

  const handleSubmit = async (values: z.infer<typeof addCoffeeFormSchema>) => {
    const { name, origin, price, flavor, roast } = values;

    const imageSize = image?.size || 0;
    const imageType = image?.type || "";
    const hash = await computeSHA256(image as File);

    const { imageSignedUrl } = await getSignedUrl({
      name,
      origin,
      flavor,
      roast,
      imageSize,
      imageType,
      hash
    });

    console.log(imageSignedUrl.split("?")[0]);

    try {
      await addCoffeeMutation.mutateAsync
        ({
          name,
          origin,
          price,
          flavor,
          roast,
          image: imageSignedUrl.split("?")[0],
        });

      await fetch(imageSignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": imageType,
        },
        body: image
      });

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
            name="price"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                <FormControl>
                  <Input
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value));
                    }}
                    type="number" className="rounded" min={1} placeholder="price" />
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

          <FormField
            control={addCoffeeForm.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                {
                  previewImage && (
                    <img src={previewImage
                    } alt="preview" className="w-24 h-24 object-cover rounded" />
                  )
                }
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    {...field}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (previewImage) {
                        URL.revokeObjectURL(previewImage);
                      }
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setPreviewImage(url);
                        console.log({ file });
                        console.log({ url });
                        handleFileChange(file);
                      } else {
                        setPreviewImage(undefined);
                        handleFileChange(undefined);
                      }
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
