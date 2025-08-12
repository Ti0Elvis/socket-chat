import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomsGateway } from "./room.gateway";
import { UserModule } from "../user/user.module";
import { Room, RoomSchema } from "./room.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { RoomController } from "./room.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    UserModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, RoomsGateway],
})
export class RoomModule {}
