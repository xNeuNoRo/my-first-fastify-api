import fastify from "fastify";
import cors from "@fastify/cors";
import { requestContext } from "./infrastructure/plugins/requestContext.plugin";
import { errorHandler } from "./infrastructure/plugins/errorHandler.plugin";
import { ApiResponse } from "./domain/common/ApiResponse";

export async function buildApp() {
  const app = fastify({
    logger: false,
    http2: true,
  });

  await app.register(requestContext);
  await app.register(errorHandler);
  await app.register(cors, { origin: true });

  app.get("/health", async () => ApiResponse.success(undefined));

  return app;
}
