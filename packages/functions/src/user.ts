import { Context } from "hono";
import dotenv from "dotenv";
import { db } from "@Bean-Store/core/db";
import { eq } from "drizzle-orm";
import { users } from "@Bean-Store/core/db/schema/user";
dotenv.config({
  path: "../../../.env",
});

export const userRoute = {
  loginOrRegister: async (c: Context) => {
    const { user } = await c.req.json();
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.uuid, user.id));
    user.uuid = user.id;
    user.name = user.family_name + " " + user.given_name;
    delete user.id;
    if (existingUser.length === 0) {
      await db.insert(users).values(user);
    }
    console.log({ user });
    return c.json({ user });
  },
};
