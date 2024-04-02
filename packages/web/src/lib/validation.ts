import * as z from 'zod';

export const addCoffeeFormSchema = z.object({
  name: z.string(),
  origin: z.string(),
  flavor: z.string(),
  roast: z.string(),
});

