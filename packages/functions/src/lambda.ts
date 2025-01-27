import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { faqRoute } from "./faq";
import { coffeeRoute } from "./coffee";
import { Context } from "hono";
import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
import { stripeRoute } from "./stripe";
import { s3Route } from "./s3";
import { userRoute } from "./user";
import { cartRoute } from "./cart";
import { adminAuthorizationMiddleware } from "./middleware/admin-authorization";
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

const getCoffeesRoute = app.get("/coffees", coffeeRoute.getCoffees);
const addCoffeeRoute = app.post(
  "/add-coffee",
  adminAuthorizationMiddleware,
  coffeeRoute.addCoffee
);
const deleteCoffeeRoute = app.post(
  "/delete-coffee",
  adminAuthorizationMiddleware,
  coffeeRoute.deleteCoffee
);

const FAQRoute = app.post("/faq", faqRoute.getInfo);

const getSignedUrlRoute = app.post("/get-signed-url", s3Route.getSignedUrl);

const gotoCheckoutRoute = app.post("/goto-checkout", stripeRoute.gotoCheckout);

const addCoffeeToCartRoute = app.post(
  "/add-coffee-to-cart",
  cartRoute.addToCart
);

const getCartItemsRoute = app.post("/get-cart-items", cartRoute.getCartItems);

const updateCartItemQuantityRoute = app.post(
  "/update-cart-item-quantity",
  cartRoute.updateCart
);

const removeFromCartRoute = app.post(
  "/remove-coffee-from-cart",
  cartRoute.removeFromCart
);

const loginOrRegisterRoute = app.post(
  "/login-or-register",
  userRoute.loginOrRegister
);

const isAdminRoute = app.post("/is-admin", userRoute.isAdmin);
const getAllUsersRoute = app.get(
  "/users",
  adminAuthorizationMiddleware,
  userRoute.getAllUsers
);

export type GetCoffeesRouteType = typeof getCoffeesRoute;
export type AddCoffeeRouteType = typeof addCoffeeRoute;
export type DeleteCoffeeRouteType = typeof deleteCoffeeRoute;
export type GetSignedUrlRouteType = typeof getSignedUrlRoute;
export type GotoCheckoutRouteType = typeof gotoCheckoutRoute;
export type LoginOrRegisterRouteType = typeof loginOrRegisterRoute;
export type AddCoffeeToCartRouteType = typeof addCoffeeToCartRoute;
export type GetCartItemsRouteType = typeof getCartItemsRoute;
export type UpdateCartItemQuantityRouteType =
  typeof updateCartItemQuantityRoute;
export type RemoveFromCartRouteType = typeof removeFromCartRoute;
export type IsAdminRouteType = typeof isAdminRoute;
export type GetAllUsersRouteType = typeof getAllUsersRoute;

export type FAQRouteType = typeof FAQRoute;
export type RouteType = typeof route;

export const handler = handle(app);
