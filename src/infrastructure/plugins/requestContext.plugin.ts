import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { appContext } from "@/infrastructure/context/appContext";
import fp from "fastify-plugin";

const requestContextPlugin: FastifyPluginAsync = async (
  app: FastifyInstance,
) => {
  // onRequest es la primera fase del ciclo de vida de Fastify. Aquí es donde vamos a inicializar el contexto de la solicitud.
  app.addHook("onRequest", (request, reply, done) => {
    // Obtenemos un ID de solicitud único.
    const requestId =
      (request.headers["x-request-id"] as string) || crypto.randomUUID();

    // Ejecutamos el resto del ciclo de vida de la solicitud dentro del contexto de la aplicación
    appContext.run({ requestId }, () => {
      done();
    });
  });
};

// Exportamos el plugin utilizando fastify-plugin para que pueda ser registrado en la app Fastify.
export const requestContext = fp(requestContextPlugin, {
  name: "request-context-plugin",
});
