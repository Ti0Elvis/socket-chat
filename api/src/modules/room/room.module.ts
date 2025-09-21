import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { Room, RoomSchema } from "./room.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { RoomController } from "./room.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
