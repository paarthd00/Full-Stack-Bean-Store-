import { StackContext, Api, StaticSite, Bucket, Table } from "sst/constructs";

export function API({ stack }: StackContext) {
  const assetsBucket = new Bucket(stack, "Uploads");
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL!,
          PINECONE_API: process.env.PINECONE_API!,
          OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
        },
        timeout: "30 seconds",
      },
    },

    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /coffees": "packages/functions/src/lambda.handler",
      "POST /faq": "packages/functions/src/lambda.handler",
      "POST /add-coffee": "packages/functions/src/lambda.handler",
      "POST /delete-coffee": "packages/functions/src/lambda.handler",
      "POST /get-signed-url": {
        function: {
          environment: {
            ASSETS_BUCKET_NAME: assetsBucket.bucketName,
          },
          handler: "packages/functions/src/lambda.handler",
        },
      },
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

  api.attachPermissionsToRoute("POST /get-signed-url", [assetsBucket, "grantPut"]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    WebsiteURL: web.url,
  });
}
