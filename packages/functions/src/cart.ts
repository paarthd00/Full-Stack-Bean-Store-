import { Context } from "hono";
import { db } from "@Bean-Store/core/db";
import { cartItems } from "@Bean-Store/core/db/schema/cartItem";
import { eq, and } from "drizzle-orm";
import { users } from "@Bean-Store/core/db/schema/user";

export const cartRoute = {
  addToCart: async (c: Context) => {
    try {
      const { coffeeId, userId } = await c.req.json();
      console.log({ coffeeId, userId });

      const currentUserID = await db
        .select()
        .from(users)
        .where(eq(users.uuid, userId))
        .then((data) => data[0].id);

      const cartCoffee = await db
        .select()
        .from(cartItems)
        .where(and(eq(cartItems.userId, currentUserID), eq(cartItems.coffeeId, coffeeId)))
        .then((data) => data[0]);
    
      console.log({ cartCoffee });

      if (cartCoffee && cartCoffee.quantity) {
        const data = await db
          .update(cartItems)
          .set({ quantity: cartCoffee.quantity + 1 })
          .where(and(eq(cartItems.userId, currentUserID), eq(cartItems.coffeeId, coffeeId)));
        return c.json({ data });
      }

      const data = await db.insert(cartItems).values({
        coffeeId,
        userId: currentUserID,
        quantity: 1,
      });

      return c.json({ data });
    } catch (e: any) {
      return c.json({ error: e.message });
    }
  },
  removeFromCart: {},
  emptyCart: {},
  getCartItems: async (c: Context) => {
    try {
      const { userId } = await c.req.json();
      console.log({ userId });
      return c.json(userId);
    } catch (e: any) {
      return c.json({ error: e.message });
    }
  },
};
