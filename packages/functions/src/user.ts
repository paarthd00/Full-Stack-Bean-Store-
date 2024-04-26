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
    try {
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
    } catch (err: any) {
      console.log(err);
      return c.json({ error: err.message });
    }
  },
  isAdmin: async (c: Context) => {
    const headerValue = c.req.header("Authorization");
    const userId = headerValue?.split("Bearer ")[1];
    if (!userId) {
      return c.json({ error: "Unauthorized" });
    }

    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.uuid, userId))
      .then((res) => res[0]);

    if (!currentUser || currentUser.admin === false) {
      return c.json({ error: "Unauthorized" });
    }

    return c.json({ admin: true });
  },
  getAllUsers: async (c: Context) => {
    try {
      const data = await db.select().from(users);
      data.forEach((user) => {
        //@ts-ignore
        delete user.uuid;
      });
      return c.json(data);
    } catch (e: any) {
      return c.json({ error: e.message });
    }
  },
};
