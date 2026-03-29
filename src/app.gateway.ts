import {
  UseParams,
  getLogger,
  WsPayload,
  Socket,
  WebSocketGateway,
  SubscribeMessage,
  OnConnect,
  OnDisconnect,
  OnMessage,
} from "@neunoro/fastify-kit";

// Simulamos un servicio inyectable para probar la inyección de dependencias (DI)
class WsGreetingService {
  getGreeting(name: string) {
    return `¡Hola ${name}! Este mensaje viene desde el servicio DI.`;
  }
}

@WebSocketGateway({
  // Opcional: Podrías inyectar tu JsonWsAdapter aquí si quisieras
  path: "/ws/test",
})
export class AppGateway {
  // Inyectamos nuestro servicio falso
  constructor(private readonly greetingService: WsGreetingService) {
    this.greetingService = new WsGreetingService(); // En un caso ideal, se haria con @Injectable y @Inject
  }

  // Se ejecuta automáticamente en cuanto el cliente establece la conexión
  @OnConnect()
  @UseParams(Socket())
  handleConnection(socket: any) {
    getLogger().info("🟢 [AppGateway] Nuevo cliente conectado");
    socket.send(
      JSON.stringify({
        event: "SERVER_WELCOME",
        data: "¡Conexión establecida exitosamente con el Gateway de prueba!",
      }),
    );
  }

  // Se ejecuta automáticamente cuando el cliente cierra el navegador/conexión
  @OnDisconnect()
  handleDisconnect() {
    getLogger().info("🔴 [AppGateway] Un cliente se ha desconectado");
  }

  // Prueba del flujo normal JSON.
  // El cliente debe enviar: {"event": "SALUDAR", "data": "Angel"}
  @SubscribeMessage("SALUDAR")
  @UseParams(WsPayload(), Socket())
  async handleSaludo(payload: string, _socket: any) {
    getLogger().info(
      `📥 [AppGateway] Recibido evento SALUDAR con payload: ${payload}`,
    );

    // Probamos el servicio inyectado
    const greeting = this.greetingService.getGreeting(payload);

    // Al retornar un valor, FastifyKit lo enviará de vuelta automáticamente
    // bajo el mismo patrón "SALUDAR"
    return greeting;
  }

  // Prueba de la "Manguera Cruda" (Firehose).
  // Atrapa cualquier mensaje que no sea un JSON válido o que no tenga un "event" definido.
  @OnMessage()
  @UseParams(WsPayload())
  handleRawMessage(payload: any) {
    getLogger().info(`🔥 [AppGateway] Manguera Cruda atrapó: ${payload}`);
    return `CRUDO_ECHO: Recibí el texto -> ${payload}`;
  }
}
