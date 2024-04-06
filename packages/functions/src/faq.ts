import { coffees } from "@Bean-Store/core/db/schema/coffee";
import { like } from "drizzle-orm";
import { Context } from "hono";
import { db } from "@Bean-Store/core/db";
import { or } from "drizzle-orm";
import OpenAI from "openai";
import dotenv from 'dotenv';
import { coffeeIndex } from "./lambda";
import { stringToVector } from "./coffee";
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

    const dataVector = stringToVector(prompt); 
    const vectorResponse = await coffeeIndex.namespace('coffeens').query({
      topK: 2,
      vector: dataVector,
      includeValues: true,
      includeMetadata: true,
    });

    const allResp= await Promise.all(vectorResponse.matches.map(async(match: any) => {
      const resp = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: match?.metadata.name + " " + match?.metadata.flavor + " " + match?.metadata.roast + " get more information about these types of coffees. What are the origin, flavor, notes, temprature and surroundings for the places where these type of coffees are found. "
          },
        ],
        model: "gpt-3.5-turbo",
      });
      return resp.choices[0].message.content;
    }))
    return c.json({data: allResp });
  },
};
