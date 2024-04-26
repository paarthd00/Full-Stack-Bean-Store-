import { Context, Next } from "hono";
import { db } from "@Bean-Store/core/db";
import { users } from "@Bean-Store/core/db/schema/user";
import { eq } from "drizzle-orm";

export const adminAuthorizationMiddleware = async (c: Context, next: Next) => {
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

  await next();
};
