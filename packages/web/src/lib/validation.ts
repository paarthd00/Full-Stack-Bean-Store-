import * as z from 'zod';

export const getInfoFormSchema = z.object({
  prompt: z.string(),
});

export const addCoffeeFormSchema = z.object({
  name: z.string(),
  origin: z.string(),
  flavor: z.string(),
  roast: z.string(),
  image: z.any(),
});

