import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { cors } from "hono/cors";
const app = new Hono();
import dotenv from "dotenv";
dotenv.config({
  path: "../../../.env",
});

const route = app.get("/", (c) => {
  console.log(process.env.PINECONE_API);
  console.log(process.env.DRIZZLE_DATABASE_URL);
  return c.json({ message: "Hello Hono!", name: "hi", age: 10 });
});

const chatRoute = app.post("/chat", async (c) => {
  const { message } = await c.req.json();
  return c.json({ message });
});

export type ChatRouteType = typeof chatRoute;
export type RouteType = typeof route;

export const handler = handle(app);
