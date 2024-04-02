import { db } from "@Bean-Store/core/db";
import { coffees } from "@Bean-Store/core/db/schema/coffee";
import { Context } from "hono";

export const coffeeRoute = {
  getCoffees: async (c: Context) => {
    const data = await db.select().from(coffees);
    return c.json(data);
  },
  addCoffee: async (c: Context) => {
    const coffee = await c.req.json();
    await db.insert(coffees).values(coffee);
    return c.json(coffee);
  },
};
