import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { chatRoute } from "./chat";
import { coffeeRoute } from "./coffee";
import { Context } from "hono";
import dotenv from "dotenv";

const app = new Hono();

dotenv.config({
  path: "../../../.env",
});

const route = app.get("/", (c: Context) => {
  return c.json({ message: "Hello Hono!", name: "hi", age: 10 });
});

const getChatRoute = app.post("/chat", chatRoute.getResponses);
const getCoffeesRoute = app.get("/coffees", coffeeRoute.getCoffees);
const addCoffeeRoute = app.post("/add-coffee", coffeeRoute.addCoffee);

export type GetCoffeesRouteType = typeof getCoffeesRoute;
export type AddCoffeeRouteType = typeof addCoffeeRoute;
export type ChatRouteType = typeof getChatRoute;
export type RouteType = typeof route;

export const handler = handle(app);
