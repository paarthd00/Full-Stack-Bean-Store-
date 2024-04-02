import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { cors } from "hono/cors";
import dotenv from 'dotenv';
dotenv.config({path: '../../../.env'});

const app = new Hono();

const route = app.get("/", async (c) => {
  console.log(process.env);
  console.log(process.env.PINECONE_API);
  return c.json({ message: "Hello Hono!", name: "hi", age: 10 });
});

const chatRoute = app.post("/chat", async (c) => {
  const { message } = await c.req.json();
  return c.json({ message });
});

export type ChatRouteType = typeof chatRoute;
export type RouteType = typeof route;

export const handler = handle(app);
