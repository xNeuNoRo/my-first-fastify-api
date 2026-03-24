import { Inject, ITransactionManager, neucoreContext } from "@xneunoro/neucore";
import { DatabaseService } from "./DatabaseService";

export class PrismaTxManager implements ITransactionManager {
  @Inject(DatabaseService)
  private readonly db!: DatabaseService;

  /**
   * @description Ejecuta una función dentro de una transacción de Prisma. Este método se encarga de iniciar una transacción, ejecutar la función proporcionada y luego confirmar o revertir la transacción según el resultado de la función. Además, utiliza el contexto de Neucore para almacenar la instancia de la transacción, lo que permite que otros componentes puedan acceder a ella durante la ejecución de la función.
   * @param action Una función asíncrona que contiene la lógica que se desea ejecutar dentro de la transacción. Esta función recibirá una instancia de Prisma Client con la transacción activa, lo que permite realizar operaciones de base de datos que serán parte de la transacción.
   * @returns El resultado de la función proporcionada, que se resolverá una vez que la transacción haya sido confirmada exitosamente. Si la función lanza un error, la transacción será revertida y el error será propagado.
   */
  async runInTransaction<T>(action: () => Promise<T>): Promise<T> {
    return await this.db.client.$transaction(async (tx) => {
      // Almacenamos la instancia de la transacción en el contexto de Neucore
      // para que esté disponible durante la ejecución de la función.
      const store = neucoreContext.getStore();
      if (store) {
        store.set("prisma_tx", tx);
      }

      // Ejecutamos la función proporcionada dentro de la transacción.
      // Si la función lanza un error, Prisma se encargará de hacer rollback automáticamente.
      return await action();
    });
  }
}
