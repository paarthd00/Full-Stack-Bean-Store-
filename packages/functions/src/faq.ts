import { coffees } from "@Bean-Store/core/db/schema/coffee";
import { like } from "drizzle-orm";
import { Context } from "hono";
import { db } from "@Bean-Store/core/db";

export const faqRoute = {
  getInfo: async (c: Context) => {
    const { prompt } = await c.req.json();

    const data = await db.select()
      .from(coffees)
      .where(like(coffees.roast, `%${prompt}%`));

    console.log(data);

    return c.json({ data });
  },
};
