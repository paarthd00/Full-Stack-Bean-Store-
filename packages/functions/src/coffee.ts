import { db } from "@Bean-Store/core/db";
import { coffees } from "@Bean-Store/core/db/schema/coffee";
import { Context } from "hono";
import { eq } from "drizzle-orm";
import { coffeeIndex } from "./lambda";
import { v4 as uuidv4 } from "uuid";
import { openai } from "./faq";

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
    console.log({ coffee });

    const { name, origin, flavor, roast } = coffee;

    const stringPrompt = `${name} ${origin} ${flavor} ${roast} `;
    const embeddings = await createEmbedding(stringPrompt);

    const respJSON = await embeddings?.json();
    //@ts-ignore
    const vectorEmbedding = respJSON.data[0]["embedding"];

    // const imageResp = await openai.images.generate({
    //   prompt:
    //     name +
    //     " " +
    //     origin +
    //     " " +
    //     flavor +
    //     " " +
    //     roast +
    //     " roast coffee please provide an image of this coffee and the place where it is found.",
    //   model: "dall-e-3",
    // });

    // coffee.image = imageResp.data[0].url;

    const id = uuidv4();

    await coffeeIndex.namespace("coffeens").upsert([
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
  },
  deleteCoffee: async (c: Context) => {
    const { id } = await c.req.json();

    const deletedCoffee = await db
      .delete(coffees)
      .where(eq(coffees.id, id))
      .returning({ uuid: coffees.uuid })
      .then((el) => el[0]);

    console.log({ deletedCoffee });
    if (deletedCoffee.uuid) {
      await coffeeIndex.namespace("coffeens")._deleteOne(deletedCoffee.uuid);
    }

    return c.json({ id });
  },
  recommendations: async (c: Context) => {
    // some logic to get recommendations

    return c.json([]);
  },
};
