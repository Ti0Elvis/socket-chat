import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import type { Types } from "mongoose";
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

  @WebSocketServer() private server: Server;

  private rooms_connections = new Map<string, Map<string, Set<string>>>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const room_id = client.data.room_id as Types.ObjectId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const clerk_id = client.data.clerk_id as string;

    if (room_id === undefined || clerk_id === undefined) {
      return;
    }

    const users_map = this.rooms_connections.get(room_id.toString());

    if (users_map === undefined) {
      return;
    }

    const connections = users_map.get(clerk_id);

    if (connections === undefined) {
      return;
    }

    connections.delete(client.id);

    if (connections.size === 0) {
      users_map.delete(clerk_id);
      await this._RoomService_.Leave({ room_id, clerk_id });
      this.server.emit("refetch-all-rooms");
    }

    if (users_map.size === 0) {
      this.rooms_connections.delete(room_id.toString());
    }

    console.log(`Client disconnected ${client.id}`);
  }

  @SubscribeMessage("new-room")
  HandleNewRoom() {
    this.server.emit("refetch-all-rooms");
  }

  @SubscribeMessage("delete-room")
  HandleDeleteRoom(@ConnectedSocket() client: Socket) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const room_id = client.data.room_id as Types.ObjectId;

    if (room_id !== undefined) {
      this.server.to(room_id.toString()).emit("redirect-to-rooms-page");
    }

    this.server.emit("refetch-all-rooms");
  }

  @SubscribeMessage("join")
  async HandleJoin(
    @MessageBody() data: { room_id: Types.ObjectId; clerk_id: string },
    @ConnectedSocket() client: Socket
  ) {
    const room_id = data.room_id;
    const clerk_id = data.clerk_id;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    client.data.room_id = room_id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    client.data.clerk_id = clerk_id;

    await client.join(data.room_id.toString());

    if (this.rooms_connections.has(room_id.toString()) === false) {
      this.rooms_connections.set(room_id.toString(), new Map());
    }

    const users_map = this.rooms_connections.get(room_id.toString())!;

    if (users_map.has(clerk_id) === false) {
      users_map.set(clerk_id, new Set());
    }

    users_map.get(clerk_id)!.add(client.id);

    try {
      const response = await this._RoomService_.Join(data);

      this.server.emit("refetch-all-rooms");
      client.emit("join-notification", { message: response });
    } catch (error) {
      console.error(error);
      client.emit("system-client-error", { message: "Error to join to room" });
    }
  }

  @SubscribeMessage("leave")
  async HandleLeave(
    @MessageBody() data: { room_id: Types.ObjectId; clerk_id: string },
    @ConnectedSocket() client: Socket
  ) {
    const room_id = data.room_id;
    const clerk_id = data.clerk_id;

    const users_map = this.rooms_connections.get(room_id.toString());

    if (users_map !== undefined) {
      users_map.delete(clerk_id);

      if (users_map.size === 0) {
        this.rooms_connections.delete(room_id.toString());
      }
    }
    await client.leave(data.room_id.toString());

    try {
      const response = await this._RoomService_.Leave(data);

      this.server.emit("refetch-all-rooms");
      client.emit("leave-notification", { message: response });
    } catch (error) {
      console.error(error);
      client.emit("system-client-error", {
        message: "Error to leave the room",
      });
    }
  }
}
