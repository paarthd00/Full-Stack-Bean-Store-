import { Context } from "hono";

export const chatRoute = {
  getResponses: async (c: Context) => {
    const { message } = await c.req.json();
    return c.json({ message });
  },
};
