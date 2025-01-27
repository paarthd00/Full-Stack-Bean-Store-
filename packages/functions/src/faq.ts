import { Context } from "hono";
import OpenAI from "openai";
import dotenv from "dotenv";
import { createEmbedding } from "./coffee";
import { coffeeIndex } from "./lambda";
import { db } from "@Bean-Store/core/db";
import { coffees } from "@Bean-Store/core/db/schema/coffee";
import { eq } from "drizzle-orm";
dotenv.config({
  path: "../../../.env",
});

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const faqRoute = {
  getInfo: async (c: Context) => {
    try {
      const { prompt } = await c.req.json();

      const embeddings = await createEmbedding(prompt);
      const respJSON = await embeddings?.json();
      //@ts-ignore
      const vectorEmbedding = respJSON.data[0]["embedding"];

      const vectorResponse = await coffeeIndex.namespace("coffees").query({
        topK: 2,
        vector: vectorEmbedding,
        includeValues: true,
        includeMetadata: true,
      });

      const allResp = await Promise.all(
        vectorResponse.matches.map(async (match: any) => {
          const resp = await openai.chat.completions.create({
            messages: [
              {
                role: "user",
                content:
                  match?.metadata.name +
                  " " +
                  match?.metadata.origin +
                  " " +
                  match?.metadata.flavor +
                  " " +
                  match?.metadata.roast +
                  " coffee" +
                  " get more information about these types of coffees. What are the origin, flavor, notes, temprature and surroundings for the places where these type of coffees are found. ",
              },
            ],
            model: "gpt-3.5-turbo",
          });

          const imageResp = await openai.images.generate({
            prompt:
              match?.metadata.name +
              " " +
              match?.metadata.origin +
              " " +
              match?.metadata.flavor +
              " " +
              match?.metadata.roast +
              " coffee please provide an image of this coffee and the place where it is found.",
            model: "dall-e-3",
          });

          const coffeeData = await db
            .select()
            .from(coffees)
            .where(eq(coffees.uuid, match.id));

          return {
            heading: match?.metadata.name,
            response: resp.choices[0].message.content,
            aiImage: imageResp.data[0].url,
            imageResponse: match?.metadata.image,
            coffeeData: coffeeData[0],
          };
        })
      );

      return c.json({ allResp });
    } catch (e: any) {
      console.log(e);
      return c.json({ error: e.message });
    }
  },
};
