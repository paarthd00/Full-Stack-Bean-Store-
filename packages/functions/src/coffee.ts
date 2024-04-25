import { db } from "@Bean-Store/core/db";
import { coffees } from "@Bean-Store/core/db/schema/coffee";
import { Context } from "hono";
import { eq } from "drizzle-orm";
import { coffeeIndex } from "./lambda";
import { v4 as uuidv4 } from "uuid";

export async function createEmbedding(text: string) {
  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        input: text,
        model: "text-embedding-3-small",
      }),
    });

    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
export const coffeeRoute = {
  getCoffees: async (c: Context) => {
    try {
      const data = await db.select().from(coffees);
      return c.json(data);
    } catch (e: any) {
      return c.json({ error: e.message });
    }
  },
  addCoffee: async (c: Context) => {
    const coffee = await c.req.json();

    const { name, origin, flavor, roast } = coffee;

    const stringPrompt = `${name} ${origin} ${flavor} ${roast} `;
    const embeddings = await createEmbedding(stringPrompt);

    const respJSON = await embeddings?.json();
    //@ts-ignore
    const vectorEmbedding = respJSON.data[0]["embedding"];

    const id = uuidv4();
    try {
      await coffeeIndex.namespace("coffees").upsert([
        {
          id: id,
          values: vectorEmbedding,
          metadata: {
            name: name,
            origin: origin,
            flavor: flavor,
            roast: roast,
            image: coffee.image,
          },
        },
      ]);
      coffee.uuid = id;
      await db.insert(coffees).values(coffee);
      return c.json(coffee);
    } catch (e: any) {
      console.log(e);
      return c.json({ error: e.message });
    }
  },
  deleteCoffee: async (c: Context) => {
    const { id } = await c.req.json();
    try {
      const deletedCoffee = await db
        .delete(coffees)
        .where(eq(coffees.id, id))
        .returning({ uuid: coffees.uuid })
        .then((el) => el[0]);

      if (deletedCoffee.uuid) {
        await coffeeIndex.namespace("coffees")._deleteOne(deletedCoffee.uuid);
      }

      return c.json({ id });
    } catch (e: any) {
      console.log(e);
      return c.json({ error: e.message });
    }
  },
};
