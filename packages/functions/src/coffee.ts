import { db } from "@Bean-Store/core/db";
import { coffees } from "@Bean-Store/core/db/schema/coffee";
import { Context } from "hono";
import { eq } from "drizzle-orm";
import { coffeeIndex } from "./lambda";
import crypto from 'crypto';

export function stringToVector(str: string) {
  const hash = crypto.createHash('sha512');
  hash.update(str);
  const hashedStr = hash.digest('hex');

  let vector = [];
  for (let i = 0; i < hashedStr.length; i += 2) {
    vector.push(parseInt(hashedStr.substr(i, 2), 16));
  }

  vector = Array(8).fill(vector).flat();

  return vector;
}

export const coffeeRoute = {
  getCoffees: async (c: Context) => {
    const data = await db.select().from(coffees);
    return c.json(data);
  },
  addCoffee: async (c: Context) => {
    const coffee = await c.req.json();
    const { name, origin, flavor, roast } = coffee;
    const vectorName = stringToVector(name);
    const vectorOrigin = stringToVector(origin);
    const vectorFlavor = stringToVector(flavor);
    const vectorRoast = stringToVector(roast);
    await coffeeIndex.namespace('coffeens').upsert([
      {
        id: origin,
        values: vectorOrigin,
        metadata: { origin: origin, name: name, flavor: flavor, roast: roast }
      },
      {
        id: name,
        values: vectorName,
        metadata: { origin: origin, name: name, flavor: flavor, roast: roast }
      },
      {
        id: flavor,
        values: vectorFlavor,
        metadata: { origin: origin, name: name, flavor: flavor, roast: roast }
      },
      {
        id: roast,
        values: vectorRoast,
        metadata: { origin: origin, name: name, flavor: flavor, roast: roast }
      }
    ]);

    await db.insert(coffees).values(coffee);
    return c.json(coffee);
  },
  deleteCoffee: async (c: Context) => {
    const { id } = await c.req.json();
    await db.delete(coffees).where(eq(coffees.id, id));
    return c.json({ id });
  },
  recommendations: async (c: Context) => {
    // some logic to get recommendations

    return c.json([]);
  }
};
