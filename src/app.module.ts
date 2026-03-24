import { Module } from "@xneunoro/neucore";
import { DatabaseService } from "./infrastructure/database/DatabaseService";
import path from "node:path";

@Module({
  // Autodescubrimiento de módulos. La Factory escaneará recursivamente el directorio base
  // y registrará automáticamente los módulos encontrados. Esto permite una arquitectura modular
  // y escalable sin necesidad de importar manualmente cada módulo en el módulo raíz.
  autoDiscoverModules: {
    baseDir: path.join(import.meta.dirname, "modules"),
  },
  // Forma tradicional:
  // imports: [BookModule, AnotherModule], --- IGNORE ---
  providers: [DatabaseService], // Servicios globales de infraestructura
})
export class AppModule {}
