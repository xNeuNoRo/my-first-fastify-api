import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "@/infrastructure/prisma/generated/client";
import {
  Injectable,
  Inject,
  LOGGER_TOKEN,
  LoggerContract,
  createTransactionProxy,
} from "@xneunoro/neucore";

@Injectable()
export class DatabaseService {
  public readonly client: PrismaClient;

  @Inject(LOGGER_TOKEN)
  private readonly logger!: LoggerContract;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL no está definida en las variables de entorno",
      );
    }

    // Creamos una instancia del adaptador de Prisma para PostgreSQL utilizando
    // la URL de conexión desde las variables de entorno
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    // Inicializamos el cliente de Prisma
    const rawClient = new PrismaClient({
      adapter,
      log: [
        { emit: "event", level: "query" },
        { emit: "event", level: "error" },
        { emit: "event", level: "warn" },
      ],
    });

    // Creamos un proxy alrededor del cliente de Prisma
    // para manejar automáticamente las transacciones utilizando el contexto de Neucore
    this.client = createTransactionProxy(rawClient);
  }

  /**
   * @description Método para conectar el cliente de Prisma a la base de datos.
   * Este método se encarga de establecer la conexión inicial y configurar los listeners para loguear consultas y errores.
   * @example
   * // Ejemplo de uso:
   * await databaseService.connect();
   * @returns Promise<void> que se resuelve cuando la conexión a la base de datos ha sido establecida exitosamente.
   * @throws Lanza un error si ocurre algún problema al conectar con la base de datos, el error incluirá detalles para facilitar el debugging.
   */
  public async connect(): Promise<void> {
    try {
      this.logger.info(
        "🟢 Conexión a la base de datos establecida (Prisma Adapter PG)",
      );

      (this.client as any).$on("query", (e: Prisma.QueryEvent) => {
        if (e.duration >= 100) {
          this.logger.warn(`[Prisma] Slow Query (${e.duration}ms): ${e.query}`);
        } else {
          this.logger.debug(`[Prisma] ${e.query}`);
        }
      });

      (this.client as any).$on("error", (e: Prisma.LogEvent) => {
        this.logger.error(`[Prisma Error] ${e.message}`, { target: e.target });
      });
    } catch (error) {
      this.logger.error("🔴 Error fatal al conectar con Prisma", { error });
      throw error;
    }
  }

  /**
   * @description Método para desconectar el cliente de Prisma y cerrar el Pool de PostgreSQL.
   * @example
   * // Ejemplo de uso:
   * await databaseService.disconnect();
   * @returns Promise<void> que se resuelve cuando la conexión a la base de datos ha sido cerrada exitosamente.
   * @throws Lanza un error si ocurre algún problema al desconectar el cliente de Prisma o al cerrar el Pool, el error incluirá detalles para facilitar el debugging.
   */
  public async disconnect(): Promise<void> {
    await this.client.$disconnect();
    this.logger.info("Conexión a la base de datos cerrada.");
  }

  /**
   * @description Método para ejecutar consultas SQL raw utilizando el cliente de Prisma.
   * @param query La consulta SQL a ejecutar, puede contener placeholders para parámetros.
   * @param params Opcionalmente, un array de parámetros que serán interpolados en la consulta SQL.
   * @example
   * // Ejemplo de uso:
   * const users = await databaseService.query<User>("SELECT * FROM users WHERE age > $1", [18]);
   * @returns Promise<T> que se resuelve con el resultado de la consulta,
   * tipado según el tipo genérico T proporcionado al llamar al método.
   */
  public async query<T>(query: string, params?: unknown[]): Promise<T> {
    try {
      const result = await this.client.$queryRawUnsafe(
        query,
        ...(params || []),
      );
      return result as T;
    } catch (error) {
      this.logger.error("Error al ejecutar consulta raw", {
        query,
        params,
        error,
      });
      throw error;
    }
  }

  /**
   * @description Método para limpiar la base de datos truncando todas las tablas (excepto migraciones).
   * Útil para tests de integración que requieren un estado limpio de la base de datos.
   * Este método es seguro para usar en entornos de desarrollo y testing, pero lanzará un error si se intenta ejecutar en producción.
   * @example
   * // Ejemplo de uso:
   * await databaseService.cleanDatabase();
   * @returns Promise<void> que se resuelve cuando la base de datos ha sido limpiada exitosamente.
   * @throws Lanza un error si se intenta ejecutar en producción, o si ocurre algún problema al truncar las tablas, el error incluirá detalles para facilitar el debugging.
   */
  public async cleanDatabase(): Promise<void> {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Intento de borrado de base de datos en producción bloqueado.",
      );
    }

    // Obtenemos los nombres de todas las tablas en el esquema público,
    // excluyendo la tabla de migraciones de Prisma
    const tablenames = await this.client.$queryRaw<
      Array<{ tablename: string }>
    >`
      SELECT tablename FROM pg_tables WHERE schemaname='public'
    `;

    // Construimos una lista de tablas formateada para la consulta de truncado
    const tables = tablenames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== "_prisma_migrations")
      .map((name) => `"public"."${name}"`)
      .join(", ");

    if (tables.length > 0) {
      await this.client.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
      this.logger.debug("Base de datos limpiada para testing.");
    }
  }
}
