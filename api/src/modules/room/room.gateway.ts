import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Types } from "mongoose";
import { Server, Socket } from "socket.io";
import { RoomService } from "./room.service";

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: process.env.ORIGIN,
    methods: ["POST", "GET", "PATCH", "DELETE"],
  },
  namespace: "rooms",
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private _RoomService_: RoomService) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected to rooms: ${client.id}`);
  }

  /* 
    Bug: When a user opens the same room in two or more browser tabs, two socket connections are created. Each connection is independent. 
    When one tab closes and disconnects its socket, the server thinks the user left the room entirely, even though the other tab is still connected. 
    This causes the user to appear disconnected from the room, even though they are still connected from the other tab.
  */
  async handleDisconnect(client: Socket) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const room_id = client.data.room_id as Types.ObjectId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const clerk_id = client.data.clerk_id as string;

    if (room_id !== undefined && clerk_id !== undefined) {
      await this._RoomService_.Leave({
        room_id: room_id,
        user_id: clerk_id,
      });

      this.HandleRefetchAllRooms();
    }

    console.log(`Client disconnected to rooms: ${client.id}`);
  }

  HandleRefetchAllRooms() {
    this.server.emit("refetch-all-rooms");
  }

  @SubscribeMessage("new-room")
  HandleNewRoom() {
    this.HandleRefetchAllRooms();
  }

  @SubscribeMessage("delete-room")
  HandleDeleteRoom() {
    this.HandleRefetchAllRooms();
  }

  @SubscribeMessage("join")
  async HandleJoin(
    @MessageBody() data: { room_id: Types.ObjectId; clerk_id: string },
    @ConnectedSocket() client: Socket
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    client.data.room_id = data.room_id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    client.data.clerk_id = data.clerk_id;

    const response = await this._RoomService_.Join({
      room_id: data.room_id,
      user_id: data.clerk_id,
    });

    this.HandleRefetchAllRooms();
    client.emit("join-notification", { message: response });
  }

  @SubscribeMessage("leave")
  async HandleLeave(
    @MessageBody() data: { room_id: Types.ObjectId; clerk_id: string },
    @ConnectedSocket() client: Socket
  ) {
    const response = await this._RoomService_.Leave({
      room_id: data.room_id,
      user_id: data.clerk_id,
    });

    this.HandleRefetchAllRooms();
    client.emit("join-notification", { message: response });
  }
}
