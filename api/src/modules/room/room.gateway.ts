import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: process.env.ORIGIN,
    methods: ["POST", "GET", "PATCH", "DELETE"],
  },
  namespace: "room",
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("new-room")
  HandleNewRoom() {
    this.server.emit("refetch-all-rooms");
  }
}
