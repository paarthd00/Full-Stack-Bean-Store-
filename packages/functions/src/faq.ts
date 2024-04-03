import { coffees } from "@Bean-Store/core/db/schema/coffee";
import { like } from "drizzle-orm";
import { Context } from "hono";
import { db } from "@Bean-Store/core/db";
import { or } from "drizzle-orm";
import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config({
  path: "../../../.env",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // This is the default and can be omitted
});

export const faqRoute = {
  getInfo: async (c: Context) => {
    const { prompt } = await c.req.json();

    const data = await db.select()
      .from(coffees)
      .where(or(like(coffees.roast, `%${prompt}%`),
        (like(coffees.name, `%${prompt}%`))));

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: data[0]?.name + " " + data[0]?.flavor + " " + data[0]?.roast + " get more information about these types of coffees. What are the origin, flavor, notes, temprature and surroundings for the places where these type of coffees are found. "
        },
      ],
      model: "gpt-3.5-turbo",
    });

    return c.json({ data: chatCompletion.choices[0].message });
  },
};
