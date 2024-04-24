import { Context } from "hono";
import { db } from "@Bean-Store/core/db";
import { cartItems } from "@Bean-Store/core/db/schema/cartItem";
import { eq } from "drizzle-orm";
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
  getCart: {},
};
