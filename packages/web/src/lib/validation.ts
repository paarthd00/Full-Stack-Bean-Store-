import * as z from 'zod';

export const addCofeeFormSchema = z.object({
  name: z.string(),
  origin: z.string(),
  price: z.number()
});

