import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { cors } from 'hono/cors'
const app = new Hono();

const route = app.get("/", (c) => {
  return c.json({ message: "Hello Hono!", name: "hi", age: 10 });
});

const chatRoute = app.post("/chat", async (c) => {
  const {message} = await c.req.json();
  return c.json({ message });
});

export type ChatRouteType = typeof chatRoute;
export type RouteType = typeof route;

export const handler = handle(app);
