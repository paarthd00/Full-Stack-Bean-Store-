import { Context } from "hono";
import OpenAI from "openai";
import dotenv from "dotenv";
import { createEmbedding } from "./coffee";
import { coffeeIndex } from "./lambda";

dotenv.config({
  path: "../../../.env",
});

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // This is the default and can be omitted
});

export const faqRoute = {
  getInfo: async (c: Context) => {
    const { prompt } = await c.req.json();

    const embeddings = await createEmbedding(prompt);
    const respJSON = await embeddings?.json();
    //@ts-ignore
    const vectorEmbedding = respJSON.data[0]["embedding"];

    const vectorResponse = await coffeeIndex.namespace("coffeens").query({
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

        // const imageResp = await openai.images.generate({
        //   prompt:
        //     match?.metadata.name +
        //     " " +
        //     match?.metadata.origin +
        //     " " +
        //     match?.metadata.flavor +
        //     " " +
        //     match?.metadata.roast +
        //     " coffee please provide an image of this coffee and the place where it is found.",
        //   model: "dall-e-3",
        // });

        return {
          response: resp.choices[0].message.content,
          imageResponse: match?.metadata.image,
        };
      })
    );

    return c.json({ allResp });
  },
};
