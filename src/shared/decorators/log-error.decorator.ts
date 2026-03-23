import { logger } from "@/config/logger.config";

/**
 * @description Decorador de método para capturar y loguear errores de manera estructurada utilizando el logger configurado.
 * @param target El método original al que se le aplicará el decorador.
 * Este es el método que se ejecutará cuando se llame al método decorado.
 * @param context El contexto del decorador, que proporciona información sobre el método al que se está aplicando el decorador, como su nombre, si es estático o no, etc.
 * @returns Una función que envuelve el método original, capturando cualquier error
 * que ocurra durante su ejecución y logueándolo de manera estructurada utilizando el logger configurado.
 */
export function LogError<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >,
) {
  // Obtenemos el nombre del método para el que se está aplicando el decorador
  const methodName = String(context.name);

  // ClassMethodDecoratorContext propiedades:
  // - kind: es el tipo de miembro de clase al que se aplica el decorador (método, propiedad, etc.)
  // - name: es el nombre del miembro de clase al que se aplica el decorador
  // - static: indica si el miembro es estático o no
  // - private: indica si el miembro es privado o no
  // - access: proporciona información sobre el acceso al miembro (get, set, etc.)
  // - addInitializer: función para agregar inicializadores que se ejecutarán después de la creación de la clase

  if (context.kind !== "method") {
    throw new SyntaxError(
      `@LogError solo puede ser aplicado a métodos. Contexto actual: '${context.kind}'`,
    );
  }

  return function (this: This, ...args: Args): Return {
    try {
      // Intentamos ejecutar el método original con los argumentos proporcionados
      const result = target.apply(this, args);

      // Verificamos si el resultado es una promesa (para métodos asíncronos)
      if (result instanceof Promise) {
        return result.catch((err) => {
          captureError(err, methodName, args);
          throw err; // Re-lanzamos el error después de capturarlo
        }) as Return;
      }

      // Si el resultado no es una promesa, simplemente lo devolvemos
      return result;
    } catch (error) {
      // Capturamos cualquier error que ocurra durante la ejecución del método
      captureError(error, methodName, args);
      throw error; // Re-lanzamos el error después de capturarlo
    }
  };
}

/**
 * @description Función auxiliar para capturar y loguear errores de manera estructurada
 * utilizando el logger configurado. Esta función se encarga de registrar el error
 * junto con el nombre del método y los argumentos que causaron el error, proporcionando
 * así un contexto completo para facilitar la depuración.
 * @param error El error que se ha capturado, puede ser de cualquier tipo (Error, string, objeto, etc.)
 * @param method El nombre del método donde ocurrió el error, utilizado para identificar el origen del problema en los logs.
 * @param args Los argumentos que se pasaron al método cuando ocurrió el error, lo que ayuda a entender el contexto en el que se produjo el error.
 */
function captureError(error: unknown, method: string, args: unknown[]) {
  logger.error(
    {
      method,
      args,
      err:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : error,
    },
    `Ha ocurrido un error en el método ${method}`,
  );
}
