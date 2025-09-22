import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { MessageService } from "./message.service";

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
  constructor(private readonly _MessageService_: MessageService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
