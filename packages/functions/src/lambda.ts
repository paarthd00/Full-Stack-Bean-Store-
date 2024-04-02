import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { db } from "@Bean-Store/core/db/index"
import { coffees } from "@Bean-Store/core/db/schema/coffee"

const app = new Hono();
import dotenv from "dotenv";
dotenv.config({
  path: "../../../.env",
});

const route = app.get("/", (c) => {
  return c.json({ message: "Hello Hono!", name: "hi", age: 10 });
});

const chatRoute = app.post("/chat", async (c) => {
  const { message } = await c.req.json();
  return c.json({ message });
});

const addCoffeeRoute = app.post("/add-coffee", async (c) => {
  const coffee = await c.req.json();
  await db.insert(coffees).values(coffee);
  return c.json(coffee);
});

export type AddCoffeeRouteType = typeof addCoffeeRoute;
export type ChatRouteType = typeof chatRoute;
export type RouteType = typeof route;

export const handler = handle(app);
