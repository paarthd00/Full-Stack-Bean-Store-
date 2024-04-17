import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { faqRoute } from "./faq";
import { coffeeRoute } from "./coffee";
import { Context } from "hono";
import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config({
  path: "../../../.env",
});

const app = new Hono();
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API!,
});
export const coffeeIndex = pc.index("coffees");

const route = app.get("/", (c: Context) => {
  return c.json({ message: "Hello Hono!", name: "hi", age: 10 });
});

const FAQRoute = app.post("/faq", faqRoute.getInfo);

const recommendationsCoffeeRoute = app.post(
  "/recommendations",
  coffeeRoute.recommendations
);
const getCoffeesRoute = app.get("/coffees", coffeeRoute.getCoffees);
const addCoffeeRoute = app.post("/add-coffee", coffeeRoute.addCoffee);
const deleteCoffeeRoute = app.post("/delete-coffee", coffeeRoute.deleteCoffee);

export type GetCoffeesRouteType = typeof getCoffeesRoute;
export type AddCoffeeRouteType = typeof addCoffeeRoute;
export type DeleteCoffeeRouteType = typeof deleteCoffeeRoute;
export type recommendationsCoffeeRouteType = typeof recommendationsCoffeeRoute;

export type FAQRouteType = typeof FAQRoute;
export type RouteType = typeof route;

export const handler = handle(app);
