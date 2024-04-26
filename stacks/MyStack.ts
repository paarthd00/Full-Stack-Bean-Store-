import { StackContext, Api, StaticSite, Bucket } from "sst/constructs";

export function API({ stack }: StackContext) {
  const assetsBucket = new Bucket(stack, "Uploads");
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL!,
          PINECONE_API: process.env.PINECONE_API!,
          OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
          URL: process.env.URL!,
        },
        timeout: "60 seconds",
      },
    },

    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /coffees": "packages/functions/src/lambda.handler",
      "POST /faq": "packages/functions/src/lambda.handler",
      "POST /add-coffee": "packages/functions/src/lambda.handler",
      "POST /delete-coffee": "packages/functions/src/lambda.handler",
      "POST /goto-checkout": "packages/functions/src/lambda.handler",
      "POST /get-signed-url": {
        function: {
          environment: {
            ASSETS_BUCKET_NAME: assetsBucket.bucketName,
          },
          handler: "packages/functions/src/lambda.handler",
        },
      },
      "POST /login-or-register": "packages/functions/src/lambda.handler",
      "POST /add-coffee-to-cart": "packages/functions/src/lambda.handler",
      "POST /get-cart-items": "packages/functions/src/lambda.handler",
      "POST /update-cart-item-quantity":
        "packages/functions/src/lambda.handler",
      "POST /remove-coffee-from-cart": "packages/functions/src/lambda.handler",
      "POST /is-admin": "packages/functions/src/lambda.handler",
    },
  });

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_APP_API_URL: api.url,
    },
  });

  api.attachPermissionsToRoute("POST /get-signed-url", [
    assetsBucket,
    "grantPut",
  ]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    WebsiteURL: web.url,
  });
}
