import { db } from "@Bean-Store/core/db";
import { coffees } from "@Bean-Store/core/db/schema/coffee";
import { Context } from "hono";
import { eq } from "drizzle-orm";
import { coffeeIndex } from "./lambda";

export async function createEmbedding(text: string) {
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
}
export const coffeeRoute = {
  getCoffees: async (c: Context) => {
    const data = await db.select().from(coffees);
    return c.json(data);
  },
  addCoffee: async (c: Context) => {
    const coffee = await c.req.json();
    const { name, origin, flavor, roast } = coffee;

    const stringPrompt = `${name} ${origin} ${flavor} ${roast}`;
    const embeddings = await createEmbedding(stringPrompt);

    const respJSON = await embeddings?.json();

    //@ts-ignore
    const vectorEmbedding = respJSON.data[0]["embedding"];

    await coffeeIndex.namespace("coffeens").upsert([
      {
        id: origin,
        values: vectorEmbedding,
        metadata: { name: name, origin: origin, flavor: flavor, roast: roast },
      },
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
  },
};
