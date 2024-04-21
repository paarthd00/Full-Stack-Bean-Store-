import { Context } from "hono";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config({
  path: "../../../.env",
});

export const stripeRoute = {
  gotoCheckout: async (c: Context) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-04-10",
    });
    const { total } = await c.req.json();

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Coffees",
              },
              unit_amount: total * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `https://localhost:5173/`,
        cancel_url: `https://localhost:5173/cart`,
      });

      return c.json({ id: session.id });
    } catch (err) {
      //@ts-ignore
      return c.json({ error: err.message });
    }
  },
};
