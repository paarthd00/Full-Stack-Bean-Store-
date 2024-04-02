import { Context } from "hono";

export const faqRoute = {
  getInfo: async (c: Context) => {
    // some logic to get information about Coffee FAQ

    return c.json({  });
  },
};
