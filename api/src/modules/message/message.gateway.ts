import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageService } from "./message.service";
import { SendMessageDto } from "./dto/send-message.dto";
import { UsePipes, ValidationPipe } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: process.env.ORIGIN,
    methods: ["POST", "GET", "PATCH", "DELETE"],
  },
  namespace: "message",
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly _MessageService_: MessageService) {}

  async handleConnection(client: Socket) {
    const room_id = client.handshake.query.room_id as string;

    if (room_id !== undefined) {
      await client.join(room_id);
      console.log(`Client ${client.id} joined room: ${room_id}`);
    } else {
      console.log(`Client ${client.id} connected without room_id`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("send-message")
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessageDto
  ) {
    try {
      const message = await this._MessageService_.sendMessage(payload);

      this.server
        .to(String(payload.room_id))
        .emit("send-message-success", { message });
    } catch (error) {
      console.error(error);
      client.emit("send-message-error", { message: (error as Error).message });
    }
  }
}
